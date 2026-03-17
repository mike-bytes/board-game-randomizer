import GAMES_DATA from './games.json';
import type { Game, GamesJson } from '@/types/Game';

export const gamesList: Game[] = Object.entries(GAMES_DATA as GamesJson).map(
  ([name, data]) => ({
    name,
    ...data,
    time: [data.time[0], data.time[1]] as [number, number],
  })
);
