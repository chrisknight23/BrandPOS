import QRCode from 'qrcode';
import { QRDot } from './types';
// Import the exact SVG paths for the QR code
import QRCodeSVG from '../../../assets/images/QRCode.svg';

interface QROptions {
  errorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high';
  margin?: number;
  scale?: number;
  width?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Generates a matrix representation of a QR code
 */
const generateQRMatrix = async (value: string): Promise<boolean[][]> => {
  try {
    // Create QR code instance directly
    const qrcode = QRCode.create(value, { errorCorrectionLevel: 'H' }); // Use high error correction
    const moduleCount = qrcode.modules.size;
    const matrix: boolean[][] = [];
    
    for (let row = 0; row < moduleCount; row++) {
      const newRow: boolean[] = [];
      for (let col = 0; col < moduleCount; col++) {
        newRow.push(!!qrcode.modules.get(row, col));
      }
      matrix.push(newRow);
    }
    
    return matrix;
  } catch (error) {
    console.error('Error generating QR matrix:', error);
    return []; // Return empty array on error
  }
};

/**
 * Generates QR code data with Cash App styling
 */
export const generateQRData = async (
  value: string,
  size: number = 200
): Promise<QRDot[]> => {
  try {
    // Generate the QR matrix using QRCode library
    const matrix = await generateQRMatrix(value);
    if (!matrix.length) return generateMockQRData(size);
    
    // Generate a standard QR code first
    const dots = createBasicQRDots(matrix, size);
    
    // Add position markers as separate custom elements
    addPositionMarkers(dots, size);
    
    // Add a clear area for the logo in the center
    removeDotsForLogo(dots, size);
    
    return dots;
  } catch (error) {
    console.error('Error generating QR data:', error);
    return generateMockQRData(size);
  }
};

/**
 * Creates basic QR dots from a matrix
 */
const createBasicQRDots = (matrix: boolean[][], size: number): QRDot[] => {
  const dots: QRDot[] = [];
  const moduleCount = matrix.length;
  
  // Use 4% padding for better scanning
  const padding = 0.04;
  const effectiveSize = size * (1 - 2 * padding);
  const dotSize = effectiveSize / moduleCount;
  const offset = size * padding;
  
  // Calculate center for distance calculation
  const centerPoint = size / 2;
  
  // Position marker areas (7x7 modules in three corners)
  const isInPositionMarkerArea = (row: number, col: number): boolean => {
    const markerSize = 7;
    return (
      // Top-left
      (row < markerSize && col < markerSize) ||
      // Top-right
      (row < markerSize && col >= moduleCount - markerSize) ||
      // Bottom-left
      (row >= moduleCount - markerSize && col < markerSize)
    );
  };
  
  // Create dots for each module
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      // Skip position marker areas - we'll add custom ones
      if (isInPositionMarkerArea(row, col)) {
        continue;
      }
      
      // Create dot for dark modules
      if (matrix[row][col]) {
        const x = offset + col * dotSize;
        const y = offset + row * dotSize;
        
        // Distance from center for animation ordering
        const dx = x + dotSize / 2 - centerPoint;
        const dy = y + dotSize / 2 - centerPoint;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy) / (size / 2);
        
        dots.push({
          x,
          y,
          size: dotSize * 0.95, // Slightly smaller dots
          isRound: true, // Regular dots are round
          distanceFromCenter,
          isPositionMarker: false,
          row,
          col,
          isHollow: false
        });
      }
    }
  }
  
  return dots;
};

/**
 * Adds custom position markers to the QR code
 */
const addPositionMarkers = (dots: QRDot[], size: number): void => {
  // Position marker size (approx 16% of total QR size)
  const markerSize = size * 0.16;
  
  // Add all three position markers
  addSinglePositionMarker(dots, 0, 0, markerSize, size); // Top-left
  addSinglePositionMarker(dots, size - markerSize, 0, markerSize, size); // Top-right
  addSinglePositionMarker(dots, 0, size - markerSize, markerSize, size); // Bottom-left
};

/**
 * Adds a single position marker at the specified coordinates
 */
const addSinglePositionMarker = (dots: QRDot[], x: number, y: number, size: number, totalSize: number): void => {
  const centerPoint = totalSize / 2;
  const distanceFromCenter = Math.sqrt(
    Math.pow(x + size / 2 - centerPoint, 2) + 
    Math.pow(y + size / 2 - centerPoint, 2)
  ) / (totalSize / 2);
  
  // Row and column (approximate)
  const row = Math.floor(y / (totalSize / 25));
  const col = Math.floor(x / (totalSize / 25));
  
  // Outer square (border)
  dots.push({
    x,
    y,
    size,
    isRound: false,
    distanceFromCenter,
    isPositionMarker: true,
    row,
    col,
    isHollow: true,
    cornerRadius: 0 // Sharp corners for position markers
  });
  
  // Inner square (solid)
  const innerSize = size * 0.6;
  const innerOffset = (size - innerSize) / 2;
  dots.push({
    x: x + innerOffset,
    y: y + innerOffset,
    size: innerSize,
    isRound: false,
    distanceFromCenter,
    isPositionMarker: true,
    row,
    col,
    isHollow: false,
    cornerRadius: 0 // Sharp corners for position markers
  });
};

/**
 * Removes dots from the center area to make space for a logo
 */
const removeDotsForLogo = (dots: QRDot[], size: number): void => {
  const logoSize = 60; // Fixed logo size of 60px
  const logoRadius = logoSize / 2;
  const centerPoint = size / 2;
  
  // Filter out dots that would be covered by the logo
  for (let i = dots.length - 1; i >= 0; i--) {
    const dot = dots[i];
    const dotCenterX = dot.x + dot.size / 2;
    const dotCenterY = dot.y + dot.size / 2;
    
    // Calculate distance from center
    const distanceFromCenter = Math.sqrt(
      Math.pow(dotCenterX - centerPoint, 2) + 
      Math.pow(dotCenterY - centerPoint, 2)
    );
    
    // Remove if dot is in logo area (with small margin)
    if (distanceFromCenter < logoRadius * 1.2) {
      dots.splice(i, 1);
    }
  }
};

/**
 * Fallback function to generate mock QR data
 */
const generateMockQRData = (size: number): QRDot[] => {
  const dots: QRDot[] = [];
  const moduleCount = 25; // Mock size
  const dotSize = size / moduleCount;
  const centerPoint = size / 2;
  
  // Add basic dots in a pattern
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if ((row + col) % 3 === 0 || row === col || row === moduleCount - col - 1) {
        const x = col * dotSize;
        const y = row * dotSize;
        
        // Skip corners where position markers will be
        if ((row < 7 && col < 7) || 
            (row < 7 && col >= moduleCount - 7) || 
            (row >= moduleCount - 7 && col < 7)) {
          continue;
        }
        
        // Skip center for logo
        const dx = x + dotSize / 2 - centerPoint;
        const dy = y + dotSize / 2 - centerPoint;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
        if (distanceFromCenter < 30) {
          continue;
        }
        
        dots.push({
          x,
          y,
          size: dotSize * 0.9,
          isRound: true,
          distanceFromCenter: distanceFromCenter / (size / 2),
          isPositionMarker: false,
          row,
          col,
          isHollow: false
        });
      }
    }
  }
  
  // Add position markers
  const markerSize = size * 0.16;
  addSinglePositionMarker(dots, 0, 0, markerSize, size); // Top-left
  addSinglePositionMarker(dots, size - markerSize, 0, markerSize, size); // Top-right
  addSinglePositionMarker(dots, 0, size - markerSize, markerSize, size); // Bottom-left
  
  return dots;
}; 