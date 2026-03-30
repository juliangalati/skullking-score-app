// ─── Data Model ────────────────────────────────────────────────────────────────

export type Player = {
  id: string;
  name: string;
};

export type Round = {
  number: number;
  bidsByPlayerId: Record<string, number>;
  tricksByPlayerId: Record<string, number>;
  scoresByPlayerId: Record<string, number>;
};

export type GameStatus = 'setup' | 'in_progress' | 'finished';

export type Game = {
  id: string;
  players: Player[];
  rounds: Round[];
  status: GameStatus;
};

// ─── Navigation ────────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Home: undefined;
  PlayerSetup: undefined;
  RoundEntry: { roundNumber: number };
  Scoreboard: undefined;
};
