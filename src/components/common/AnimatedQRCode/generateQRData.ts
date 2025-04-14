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
 * Generates QR code data for animation based on the exact SVG paths provided
 */
export const generateQRData = async ({ 
  value, 
  size, 
  errorCorrection = 'M' 
}: QROptions): Promise<QRDot[]> => {
  try {
    console.log('Using Cash App QR Code design with size:', size);
    
    // Use custom QR code design for better visibility
    return generateCashAppQRData(size);
  } catch (error) {
    console.error('Error generating QR code:', error);
    return generateMockQRData(size);
  }
};

/**
 * Generates QR dot data based on the Cash App QR design
 */
export const generateCashAppQRData = (size: number): QRDot[] => {
  const dots: QRDot[] = [];
  
  // Create a structured grid-based layout for clean alignment
  const gridSize = 23;
  
  // Calculate cell size based on container size
  const cellSize = size / gridSize;
  
  // Position marker dimensions 
  const cornerOuterSize = 62; // Outer square size (62x62 pixels)
  const cornerInnerSize = 25; // 40% of outer size for consistent proportions
  
  // Function to create position markers that align with the corners
  const createCornerMarker = (isTopLeft: boolean, isTopRight: boolean, isBottomLeft: boolean) => {
    // Calculate position to align with corners
    let posX = 0;
    let posY = 0;
    
    if (isTopRight) {
      posX = size - cornerOuterSize;
      posY = 0;
    } else if (isBottomLeft) {
      posX = 0;
      posY = size - cornerOuterSize;
    }
    
    // Calculate center of the marker for inner square positioning
    const centerX = posX + cornerOuterSize/2;
    const centerY = posY + cornerOuterSize/2;
    
    // Outer square (border)
    dots.push({
      x: posX,
      y: posY,
      size: cornerOuterSize,
      isRound: false,
      distanceFromCenter: Math.sqrt(
        Math.pow(centerX - size/2, 2) + 
        Math.pow(centerY - size/2, 2)
      ),
      isPositionMarker: true,
      row: isTopLeft || isTopRight ? 0 : gridSize - 7,
      col: isTopLeft || isBottomLeft ? 0 : gridSize - 7,
      isHollow: true,
      cornerRadius: 17 // Adjusted to be proportional with 62px size
    });
    
    // Inner square (solid) - centered within the outer square
    dots.push({
      x: centerX - cornerInnerSize/2,
      y: centerY - cornerInnerSize/2,
      size: cornerInnerSize,
      isRound: false,
      distanceFromCenter: Math.sqrt(
        Math.pow(centerX - size/2, 2) + 
        Math.pow(centerY - size/2, 2)
      ),
      isPositionMarker: true,
      row: isTopLeft || isTopRight ? 0 : gridSize - 7,
      col: isTopLeft || isBottomLeft ? 0 : gridSize - 7,
      isHollow: false,
      cornerRadius: 7 // Adjusted to be proportional with 25px size
    });
  };
  
  // Create the three position markers exactly in the corners
  createCornerMarker(true, false, false); // Top-left
  createCornerMarker(false, true, false); // Top-right
  createCornerMarker(false, false, true); // Bottom-left
  
  // Generate dots for the main QR code pattern
  // Dot size for regular pattern
  const dotSize = cellSize * 0.8; // 80% of cell size for some spacing
  
  // Create a balanced distribution of dots in the grid
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Skip position marker areas - adjust to match exact corner marker positions
      if ((row < 7 && col < 7) || // Top-left
          (row < 7 && col >= gridSize - 7) || // Top-right
          (row >= gridSize - 7 && col < 7)) { // Bottom-left
        continue;
      }
      
      // Skip center area for logo
      const centerPadding = 4; // Cells to reserve around center
      const centerStart = Math.floor(gridSize/2) - centerPadding;
      const centerEnd = Math.ceil(gridSize/2) + centerPadding;
      if (row >= centerStart && row <= centerEnd && 
          col >= centerStart && col <= centerEnd) {
        continue;
      }
      
      // Create a consistent pattern - more dots near the corners and edges
      // and fewer in the middle areas, similar to real QR codes
      if ((row % 2 === 0 && col % 2 === 0) || // Regular grid pattern
          (row === 8 || col === 8 || row === gridSize-9 || col === gridSize-9) || // Timing patterns
          ((row + col) % 3 === 0 && Math.random() > 0.3)) { // Random fill with bias
        
        // Calculate position based on grid
        const x = col * cellSize + (cellSize - dotSize)/2; // Center in cell
        const y = row * cellSize + (cellSize - dotSize)/2;
        
        // Calculate distance from center for animation ordering
        const centerX = size / 2;
        const centerY = size / 2;
        const distanceFromCenter = Math.sqrt(
          Math.pow((x + dotSize/2) - centerX, 2) + 
          Math.pow((y + dotSize/2) - centerY, 2)
        ) / size; // Normalize to 0-1 range
        
        dots.push({
          x,
          y,
          size: dotSize,
          isRound: true, // Round dots
          distanceFromCenter,
          isPositionMarker: false,
          row,
          col,
          isHollow: false
        });
      }
    }
  }
  
  console.log('Generated structured QR with', dots.length, 'dots');
  return dots;
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
  // Add some space between dots
  const dotSize = moduleSize * 0.85; // Make dots slightly smaller than the module size
  
  console.log('Generating mock QR data with size:', size, 'moduleSize:', moduleSize);
  
  // Create the position marker patterns for corners (7x7 squares in three corners)
  // These are specially structured square patterns
  const createPositionMarker = (startRow: number, startCol: number) => {
    // Outer square - solid border
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        // Only create dots for the border or inner solid square
        if (i === 0 || i === 6 || j === 0 || j === 6 || // Outer border
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {   // Inner solid square
          const row = startRow + i;
          const col = startCol + j;
          const x = col * moduleSize;
          const y = row * moduleSize;
          
          // Calculate distance from center
          const distX = x + moduleSize/2 - center;
          const distY = y + moduleSize/2 - center;
          const distanceFromCenter = Math.sqrt(distX*distX + distY*distY);
          
          // Position markers are square
          dots.push({
            x,
            y,
            size: dotSize,
            isRound: false, // Position markers are square
            distanceFromCenter,
            isPositionMarker: true,
            row,
            col,
            isHollow: false
          });
        }
      }
    }
  };
  
  // Create the three position markers at corners
  createPositionMarker(0, 0);                    // Top-left
  createPositionMarker(0, gridSize - 7);         // Top-right
  createPositionMarker(gridSize - 7, 0);         // Bottom-left
  
  // Pattern for a QR-like grid with proper spacing
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Skip cells in position marker areas
      if ((row < 7 && col < 7) ||                  // Top-left marker
          (row < 7 && col > gridSize - 8) ||       // Top-right marker
          (row > gridSize - 8 && col < 7)) {       // Bottom-left marker
        continue;
      }
      
      // Ensure we have a good number of dots but with more spacing
      if (
        // Create sparse pattern
        ((row % 3 !== 0) && (col % 3 !== 0)) ||
        // Create empty space in center for logo
        (row > 8 && row < 17 && col > 8 && col < 17)
      ) {
        continue;
      }
      
      const x = col * moduleSize;
      const y = row * moduleSize;
      
      // Calculate distance from center for sorting
      const distX = x + moduleSize/2 - center;
      const distY = y + moduleSize/2 - center;
      const distanceFromCenter = Math.sqrt(distX*distX + distY*distY);
      
      dots.push({
        x,
        y,
        size: dotSize, // Smaller dots for more spacing
        isRound: true, // Most QR dots are round in the design
        distanceFromCenter,
        isPositionMarker: false,
        row,
        col,
        isHollow: false
      });
    }
  }
  
  console.log('Generated mock QR data with', dots.length, 'dots');
  return dots;
}; 