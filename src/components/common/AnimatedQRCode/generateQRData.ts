import QRCode from 'qrcode';
import { QRDot } from './types';
// Import the exact SVG paths for the QR code
import QRCodeSVG from '../../../assets/images/QRCode.svg';

// Define options for QR code generation
export interface QRDataOptions {
  value: string;
  size?: number;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * Generate QR code data with Cash App styling
 */
export const generateQRData = async ({ 
  value, 
  size = 300, 
  errorCorrection = 'M' 
}: QRDataOptions): Promise<QRDot[]> => {
  try {
    // Generate a matrix of booleans representing the QR code
    const matrix = await generateQRMatrix(value, errorCorrection);
    
    // Convert the matrix to QRDot objects with Cash App styling
    return generateCashAppStyledQRData(matrix, size);
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Fall back to a smaller set of dots if there was an error
    return generateMockQRData(size);
  }
};

/**
 * Generate a QR code matrix from a value
 */
const generateQRMatrix = (value: string, errorCorrection: 'L' | 'M' | 'Q' | 'H'): Promise<boolean[][]> => {
  return new Promise((resolve, reject) => {
    // Use toDataURL to leverage QRCode's internal matrix generation
    QRCode.toDataURL(value, {
      errorCorrectionLevel: errorCorrection,
      margin: 0, // No margin needed as we'll handle padding ourselves
    }, (err, url) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Extract the matrix from the QRCode instance
      // @ts-ignore - We're using internal QRCode properties
      const matrix = QRCode.create(value, { 
        errorCorrectionLevel: errorCorrection
      }).modules.data;
      
      // Convert the flat array to a 2D boolean matrix
      const moduleCount = Math.sqrt(matrix.length);
      const booleanMatrix: boolean[][] = [];
      
      for (let row = 0; row < moduleCount; row++) {
        const rowData: boolean[] = [];
        for (let col = 0; col < moduleCount; col++) {
          // QR modules are dark when true
          rowData.push(!!matrix[row * moduleCount + col]);
        }
        booleanMatrix.push(rowData);
      }
      
      resolve(booleanMatrix);
    });
  });
};

/**
 * Convert a QR matrix to QRDot objects with Cash App styling
 */
const generateCashAppStyledQRData = (matrix: boolean[][], size: number): QRDot[] => {
  const dots: QRDot[] = [];
  const moduleCount = matrix.length;
  
  // Apply 5% padding on each side
  const padding = size * 0.05;
  const effectiveSize = size - padding * 2;
  
  // Calculate the size of each dot
  const dotSize = effectiveSize / moduleCount;
  
  // Center position of the QR code
  const center = size / 2;
  
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      // Only create dots for dark modules
      if (matrix[row][col]) {
        // Check if this dot is part of a position marker
        const isPositionMarker = (
          // Top-left position marker
          (row < 7 && col < 7) ||
          // Top-right position marker
          (row < 7 && col >= moduleCount - 7) ||
          // Bottom-left position marker
          (row >= moduleCount - 7 && col < 7)
        );
        
        // Calculate x and y positions with padding
        const x = padding + col * dotSize;
        const y = padding + row * dotSize;
        
        // Calculate distance from center (normalized to 0-1)
        const dx = x + dotSize / 2 - center;
        const dy = y + dotSize / 2 - center;
        const distance = Math.sqrt(dx * dx + dy * dy) / (size / 2);
        
        dots.push({
          x,
          y,
          size: dotSize,
          isRound: !isPositionMarker, // Make position markers square
          distanceFromCenter: distance,
          isPositionMarker,
          row,
          col
        });
      }
    }
  }
  
  return dots;
};

/**
 * Generate mock QR data (used as a fallback)
 */
const generateMockQRData = (size: number): QRDot[] => {
  const dots: QRDot[] = [];
  const mockModuleCount = 21; // Minimum QR code size
  
  // Apply 5% padding on each side
  const padding = size * 0.05;
  const effectiveSize = size - padding * 2;
  const dotSize = effectiveSize / mockModuleCount;
  const center = size / 2;
  
  // Generate a minimal set of dots in a grid pattern
  for (let row = 0; row < mockModuleCount; row += 2) {
    for (let col = 0; col < mockModuleCount; col += 2) {
      const x = padding + col * dotSize;
      const y = padding + row * dotSize;
      
      const dx = x + dotSize / 2 - center;
      const dy = y + dotSize / 2 - center;
      const distance = Math.sqrt(dx * dx + dy * dy) / (size / 2);
      
      const isPositionMarker = (
        (row < 7 && col < 7) ||
        (row < 7 && col >= mockModuleCount - 7) ||
        (row >= mockModuleCount - 7 && col < 7)
      );
      
      dots.push({
        x,
        y,
        size: dotSize,
        isRound: !isPositionMarker,
        distanceFromCenter: distance,
        isPositionMarker,
        row,
        col
      });
    }
  }
  
  return dots;
}; 