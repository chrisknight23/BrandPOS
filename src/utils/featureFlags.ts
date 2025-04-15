/**
 * Feature Flags Utilities
 * 
 * Contains helper functions and hooks for working with feature flags.
 * For now, this is a very simple implementation that doesn't affect existing functionality.
 */

import { DEFAULT_FEATURE_FLAGS } from '../constants/featureFlags';

// Simple local storage key
const STORAGE_KEY = 'dev_feature_flags';

/**
 * Dispatch a custom event to notify components of flag changes
 */
const notifyFlagChange = () => {
  window.dispatchEvent(new CustomEvent('featureFlagChange'));
};

/**
 * Read feature flags from local storage or return defaults
 */
export const getFeatureFlags = (): Record<string, boolean> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_FEATURE_FLAGS;
  } catch (e) {
    console.error('Error reading feature flags from storage:', e);
    return DEFAULT_FEATURE_FLAGS;
  }
};

/**
 * Save feature flags to local storage
 */
export const saveFeatureFlags = (flags: Record<string, boolean>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    notifyFlagChange();
  } catch (e) {
    console.error('Error saving feature flags to storage:', e);
  }
};

/**
 * Check if a feature flag is enabled
 */
export const isFeatureEnabled = (flagId: string): boolean => {
  const flags = getFeatureFlags();
  return !!flags[flagId];
};

/**
 * Toggle a feature flag's value
 */
export const toggleFeatureFlag = (flagId: string): Record<string, boolean> => {
  const flags = getFeatureFlags();
  const updatedFlags = {
    ...flags,
    [flagId]: !flags[flagId]
  };
  saveFeatureFlags(updatedFlags);
  return updatedFlags;
};

/**
 * Reset all feature flags to default values
 */
export const resetFeatureFlags = (): Record<string, boolean> => {
  saveFeatureFlags(DEFAULT_FEATURE_FLAGS);
  return DEFAULT_FEATURE_FLAGS;
}; 