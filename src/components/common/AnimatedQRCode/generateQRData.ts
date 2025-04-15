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
  errorCorrection = 'H' // Use high error correction
}: QROptions): Promise<QRDot[]> => {
  try {
    console.log('Generating standard QR code for:', value);
    
    // Generate a standard QR code as a string
    const qrString = await QRCode.toString(value, {
      type: 'svg',
      errorCorrectionLevel: errorCorrection,
      margin: 4, // Standard QR code margin
      width: size
    });
    
    // Parse the SVG to extract dot positions
    return extractDotsFromSVG(qrString, size);
  } catch (error) {
    console.error('Error generating QR code:', error);
    return generateMockQRData(size);
  }
};

/**
 * Extract dot positions from SVG string
 */
const extractDotsFromSVG = (svgString: string, size: number): QRDot[] => {
  const dots: QRDot[] = [];
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  const paths = svgDoc.querySelectorAll('path');
  
  // Calculate the center point of the QR code
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Get the viewBox size to calculate scaling
  const svg = svgDoc.querySelector('svg');
  const viewBox = svg?.getAttribute('viewBox');
  const viewBoxSize = viewBox ? parseInt(viewBox.split(' ')[2], 10) : 100;
  
  // Calculate scale factor
  const scaleFactor = size / viewBoxSize;
  
  // Logo size (60px)
  const logoSize = 60;
  
  // Position marker size
  const markerSize = 60;
  const markerInnerSize = markerSize * 0.4;
  
  // Create position markers
  // Top-left
  createPositionMarker(dots, 0, 0, markerSize, markerInnerSize, centerX, centerY);
  
  // Top-right (positioning based on QR code size)
  const rightX = size - markerSize;
  createPositionMarker(dots, rightX, 0, markerSize, markerInnerSize, centerX, centerY);
  
  // Bottom-left (positioning based on QR code size)
  const bottomY = size - markerSize;
  createPositionMarker(dots, 0, bottomY, markerSize, markerInnerSize, centerX, centerY);
  
  // Process each path in the SVG (each one is a QR code module/dot)
  paths.forEach((path, index) => {
    // Get the 'd' attribute which contains path data
    const d = path.getAttribute('d');
    if (!d) return;
    
    // Skip the path if it's part of the position markers
    // The path is likely a position marker if it starts with 'M0 0' or similar patterns
    // for corners
    if (isPositionMarkerPath(d)) {
      return;
    }
    
    // Extract coordinates from the path data
    const coordinates = extractCoordinates(d);
    if (!coordinates) return;
    
    // Scale the coordinates to match the desired size
    const x = coordinates.x * scaleFactor;
    const y = coordinates.y * scaleFactor;
    const width = coordinates.width * scaleFactor;
    const height = coordinates.height * scaleFactor;
    
    // Skip if this dot would be in the center (logo area)
    const logoHalfSize = logoSize / 2;
    if (
      x > centerX - logoHalfSize - 5 && 
      x < centerX + logoHalfSize + 5 - width &&
      y > centerY - logoHalfSize - 5 && 
      y < centerY + logoHalfSize + 5 - height
    ) {
      return;
    }
    
    // Skip if this dot would be in the position marker areas
    // Top-left
    if (x < markerSize + 5 && y < markerSize + 5) {
      return;
    }
    
    // Top-right
    if (x > size - markerSize - 5 - width && y < markerSize + 5) {
      return;
    }
    
    // Bottom-left
    if (x < markerSize + 5 && y > size - markerSize - 5 - height) {
      return;
    }
    
    // Calculate distance from center for animation ordering
    const dotCenterX = x + width / 2;
    const dotCenterY = y + height / 2;
    const distanceFromCenter = Math.sqrt(
      Math.pow(dotCenterX - centerX, 2) + 
      Math.pow(dotCenterY - centerY, 2)
    );
    
    // Add dot to the collection
    dots.push({
      x,
      y,
      size: width, // Assuming width equals height for QR dots
      isRound: true,
      distanceFromCenter,
      isPositionMarker: false,
      row: Math.floor(y / (size / 25)), // Approximate row
      col: Math.floor(x / (size / 25)), // Approximate column
      isHollow: false
    });
  });
  
  console.log('Generated QR code with', dots.length, 'dots');
  return dots;
};

/**
 * Helper function to check if a path is part of a position marker
 */
const isPositionMarkerPath = (d: string): boolean => {
  // Position markers are typically at the corners and have specific path patterns
  return d.startsWith('M0 0') || 
         d.includes('M0,0') || 
         d.includes('M7,0') || 
         d.includes('M0,7');
};

/**
 * Helper function to extract coordinates from SVG path data
 */
const extractCoordinates = (d: string): { x: number, y: number, width: number, height: number } | null => {
  // Most QR code paths are in the format: M{x},{y}h{width}v{height}h-{width}z
  const regex = /M(\d+(?:\.\d+)?)[, ](\d+(?:\.\d+)?)h(\d+(?:\.\d+)?)v(\d+(?:\.\d+)?)/;
  const match = d.match(regex);
  
  if (match) {
    return {
      x: parseFloat(match[1]),
      y: parseFloat(match[2]),
      width: parseFloat(match[3]),
      height: parseFloat(match[4])
    };
  }
  
  return null;
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
  const padding = 8;
  
  // Center point
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Create a realistic QR code pattern
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = col * dotSize;
      const y = row * dotSize;
      
      // Skip position marker areas
      if ((y < positionMarkerSize + padding && x < positionMarkerSize + padding) || // Top-left
          (y < positionMarkerSize + padding && x > size - positionMarkerSize - padding) || // Top-right
          (y > size - positionMarkerSize - padding && x < positionMarkerSize + padding)) { // Bottom-left
        continue;
      }
      
      // Skip center for logo
      const halfLogo = logoSize / 2;
      if (x > centerX - halfLogo - padding && 
          x < centerX + halfLogo + padding &&
          y > centerY - halfLogo - padding && 
          y < centerY + halfLogo + padding) {
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
        dots.push({
          x,
          y,
          size: dotSize * 0.85,
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