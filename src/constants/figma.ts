export const FIGMA = {
  FILE_KEY: 'csqXY8ss8MkOtFXRjQVbjU', // POS Build Figma file
  // Node IDs for specific components/screens
  NODES: {
    POS_BUILD: '1-7', // POS Build screen reference
  },
  // Add any other Figma-related constants here
} as const;

// Type for accessing node IDs with TypeScript support
export type FigmaNodeId = keyof typeof FIGMA.NODES; 