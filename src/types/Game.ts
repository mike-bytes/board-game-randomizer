export interface GameData {
  online: boolean;
  inPerson: boolean;
  cooperative: boolean;
  time: number[]; // min playing time, max playing time
}

export type GamesJson = Record<string, GameData>;

export interface Game extends GameData {
  name: string;
  time: [number, number];
}
