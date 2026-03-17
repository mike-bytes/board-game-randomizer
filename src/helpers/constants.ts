export const GAME_TYPE = {
  ONLINE: 'Online',
  IN_PERSON: 'In Person',
  CUSTOM: 'Custom',
} as const;

export const GAME_VIEW = {
  ALL: 'All',
  COOPERATIVE: 'Cooperative',
  COMPETITIVE: 'Competitive',
  SHORT: 'Short <30min',
  MEDIUM: 'Medium 30-45min',
  LONG: 'Long >45min',
} as const;

export type GameType = (typeof GAME_TYPE)[keyof typeof GAME_TYPE];
export type GameView = (typeof GAME_VIEW)[keyof typeof GAME_VIEW];
