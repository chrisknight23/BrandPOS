import { FIGMA } from '../constants/figma';

/**
 * Generates a Figma file URL for a specific node
 * @param nodeId - The ID of the node to link to
 * @returns The full Figma URL
 */
export const getFigmaNodeUrl = (nodeId: string): string => {
  return `https://www.figma.com/file/${FIGMA.FILE_KEY}?node-id=${nodeId}`;
};

/**
 * Gets the file key for the current Figma design
 * @returns The Figma file key
 */
export const getFigmaFileKey = (): string => {
  return FIGMA.FILE_KEY;
};

/**
 * Gets a node ID by its reference name
 * @param nodeName - The name of the node as defined in FIGMA.NODES
 * @returns The node ID
 */
export const getFigmaNodeId = (nodeName: keyof typeof FIGMA.NODES): string => {
  return FIGMA.NODES[nodeName];
}; 