import { useState, useEffect } from 'react';
import { isFeatureEnabled } from '../utils/featureFlags';

/**
 * Hook to check if a feature flag is enabled
 * This is a simple implementation that doesn't affect any existing functionality.
 * 
 * @param flagId The ID of the feature flag to check
 * @returns Boolean indicating if the flag is enabled
 */
export const useFeatureFlag = (flagId: string): boolean => {
  const [isEnabled, setIsEnabled] = useState(() => isFeatureEnabled(flagId));
  
  // Listen for storage events to update the flag value if changed in another component
  useEffect(() => {
    const handleStorage = () => {
      setIsEnabled(isFeatureEnabled(flagId));
    };
    
    // Check flag on mount
    setIsEnabled(isFeatureEnabled(flagId));
    
    // Listen for storage changes
    window.addEventListener('storage', handleStorage);
    
    // Add a custom event listener for our app-specific flag changes
    window.addEventListener('featureFlagChange', handleStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('featureFlagChange', handleStorage);
    };
  }, [flagId]);
  
  return isEnabled;
}; 