import { useState, useEffect } from 'react';
import { TextContent, TextContentMap } from '../types/textContent';

interface UseSheetContentProps {
  sheetId: string;
  sheetName?: string;
}

// Helper function to parse CSV line while preserving commas in quoted strings
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle escaped quotes
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  return result.map(field => field.replace(/^"|"$/g, ''));
};

export const useSheetContent = ({ sheetId, sheetName = 'Sheet1' }: UseSheetContentProps) => {
  const [content, setContent] = useState<TextContentMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from Google Sheets
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
        const response = await fetch(url);
        const csvData = await response.text();
        
        // Parse CSV data
        const rows = csvData.split('\n').map(row => parseCSVLine(row));
        
        // Skip header row and process data
        const contentMap: TextContentMap = {};
        rows.slice(1).forEach(row => {
          if (row[1]) { // If messageKey exists
            contentMap[row[1]] = {
              version1: row[2] || '',
              version2: row[3] || '',
              version3: row[4] || ''
            };
          }
        });
        
        setContent(contentMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [sheetId, sheetName]);

  const getText = (messageKey: string, version: 1 | 2 | 3 = 1): string => {
    const versionKey = `version${version}` as keyof Pick<TextContentMap[string], 'version1' | 'version2' | 'version3'>;
    return content[messageKey]?.[versionKey] || '';
  };

  return {
    getText,
    loading,
    error,
    refresh: () => {
      setLoading(true);
      setError(null);
    }
  };
}; 