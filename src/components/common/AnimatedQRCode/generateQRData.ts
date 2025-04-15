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
    const qrcode = QRCode.create(value, { errorCorrectionLevel: 'M' });
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
  size: number = 200,
  darkColor: string = '#000000',
  lightColor: string = 'transparent'
): Promise<QRDot[]> => {
  try {
    // Generate the QR matrix using QRCode library
    const matrix = await generateQRMatrix(value);
    if (!matrix.length) return generateMockQRData(size);
    
    // Generate Cash App styled QR data from the matrix
    return generateCashAppStyledQRData(matrix, size);
  } catch (error) {
    console.error('Error generating QR data:', error);
    return generateMockQRData(size);
  }
};

/**
 * Generates QR data with Cash App styling from a matrix
 */
const generateCashAppStyledQRData = (matrix: boolean[][], size: number): QRDot[] => {
  const dots: QRDot[] = [];
  const canvasSize = 1000; // Use large canvas for precision
  const moduleCount = matrix.length;
  const padding = 0.05; // 5% padding on each side
  
  // Calculate the effective size (accounting for padding)
  const effectiveSize = canvasSize * (1 - 2 * padding);
  // Size of each dot
  const dotSize = effectiveSize / moduleCount;
  
  // Calculate center of the QR code
  const centerPoint = canvasSize / 2;
  
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (matrix[row][col]) {
        // Calculate position with padding
        const x = padding * canvasSize + col * dotSize;
        const y = padding * canvasSize + row * dotSize;
        
        // Determine if this is a position marker (corners)
        const isPositionMarker = (
          (row < 7 && col < 7) || // Top-left
          (row < 7 && col >= moduleCount - 7) || // Top-right
          (row >= moduleCount - 7 && col < 7) // Bottom-left
        );
        
        // Calculate distance from center (normalized to 0-1)
        const dx = x + dotSize / 2 - centerPoint;
        const dy = y + dotSize / 2 - centerPoint;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy) / (canvasSize / 2);
        
        dots.push({
          x: x / canvasSize * size,
          y: y / canvasSize * size,
          size: dotSize / canvasSize * size,
          isRound: !isPositionMarker,
          isPositionMarker,
          distanceFromCenter,
          row,
          col
        });
      }
    }
  }
  
  return dots;
};

/**
 * Fallback function to generate mock QR data if real generation fails
 */
const generateMockQRData = (size: number): QRDot[] => {
  const dots: QRDot[] = [];
  const moduleCount = 25; // Mock size
  const dotSize = size / moduleCount;
  
  // Generate a simple pattern
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      // Create a checkered pattern
      if ((row + col) % 3 === 0 || (row === col) || (row === moduleCount - col - 1)) {
        const isPositionMarker = (
          (row < 7 && col < 7) || 
          (row < 7 && col >= moduleCount - 7) || 
          (row >= moduleCount - 7 && col < 7)
        );
        
        // Calculate center of the QR code
        const centerPoint = size / 2;
        
        // Calculate distance from center (normalized to 0-1)
        const x = col * dotSize;
        const y = row * dotSize;
        const dx = x + dotSize / 2 - centerPoint;
        const dy = y + dotSize / 2 - centerPoint;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy) / (size / 2);
        
        dots.push({
          x,
          y,
          size: dotSize,
          isRound: !isPositionMarker,
          isPositionMarker,
          distanceFromCenter,
          row,
          col
        });
      }
    }
  }
  
  return dots;
}; 