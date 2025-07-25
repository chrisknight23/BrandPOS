export type Screen = 'Home' | 'Follow' | 'Screensaver' | 'Cart' | 'Reward';

export type MessageKey =
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
  content: string;
}

export interface TextContentVersion {
  id: number;
  name: string;
  content: string;
}

export interface TextContentMap {
  [key: string]: {
    versions: TextContentVersion[];
  };
} 