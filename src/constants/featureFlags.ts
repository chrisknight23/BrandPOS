/**
 * Feature Flags Configuration
 * 
 * This file defines all available feature flags in the application.
 * Each flag is defined with a default value and metadata.
 */

import { Screen } from '../types/screen';

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  defaultValue: boolean;
  availableOn: Screen[] | 'all'; // Screens where this flag is relevant
}

// Define all feature flags here
export const FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'enable_animations',
    name: 'Enable Animations',
    description: 'Controls whether animations are enabled throughout the app',
    defaultValue: true,
    availableOn: 'all'
  },
  {
    id: 'new_card_animation',
    name: 'New Card Animation',
    description: 'Use the new card animation on the Cashback screen',
    defaultValue: false,
    availableOn: ['Cashback']
  },
  {
    id: 'enhanced_tipping',
    name: 'Enhanced Tipping UI',
    description: 'Enable enhanced tipping features (non-functional flag for testing)',
    defaultValue: false,
    availableOn: ['Tipping']
  },
  {
    id: 'pay_indicators',
    name: 'Pay Indicators',
    description: 'Show animated payment direction indicators on the payment screen',
    defaultValue: true,
    availableOn: ['TapToPay']
  }
];

// Default state for feature flags (used on app init)
export const DEFAULT_FEATURE_FLAGS = FEATURE_FLAGS.reduce<Record<string, boolean>>(
  (acc, flag) => {
    acc[flag.id] = flag.defaultValue;
    return acc;
  },
  {}
); 