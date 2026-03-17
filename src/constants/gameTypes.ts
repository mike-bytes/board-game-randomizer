export const GAME_TYPE = {
  ONLINE: 'Online',
  IN_PERSON: 'In Person',
  CUSTOM: 'Custom',
} as const;

type ValueOf<T> = T[keyof T];
export type GameType = ValueOf<typeof GAME_TYPE>;
