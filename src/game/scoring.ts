import type { Round, Player } from '@/types';

/**
 * Calculate a single player's score delta for one round.
 *
 * v1 rules:
 *   zero bid, success:  roundNumber * 10
 *   zero bid, failure:  roundNumber * -10
 *   exact non-zero bid: bid * 20
 *   missed bid:         -10 * |bid - tricksWon|
 */
export function calculatePlayerRoundScore(
  bid: number,
  tricksWon: number,
  roundNumber: number,
): number {
  if (bid === 0) {
    return tricksWon === 0 ? roundNumber * 10 : roundNumber * -10;
  }
  if (bid === tricksWon) {
    return bid * 20;
  }
  return -10 * Math.abs(bid - tricksWon);
}

/**
 * Calculate score deltas for all players in a round.
 * Returns a map of playerId → score for this round only.
 */
export function calculateRoundScores(
  round: Round,
  players: Player[],
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const player of players) {
    const bid = round.bidsByPlayerId[player.id] ?? 0;
    const tricks = round.tricksByPlayerId[player.id] ?? 0;
    scores[player.id] = calculatePlayerRoundScore(bid, tricks, round.number);
  }
  return scores;
}

/**
 * Sum each player's scoresByPlayerId across all completed rounds.
 * Returns a map of playerId → cumulative total.
 */
export function calculateTotals(
  rounds: Round[],
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const round of rounds) {
    for (const [playerId, score] of Object.entries(round.scoresByPlayerId)) {
      totals[playerId] = (totals[playerId] ?? 0) + score;
    }
  }
  return totals;
}
