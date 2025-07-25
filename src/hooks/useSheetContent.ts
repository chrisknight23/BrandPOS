import { useState, useEffect } from 'react';
import { TextContent, TextContentMap, TextContentVersion } from '../types/textContent';

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
  const [versionNames, setVersionNames] = useState<string[]>([]);
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
        
        // First row contains version names (after screen and messageKey columns)
        const versionNames = rows[0].slice(2);
        setVersionNames(versionNames);
        
        // Process content rows
        const contentMap: TextContentMap = {};
        rows.slice(1).forEach(row => {
          if (row[1]) { // If messageKey exists
            const versions: TextContentVersion[] = [];
            
            // Start from index 2 (after screen and messageKey)
            for (let i = 2; i < row.length; i++) {
              if (row[i]) {
                versions.push({
                  id: i - 1,
                  name: versionNames[i - 2] || `Version ${i - 1}`,
                  content: row[i]
                });
              }
            }
            
            contentMap[row[1]] = { versions };
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

  const getText = (messageKey: string, versionId: number = 1): string => {
    const versions = content[messageKey]?.versions || [];
    const version = versions.find(v => v.id === versionId);
    return version?.content || '';
  };

  const getVersions = () => {
    return Object.values(content)
      .flatMap(item => item.versions)
      .filter((v, i, arr) => arr.findIndex(x => x.id === v.id) === i)
      .sort((a, b) => a.id - b.id);
  };

  return {
    getText,
    getVersions,
    loading,
    error,
    refresh: () => {
      setLoading(true);
      setError(null);
    }
  };
}; 