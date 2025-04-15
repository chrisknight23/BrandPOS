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
    console.log('Generating functional Cash App styled QR code for:', value);
    
    // Get QR code data using a simpler approach
    const matrix = await generateQRMatrix(value, errorCorrection);
    
    // Generate styled QR code dots
    return generateStyledQRData(matrix, size);
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Fallback to mock data if real generation fails
    return generateMockQRData(size);
  }
};

/**
 * Generate QR code matrix data using QRCode library
 */
const generateQRMatrix = async (
  text: string, 
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
): Promise<boolean[][]> => {
  // Create a QR code in a canvas and extract the matrix
  const options = { 
    errorCorrectionLevel,
    margin: 0, // No margin to ensure proper data density
    scale: 1
  };
  
  // Create a temporary canvas to generate the QR code
  const canvas = document.createElement('canvas');
  
  // Return a promise that resolves with the QR matrix
  return new Promise((resolve, reject) => {
    QRCode.toCanvas(canvas, text, options, (error) => {
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
          // If R, G, B are all 0, it's a black pixel
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
 * Generates QR dot data with Cash App styling based on the QR matrix
 */
const generateStyledQRData = (qrMatrix: boolean[][], size: number): QRDot[] => {
  const dots: QRDot[] = [];
  
  // Get the size of the QR matrix
  const matrixSize = qrMatrix.length;
  
  // Calculate cell size based on container size
  const cellSize = size / matrixSize;
  
  // Get the logo size from the SVG (60px)
  const logoSize = 60;
  
  // Use smaller padding to avoid removing too much QR data
  const padding = 6; // Reduced from 12 to ensure scanning works
  
  // Position marker dimensions - make them exactly match the logo size (60px)
  const cornerSize = logoSize;
  const cornerInnerSize = cornerSize * 0.4; // 40% of outer size
  
  // Function to create position markers that align with corners
  const createCornerMarker = (row: number, col: number) => {
    // Calculate position - align exactly with the grid
    const posX = col * cellSize;
    const posY = row * cellSize;
    
    // Calculate center of the marker
    const centerX = posX + cornerSize/2;
    const centerY = posY + cornerSize/2;
    
    // Distance from center for animation timing
    const distanceFromCenter = Math.sqrt(
      Math.pow(centerX - size/2, 2) + 
      Math.pow(centerY - size/2, 2)
    );
    
    // Outer square (border)
    dots.push({
      x: posX,
      y: posY,
      size: cornerSize,
      isRound: false,
      distanceFromCenter,
      isPositionMarker: true,
      row,
      col,
      isHollow: true,
      cornerRadius: cornerSize * 0.25 // Rounded corners - 25% of size
    });
    
    // Inner square (solid)
    const innerX = posX + (cornerSize - cornerInnerSize) / 2;
    const innerY = posY + (cornerSize - cornerInnerSize) / 2;
    
    dots.push({
      x: innerX,
      y: innerY,
      size: cornerInnerSize,
      isRound: false,
      distanceFromCenter,
      isPositionMarker: true,
      row,
      col,
      isHollow: false,
      cornerRadius: cornerInnerSize * 0.25 // Rounded corners - 25% of size
    });
  };
  
  // Create position markers at fixed locations at corners
  createCornerMarker(0, 0); // Top-left
  
  // Calculate top-right position to ensure it's exactly at the right edge
  // This ensures proper alignment with the QR code matrix
  const topRightCol = Math.floor((size - cornerSize) / cellSize);
  createCornerMarker(0, topRightCol); // Top-right
  
  // Calculate bottom-left position to ensure it's exactly at the bottom edge
  const bottomLeftRow = Math.floor((size - cornerSize) / cellSize);
  createCornerMarker(bottomLeftRow, 0); // Bottom-left
  
  // Generate dots for the main QR code pattern
  const dotSize = cellSize * 0.9; // Increased dot size (was 0.75) for better scanning
  
  // Center for calculating distance
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Logo area to avoid placing dots - make it exactly the same size as the logo (60px)
  // but add less padding to preserve QR code data
  const logoAreaSize = logoSize + padding; // Reduced padding for logo area
  const logoOffset = Math.floor((size - logoAreaSize) / 2);
  
  // Process each module in the QR matrix
  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixSize; col++) {
      // Calculate the current position in pixels
      const posX = col * cellSize;
      const posY = row * cellSize;
      
      // Modified padding calculation for position markers
      // Don't remove essential QR code data
      const leftMargin = cornerSize + (padding / 2);
      const rightMargin = size - cornerSize - (padding / 2);
      const bottomMargin = size - cornerSize - (padding / 2);
      
      // Only skip areas that are INSIDE the corner markers
      if ((posY < cornerSize && posX < cornerSize) || // Top-left
          (posY < cornerSize && posX > rightMargin) || // Top-right
          (posY > bottomMargin && posX < cornerSize)) { // Bottom-left
        continue;
      }
      
      // Skip center area for logo - using reduced padding to preserve QR data
      const halfLogo = logoSize / 2;
      const logoPadding = padding / 2;
      
      if (posX > centerX - halfLogo - logoPadding && 
          posX < centerX + halfLogo + logoPadding &&
          posY > centerY - halfLogo - logoPadding && 
          posY < centerY + halfLogo + logoPadding) {
        continue;
      }
      
      // Only create a dot if this position is dark in the QR matrix
      if (qrMatrix[row][col]) {
        // Calculate position based on grid
        const x = col * cellSize + (cellSize - dotSize) / 2; // Center in cell
        const y = row * cellSize + (cellSize - dotSize) / 2;
        
        // Calculate distance from center for animation ordering
        const distanceFromCenter = Math.sqrt(
          Math.pow((x + dotSize / 2) - centerX, 2) + 
          Math.pow((y + dotSize / 2) - centerY, 2)
        );
        
        // Remove the additional distance check that was removing too many dots
        // This was likely causing the scanning issue
        
        // Add the dot with Cash App styling
        dots.push({
          x,
          y,
          size: dotSize,
          isRound: true, // Use round dots for standard QR code elements
          distanceFromCenter,
          isPositionMarker: false,
          row,
          col,
          isHollow: false,
          cornerRadius: undefined // No corner radius for regular dots
        });
      }
    }
  }
  
  console.log('Generated styled QR code with', dots.length, 'dots');
  return dots;
};

/**
 * Fallback to generate mock QR data if real generation fails
 */
export const generateMockQRData = (size: number): QRDot[] => {
  const dots: QRDot[] = [];
  const gridSize = 25; // Fixed grid size for consistent proportions
  const dotSize = size / gridSize;
  
  // Match the logo size (60px)
  const logoSize = 60;
  const positionMarkerSize = logoSize; // Set same size as logo
  const innerMarkerSize = positionMarkerSize * 0.4; // 40% of outer size
  
  // Add some padding around the markers and logo (in pixels)
  const padding = 6; // Reduced padding (was 12)
  
  // Create a simple pattern that looks like a QR code
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Calculate the position in pixels
      const posX = col * dotSize;
      const posY = row * dotSize;
      
      // Use tighter padding for position markers
      if ((posY < positionMarkerSize && posX < positionMarkerSize) || // Top-left
          (posY < positionMarkerSize && posX > size - positionMarkerSize) || // Top-right
          (posY > size - positionMarkerSize && posX < positionMarkerSize)) { // Bottom-left
        continue;
      }
      
      // Skip center for logo - with minimal padding
      const centerX = size / 2;
      const centerY = size / 2;
      const halfLogo = logoSize / 2;
      const logoPadding = padding / 2;
      
      if (posX > centerX - halfLogo - logoPadding && 
          posX < centerX + halfLogo + logoPadding &&
          posY > centerY - halfLogo - logoPadding && 
          posY < centerY + halfLogo + logoPadding) {
        continue;
      }
      
      // Add more dots for higher density QR code simulation
      if (Math.random() > 0.55) { // Increased probability (was 0.65)
        const x = col * dotSize;
        const y = row * dotSize;
        const distanceFromCenter = Math.sqrt(
          Math.pow(x + dotSize / 2 - size / 2, 2) + 
          Math.pow(y + dotSize / 2 - size / 2, 2)
        );
        
        dots.push({
          x,
          y,
          size: dotSize * 0.9, // Slightly larger dots (multiplier was not present before)
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
  
  // Create position markers - use exact pixel sizes rather than grid-based
  // Top-left
  dots.push({
    x: 0,
    y: 0,
    size: positionMarkerSize,
    isRound: false,
    distanceFromCenter: Math.sqrt(Math.pow(positionMarkerSize/2 - size/2, 2) + Math.pow(positionMarkerSize/2 - size/2, 2)),
    isPositionMarker: true,
    row: 0,
    col: 0,
    isHollow: true,
    cornerRadius: positionMarkerSize * 0.25
  });
  
  dots.push({
    x: (positionMarkerSize - innerMarkerSize) / 2,
    y: (positionMarkerSize - innerMarkerSize) / 2,
    size: innerMarkerSize,
    isRound: false,
    distanceFromCenter: Math.sqrt(Math.pow(positionMarkerSize/2 - size/2, 2) + Math.pow(positionMarkerSize/2 - size/2, 2)),
    isPositionMarker: true,
    row: 0,
    col: 0,
    isHollow: false,
    cornerRadius: innerMarkerSize * 0.25
  });
  
  // Top-right
  dots.push({
    x: size - positionMarkerSize,
    y: 0,
    size: positionMarkerSize,
    isRound: false,
    distanceFromCenter: Math.sqrt(Math.pow((size - positionMarkerSize/2) - size/2, 2) + Math.pow(positionMarkerSize/2 - size/2, 2)),
    isPositionMarker: true,
    row: 0,
    col: gridSize - Math.floor(positionMarkerSize / dotSize),
    isHollow: true,
    cornerRadius: positionMarkerSize * 0.25
  });
  
  dots.push({
    x: size - positionMarkerSize + (positionMarkerSize - innerMarkerSize) / 2,
    y: (positionMarkerSize - innerMarkerSize) / 2,
    size: innerMarkerSize,
    isRound: false,
    distanceFromCenter: Math.sqrt(Math.pow((size - positionMarkerSize/2) - size/2, 2) + Math.pow(positionMarkerSize/2 - size/2, 2)),
    isPositionMarker: true,
    row: 0,
    col: gridSize - Math.floor(positionMarkerSize / dotSize),
    isHollow: false,
    cornerRadius: innerMarkerSize * 0.25
  });
  
  // Bottom-left
  dots.push({
    x: 0,
    y: size - positionMarkerSize,
    size: positionMarkerSize,
    isRound: false,
    distanceFromCenter: Math.sqrt(Math.pow(positionMarkerSize/2 - size/2, 2) + Math.pow((size - positionMarkerSize/2) - size/2, 2)),
    isPositionMarker: true,
    row: gridSize - Math.floor(positionMarkerSize / dotSize),
    col: 0,
    isHollow: true,
    cornerRadius: positionMarkerSize * 0.25
  });
  
  dots.push({
    x: (positionMarkerSize - innerMarkerSize) / 2,
    y: size - positionMarkerSize + (positionMarkerSize - innerMarkerSize) / 2,
    size: innerMarkerSize,
    isRound: false,
    distanceFromCenter: Math.sqrt(Math.pow(positionMarkerSize/2 - size/2, 2) + Math.pow((size - positionMarkerSize/2) - size/2, 2)),
    isPositionMarker: true,
    row: gridSize - Math.floor(positionMarkerSize / dotSize),
    col: 0,
    isHollow: false,
    cornerRadius: innerMarkerSize * 0.25
  });
  
  console.log('Generated mock QR data with', dots.length, 'dots');
  return dots;
}; 