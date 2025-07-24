export type Screen = 'Home' | 'Follow' | 'Screensaver' | 'Cart' | 'Reward';

export type MessageKey = 
  // Home screen
  | 'introText'
  | 'followText'
  // Follow screen
  | 'scanText'
  // Screensaver
  | 'message1'
  | 'message2'
  | 'message3'
  | 'message4'
  | 'message5'
  // Cart
  | 'rightRail'
  // Reward
  | 'amountEarned'
  | 'localCashText'
  | 'scanToClaim'
  // End screen
  | 'walkAwayText';

export interface TextContent {
  screen: Screen;
  messageKey: MessageKey;
  version1: string;
  version2: string;
  version3: string;
}

export interface TextContentMap {
  [key: string]: {
    version1: string;
    version2: string;
    version3: string;
  };
} 