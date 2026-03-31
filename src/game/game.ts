import type { Game, Player, Round } from '@/types';
import { generateId } from '@/utils';
import { calculateRoundScores } from './scoring';

export function createGame(players: Player[]): Game {
  return {
    id: generateId(),
    players,
    rounds: [],
    status: 'in_progress',
  };
}

/**
 * Create an empty round with zeroed bids/tricks/scores for every player.
 * Scores are filled in when the round is submitted via applyRoundScores.
 */
export function createRound(roundNumber: number, players: Player[]): Round {
  const empty = Object.fromEntries(players.map((p) => [p.id, 0]));
  return {
    number: roundNumber,
    bidsByPlayerId: { ...empty },
    tricksByPlayerId: { ...empty },
    bonusByPlayerId: { ...empty },
    scoresByPlayerId: { ...empty },
  };
}

/**
 * Compute and write round scores back onto the round object.
 * Call this after bids/tricks have been entered for the round.
 */
export function applyRoundScores(round: Round, players: Player[]): Round {
  return {
    ...round,
    scoresByPlayerId: calculateRoundScores(round, players),
  };
}

// ─── Validation ────────────────────────────────────────────────────────────────

export type ValidationError = { playerId: string; field: 'bid' | 'tricks' | 'bonus' | 'tricks_total'; message: string };

/**
 * Basic validation before accepting a round's input.
 * Returns an empty array if everything is valid.
 *
 * Rules:
 *   - bid must be in [0, roundNumber]
 *   - tricksWon must be in [0, roundNumber]
 *   - bonus must be >= 0
 *   - sum of all tricks must equal roundNumber
 *   - every player must have an entry in all maps
 */
export function validateRoundInput(round: Round, players: Player[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const max = round.number;

  for (const player of players) {
    const bid = round.bidsByPlayerId[player.id];
    const tricks = round.tricksByPlayerId[player.id];
    const bonus = round.bonusByPlayerId[player.id];

    if (bid === undefined || bid < 0 || bid > max) {
      errors.push({ playerId: player.id, field: 'bid', message: `Bid must be 0–${max}` });
    }
    if (tricks === undefined || tricks < 0 || tricks > max) {
      errors.push({ playerId: player.id, field: 'tricks', message: `Tricks won must be 0–${max}` });
    }
    if (bonus === undefined || bonus < 0) {
      errors.push({ playerId: player.id, field: 'bonus', message: 'Bonus must be ≥ 0' });
    }
  }

  const totalTricks = players.reduce(
    (sum, p) => sum + (round.tricksByPlayerId[p.id] ?? 0), 0
  );
  if (totalTricks !== max) {
    errors.push({
      playerId: '',
      field: 'tricks_total',
      message: `Tricks must add up to ${max} (currently ${totalTricks})`,
    });
  }

  return errors;
}
