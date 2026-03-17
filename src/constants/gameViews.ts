export const GAME_VIEW = {
  ALL: 'All',
  COOPERATIVE: 'Cooperative',
  COMPETITIVE: 'Competitive',
  SHORT: 'Short <30min',
  MEDIUM: 'Medium 30-45min',
  LONG: 'Long >45min',
} as const;

type ValueOf<T> = T[keyof T];
export type GameView = ValueOf<typeof GAME_VIEW>;
