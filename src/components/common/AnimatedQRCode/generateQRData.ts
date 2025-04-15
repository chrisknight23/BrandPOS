import QRCode from 'qrcode';
import { QRDot } from './types';
// Import the exact SVG paths for the QR code
import QRCodeSVG from '../../../assets/images/QRCode.svg';

interface QROptions {
  value: string;
  size: number;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * Generates QR code data for animation based on the value
 */
export const generateQRData = async ({ 
  value, 
  size, 
  errorCorrection = 'M' 
}: QROptions): Promise<QRDot[]> => {
  try {
    console.log('Generating QR code for:', value);
    
    // Create QR code matrix using canvas-based approach
    const qrCodeMatrix = await generateMatrix(value, errorCorrection);
    
    // Convert matrix to QR dots with styling
    return createQRDots(qrCodeMatrix, size);
  } catch (error) {
    console.error('Error generating QR code:', error);
    return generateMockQRData(size);
  }
};

/**
 * Generate QR code matrix using QRCode library via canvas
 */
const generateMatrix = async (text: string, errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'): Promise<boolean[][]> => {
  return new Promise((resolve, reject) => {
    // Create a temporary canvas
    const canvas = document.createElement('canvas');
    
    // Generate QR code on canvas
    QRCode.toCanvas(canvas, text, {
      errorCorrectionLevel,
      margin: 0,
      scale: 1
    }, (error) => {
      if (error) {
        reject(error);
        return;
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Get image data from canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Create a matrix where true represents dark modules (black pixels)
      const matrix: boolean[][] = [];
      const size = canvas.width;
      
      for (let y = 0; y < size; y++) {
        const row: boolean[] = [];
        for (let x = 0; x < size; x++) {
          // Get the index in the image data (each pixel is 4 bytes - RGBA)
          const index = (y * size + x) * 4;
          // Check if the pixel is black (dark module)
          const isDark = data[index] === 0 && data[index + 1] === 0 && data[index + 2] === 0;
          row.push(isDark);
        }
        matrix.push(row);
      }
      
      resolve(matrix);
    });
  });
};

/**
 * Convert QR matrix to styled QR dots
 */
const createQRDots = (matrix: boolean[][], size: number): QRDot[] => {
  const dots: QRDot[] = [];
  const moduleCount = matrix.length;
  const moduleSize = size / moduleCount;
  
  // Logo and position marker settings
  const markerSize = 60; // Fixed 60px
  const markerModuleSize = Math.round(markerSize / moduleSize); // How many modules the marker covers
  const markerInnerSize = markerSize * 0.4;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Logo settings
  const logoSize = 60; // Fixed 60px for logo
  const logoModuleSize = Math.round(logoSize / moduleSize); // How many modules the logo covers
  const logoStartModule = Math.floor(moduleCount / 2 - logoModuleSize / 2);
  const logoEndModule = logoStartModule + logoModuleSize;
  
  // Create position markers
  createPositionMarker(dots, 0, 0, markerSize, markerInnerSize, centerX, centerY);
  createPositionMarker(dots, size - markerSize, 0, markerSize, markerInnerSize, centerX, centerY);
  createPositionMarker(dots, 0, size - markerSize, markerSize, markerInnerSize, centerX, centerY);
  
  // Create dots for QR code data
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      // Skip if in position marker areas (top-left, top-right, bottom-left corners)
      if ((row < markerModuleSize && col < markerModuleSize) || // Top-left
          (row < markerModuleSize && col >= moduleCount - markerModuleSize) || // Top-right
          (row >= moduleCount - markerModuleSize && col < markerModuleSize)) { // Bottom-left
        continue;
      }
      
      // Skip if in logo area (center)
      if (row >= logoStartModule && row < logoEndModule && 
          col >= logoStartModule && col < logoEndModule) {
        continue;
      }
      
      // Only create dots for dark modules
      if (matrix[row][col]) {
        const x = col * moduleSize;
        const y = row * moduleSize;
        const dotSize = moduleSize * 0.8; // Slightly smaller than module size
        const offsetX = (moduleSize - dotSize) / 2;
        const offsetY = (moduleSize - dotSize) / 2;
        
        // Calculate distance from center for animation ordering
        const distanceFromCenter = Math.sqrt(
          Math.pow((x + moduleSize / 2) - centerX, 2) + 
          Math.pow((y + moduleSize / 2) - centerY, 2)
        );
        
        dots.push({
          x: x + offsetX,
          y: y + offsetY,
          size: dotSize,
          isRound: true,
          distanceFromCenter,
          isPositionMarker: false,
          row,
          col,
          isHollow: false
        });
      }
    }
  }
  
  console.log('Generated QR code with', dots.length, 'dots');
  return dots;
};

/**
 * Helper function to create position markers
 */
const createPositionMarker = (
  dots: QRDot[], 
  x: number, 
  y: number, 
  size: number, 
  innerSize: number,
  centerX: number,
  centerY: number
): void => {
  // Calculate distance for animation timing
  const distanceFromCenter = Math.sqrt(
    Math.pow(x + size/2 - centerX, 2) + 
    Math.pow(y + size/2 - centerY, 2)
  );
  
  // Row and column (approximate based on position)
  const row = Math.floor(y / (centerY * 2 / 25));
  const col = Math.floor(x / (centerX * 2 / 25));
  
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
    cornerRadius: size * 0.25 // Rounded corners - 25% of size
  });
  
  // Inner square (solid)
  const innerX = x + (size - innerSize) / 2;
  const innerY = y + (size - innerSize) / 2;
  
  dots.push({
    x: innerX,
    y: innerY,
    size: innerSize,
    isRound: false,
    distanceFromCenter,
    isPositionMarker: true,
    row,
    col,
    isHollow: false,
    cornerRadius: innerSize * 0.25 // Rounded corners - 25% of size
  });
};

/**
 * Fallback to generate mock QR data if real generation fails
 */
export const generateMockQRData = (size: number): QRDot[] => {
  const dots: QRDot[] = [];
  const gridSize = 25; // Fixed grid size for consistent proportions
  const dotSize = size / gridSize;
  
  // Logo and marker sizes
  const logoSize = 60;
  const positionMarkerSize = 60;
  const innerMarkerSize = positionMarkerSize * 0.4;
  
  // Padding around markers and logo
  const padding = 4;
  
  // Center point
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Create a realistic QR code pattern
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = col * dotSize;
      const y = row * dotSize;
      
      // Skip position marker areas
      const markerWidth = Math.ceil(positionMarkerSize / dotSize);
      if ((row < markerWidth && col < markerWidth) || // Top-left
          (row < markerWidth && col >= gridSize - markerWidth) || // Top-right
          (row >= gridSize - markerWidth && col < markerWidth)) { // Bottom-left
        continue;
      }
      
      // Skip center for logo
      const logoModules = Math.ceil(logoSize / dotSize);
      const logoStart = Math.floor(gridSize / 2 - logoModules / 2);
      const logoEnd = logoStart + logoModules;
      
      if (row >= logoStart && row < logoEnd && col >= logoStart && col < logoEnd) {
        continue;
      }
      
      // Add dots in a pattern that resembles a QR code
      // More dots around the edges, fewer near the center
      const distanceFromCenter = Math.sqrt(
        Math.pow(x + dotSize/2 - centerX, 2) + 
        Math.pow(y + dotSize/2 - centerY, 2)
      );
      
      const normalizedDistance = distanceFromCenter / (size / 2);
      const dotProbability = 0.3 + normalizedDistance * 0.3;
      
      if (Math.random() < dotProbability) {
        const dotX = x + (dotSize - dotSize * 0.8) / 2;
        const dotY = y + (dotSize - dotSize * 0.8) / 2;
        
        dots.push({
          x: dotX,
          y: dotY,
          size: dotSize * 0.8,
          isRound: true,
          distanceFromCenter,
          isPositionMarker: false,
          row,
          col,
          isHollow: false
        });
      }
    }
  }
  
  // Add position markers
  // Top-left
  createPositionMarker(dots, 0, 0, positionMarkerSize, innerMarkerSize, centerX, centerY);
  
  // Top-right
  createPositionMarker(dots, size - positionMarkerSize, 0, positionMarkerSize, innerMarkerSize, centerX, centerY);
  
  // Bottom-left
  createPositionMarker(dots, 0, size - positionMarkerSize, positionMarkerSize, innerMarkerSize, centerX, centerY);
  
  console.log('Generated mock QR data with', dots.length, 'dots');
  return dots;
}; 