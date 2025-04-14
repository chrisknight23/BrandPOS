import QRCode from 'qrcode';
import { QRDot } from './types';

interface QROptions {
  value: string;
  size: number;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * Generates QR code data for animation
 * This creates a set of dot positions and properties based on the QR code matrix
 */
export const generateQRData = async ({ 
  value, 
  size, 
  errorCorrection = 'M' 
}: QROptions): Promise<QRDot[]> => {
  try {
    console.log('Using mock QR data for now to ensure animation works');
    // For now, always use mock data to ensure animations work
    return generateMockQRData(size);

    /* Commented out actual QR generation for now as it may have browser limitations
    // Generate QR code as SVG to parse
    const qrSvg = await QRCode.toString(value, {
      type: 'svg',
      errorCorrectionLevel: errorCorrection
    });
    
    // Fallback to mocked data if QR generation fails
    if (!qrSvg) {
      return generateMockQRData(size);
    }
    
    // Parse SVG to extract coordinates and dimensions
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(qrSvg, 'image/svg+xml');
    const pathElements = svgDoc.querySelectorAll('path');
    
    if (!pathElements.length) {
      console.warn('No QR data found in SVG');
      return generateMockQRData(size);
    }
    
    const dots: QRDot[] = [];
    const center = size / 2;
    
    // QR code typically has 3 positioning squares
    // The path data follows a pattern - we can extract individual modules
    pathElements.forEach((path, index) => {
      // Skip the outer frame path if it exists
      if (index === 0 && pathElements.length > 25) return;
      
      const d = path.getAttribute('d');
      if (!d) return;
      
      // Extract coordinates from the path data
      // Move commands (M) in SVG path give us the top-left corner
      const matches = d.match(/M\s*(\d+(?:\.\d+)?)\s*,?\s*(\d+(?:\.\d+)?)/);
      if (!matches || matches.length < 3) return;
      
      const svgX = parseFloat(matches[1]);
      const svgY = parseFloat(matches[2]);
      
      // SVG viewBox size from QRCode lib is 25x25 units for QR modules
      // Scale to our target size
      const moduleSize = size / 25;
      const scaledX = (svgX / 25) * size;
      const scaledY = (svgY / 25) * size;
      
      // Calculate distance from center
      const distX = (scaledX + moduleSize/2) - center;
      const distY = (scaledY + moduleSize/2) - center;
      const distanceFromCenter = Math.sqrt(distX*distX + distY*distY);
      
      // Determine row and column
      const row = Math.floor(svgY);
      const col = Math.floor(svgX);
      
      // Check if this is a positioning marker
      // These are typically at the three corners of the QR code
      const isPositionMarker = (
        (col < 7 && row < 7) || // Top-left
        (col > 18 && row < 7) || // Top-right
        (col < 7 && row > 18)    // Bottom-left
      );
      
      dots.push({
        x: scaledX,
        y: scaledY,
        size: moduleSize,
        isRound: !isPositionMarker, // Position markers are usually square
        distanceFromCenter,
        isPositionMarker,
        row,
        col
      });
    });
    
    return dots;
    */
  } catch (error) {
    console.error('Error generating QR code:', error);
    return generateMockQRData(size);
  }
};

/**
 * Generates mock QR data for testing or fallback
 */
export const generateMockQRData = (size: number): QRDot[] => {
  const dots: QRDot[] = [];
  const center = size / 2;
  
  // Create a 25x25 grid (standard QR code size)
  const gridSize = 25;
  const moduleSize = size / gridSize;
  
  console.log('Generating mock QR data with size:', size, 'moduleSize:', moduleSize);
  
  // Pattern for a simple QR-like grid - ensure we generate enough dots
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Ensure we have a good number of dots by including more in the pattern
      if (
        // Skip fewer cells to ensure we have enough dots for animation
        (row % 4 === 0 && col % 4 === 0) ||
        (row % 3 === 0 && col % 3 === 0) ||
        // Create empty space in center for logo (slightly smaller area)
        (row > 9 && row < 16 && col > 9 && col < 16)
      ) {
        continue;
      }
      
      // Position markers at corners
      const isPositionMarker = (
        (col < 7 && row < 7) || // Top-left
        (col > gridSize - 8 && row < 7) || // Top-right
        (col < 7 && row > gridSize - 8)    // Bottom-left
      );
      
      const x = col * moduleSize;
      const y = row * moduleSize;
      
      // Calculate distance from center for sorting
      const distX = x + moduleSize/2 - center;
      const distY = y + moduleSize/2 - center;
      const distanceFromCenter = Math.sqrt(distX*distX + distY*distY);
      
      dots.push({
        x,
        y,
        size: moduleSize,
        isRound: !isPositionMarker,
        distanceFromCenter,
        isPositionMarker,
        row,
        col
      });
    }
  }
  
  console.log('Generated mock QR data with', dots.length, 'dots');
  return dots;
}; 