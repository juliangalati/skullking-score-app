import React, { createContext, useContext, useState } from 'react';
import type { Game, Player, Round } from '@/types';
import { TOTAL_ROUNDS } from '@/constants';
import { createGame, applyRoundScores } from './game';

type GameContextValue = {
  game: Game | null;
  startGame: (players: Player[]) => void;
  submitRound: (round: Round) => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<Game | null>(null);

  function startGame(players: Player[]) {
    setGame(createGame(players));
  }

  function submitRound(round: Round) {
    setGame(prev => {
      if (!prev) return prev;
      const scored = applyRoundScores(round, prev.players);
      const rounds = [...prev.rounds, scored];
      const status = rounds.length >= TOTAL_ROUNDS ? 'finished' : 'in_progress';
      return { ...prev, rounds, status };
    });
  }

  function resetGame() {
    setGame(null);
  }

  return (
    <GameContext.Provider value={{ game, startGame, submitRound, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
