import type { Round, Player } from '@/types';

/**
 * Calculate a single player's score delta for one round.
 *
 * Rules:
 *   zero bid, success:  roundNumber * 10  + bonus
 *   zero bid, failure:  roundNumber * -10  (no bonus)
 *   exact non-zero bid: bid * 20 + bonus
 *   missed bid:         -10 * |bid - tricksWon|  (no bonus)
 *
 * Bonus points (only awarded when bid is exact):
 *   +10 per standard-suit (green/purple/yellow) #14 captured in a won trick
 *   +20 for black (trump) #14 captured
 *   +20 per Mermaid captured by a Pirate
 *   +30 per Pirate captured by the Skull King
 *   +40 for capturing the Skull King with a Mermaid
 */
export function calculatePlayerRoundScore(
  bid: number,
  tricksWon: number,
  roundNumber: number,
  bonus: number = 0,
): number {
  if (bid === 0) {
    return tricksWon === 0 ? roundNumber * 10 + bonus : roundNumber * -10;
  }
  if (bid === tricksWon) {
    return bid * 20 + bonus;
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
    const bonus = round.bonusByPlayerId[player.id] ?? 0;
    scores[player.id] = calculatePlayerRoundScore(bid, tricks, round.number, bonus);
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
