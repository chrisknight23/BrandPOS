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
    margin: 0,
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
  
  // Add some padding around the markers and logo (in pixels)
  const padding = 8;
  
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
  // We'll position them at the corners with exact pixel size instead of grid-based
  createCornerMarker(0, 0); // Top-left
  createCornerMarker(0, Math.floor(matrixSize - (cornerSize / cellSize))); // Top-right
  createCornerMarker(Math.floor(matrixSize - (cornerSize / cellSize)), 0); // Bottom-left
  
  // Generate dots for the main QR code pattern
  const dotSize = cellSize * 0.75; // Slightly smaller dots for better visibility
  
  // Center for calculating distance
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Logo area to avoid placing dots - make it exactly the same size as the logo (60px)
  // but add padding around it
  const logoAreaSize = logoSize + (padding * 2);
  const logoOffset = Math.floor((size - logoAreaSize) / 2);
  
  // Process each module in the QR matrix
  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixSize; col++) {
      // Calculate the current position in pixels
      const posX = col * cellSize;
      const posY = row * cellSize;
      
      // Skip position marker areas - using exact pixel locations to match cornerSize
      // Add some padding to avoid dots running into the markers
      if ((posY < cornerSize + padding && posX < cornerSize + padding) || // Top-left with padding
          (posY < cornerSize + padding && posX > size - cornerSize - padding) || // Top-right with padding
          (posY > size - cornerSize - padding && posX < cornerSize + padding)) { // Bottom-left with padding
        continue;
      }
      
      // Skip center area for logo - using exact pixel locations for logo size
      // Add some padding to avoid dots running into the logo
      const halfLogo = logoAreaSize / 2;
      
      if (posX > centerX - halfLogo && posX < centerX + halfLogo &&
          posY > centerY - halfLogo && posY < centerY + halfLogo) {
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
  const padding = 8;
  
  // Create a simple pattern that looks like a QR code
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Calculate the position in pixels
      const posX = col * dotSize;
      const posY = row * dotSize;
      
      // Skip the corners for position markers (with padding)
      if ((posY < positionMarkerSize + padding && posX < positionMarkerSize + padding) || // Top-left with padding
          (posY < positionMarkerSize + padding && posX > size - positionMarkerSize - padding) || // Top-right with padding
          (posY > size - positionMarkerSize - padding && posX < positionMarkerSize + padding)) { // Bottom-left with padding
        continue;
      }
      
      // Skip center for logo - exactly match the logo size (with padding)
      const centerX = size / 2;
      const centerY = size / 2;
      const halfLogo = (logoSize + (padding * 2)) / 2;
      
      if (posX > centerX - halfLogo && posX < centerX + halfLogo &&
          posY > centerY - halfLogo && posY < centerY + halfLogo) {
        continue;
      }
      
      // Add some dots randomly to simulate QR code pattern
      if (Math.random() > 0.65) {
        const x = col * dotSize;
        const y = row * dotSize;
        const distanceFromCenter = Math.sqrt(
          Math.pow(x + dotSize / 2 - size / 2, 2) + 
          Math.pow(y + dotSize / 2 - size / 2, 2)
        );
        
        dots.push({
          x,
          y,
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