/**
 * Debug utility functions to help with troubleshooting
 */

/**
 * Log navigation events to the console with a consistent format
 */
export const logNavigation = (component: string, action: string, details?: any) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] [${component}] ${action}`, details || '');
};

/**
 * Enable verbose logging for development purposes
 */
export const DEBUG_MODE = true; 