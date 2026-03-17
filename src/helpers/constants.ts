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

type ValueOf<T> = T[keyof T];
export type GameType = ValueOf<typeof GAME_TYPE>;
export type GameView = ValueOf<typeof GAME_VIEW>;
