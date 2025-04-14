/**
 * Types for the AnimatedQRCode component
 */

/**
 * Represents a single dot/module in the QR code
 */
export interface QRDot {
  // Position coordinates
  x: number;
  y: number;
  
  // Size of the dot (usually square)
  size: number;
  
  // Whether the dot should be rounded
  isRound: boolean;
  
  // Distance from center (used for sorting in animations)
  distanceFromCenter: number;
  
  // Whether this dot is part of a positioning marker
  isPositionMarker: boolean;
  
  // Row and column in the QR matrix (for sorting)
  row: number;
  col: number;
} 