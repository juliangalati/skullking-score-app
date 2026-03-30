/**
 * Lightweight test runner for scoring logic — no test framework required.
 * Run with: npx tsx src/game/__tests__/scoring.test.ts
 */

import { calculatePlayerRoundScore, calculateRoundScores, calculateTotals } from '../scoring';
import type { Player, Round } from '@/types';

// ─── Minimal test harness ────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function expect(label: string, actual: unknown, expected: unknown): void {
  const ok =
    typeof expected === 'object'
      ? JSON.stringify(actual) === JSON.stringify(expected)
      : actual === expected;

  if (ok) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    console.error(`    expected: ${JSON.stringify(expected)}`);
    console.error(`    received: ${JSON.stringify(actual)}`);
    failed++;
  }
}

// ─── calculatePlayerRoundScore ───────────────────────────────────────────────

console.log('\ncalculatePlayerRoundScore');

// Successful non-zero bid: bid 3, won 3, round 5 → 3 * 20 = 60
expect('exact bid (3/3, round 5)', calculatePlayerRoundScore(3, 3, 5), 60);

// Missed non-zero bid: bid 4, won 2, round 5 → -10 * |4-2| = -20
expect('missed bid (4 bid, 2 won)', calculatePlayerRoundScore(4, 2, 5), -20);

// Missed non-zero bid (over-won): bid 2, won 4, round 5 → -10 * |2-4| = -20
expect('missed bid (2 bid, 4 won)', calculatePlayerRoundScore(2, 4, 5), -20);

// Successful zero bid: bid 0, won 0, round 7 → 7 * 10 = 70
expect('zero bid success (round 7)', calculatePlayerRoundScore(0, 0, 7), 70);

// Failed zero bid: bid 0, won 2, round 3 → 3 * -10 = -30
expect('zero bid failure (round 3)', calculatePlayerRoundScore(0, 2, 3), -30);

// Round 1, exact bid of 1 → 1 * 20 = 20
expect('exact bid round 1 (1/1)', calculatePlayerRoundScore(1, 1, 1), 20);

// ─── Bonus points ─────────────────────────────────────────────────────────────

// Exact bid with bonus: bid 2, won 2, round 5, bonus 40 → 2*20 + 40 = 80
expect('exact bid + Mermaid captures Skull King bonus', calculatePlayerRoundScore(2, 2, 5, 40), 80);

// Exact bid with standard 14 bonus: bid 1, won 1, round 3, bonus 10 → 20 + 10 = 30
expect('exact bid + std 14 bonus', calculatePlayerRoundScore(1, 1, 3, 10), 30);

// Zero bid success with bonus: bid 0, won 0, round 4, bonus 20 → 4*10 + 20 = 60
expect('zero bid success + bonus', calculatePlayerRoundScore(0, 0, 4, 20), 60);

// Missed bid — bonus NOT applied: bid 3, won 2, round 5, bonus 30 → -10
expect('missed bid ignores bonus', calculatePlayerRoundScore(3, 2, 5, 30), -10);

// Failed zero bid — bonus NOT applied: bid 0, won 1, round 5, bonus 20 → -50
expect('failed zero bid ignores bonus', calculatePlayerRoundScore(0, 1, 5, 20), -50);

// ─── calculateRoundScores ────────────────────────────────────────────────────

console.log('\ncalculateRoundScores');

const players: Player[] = [
  { id: 'p1', name: 'Alice' },
  { id: 'p2', name: 'Bob' },
];

const round: Round = {
  number: 3,
  bidsByPlayerId: { p1: 2, p2: 0 },
  tricksByPlayerId: { p1: 2, p2: 0 },
  bonusByPlayerId: { p1: 30, p2: 0 }, // Alice captured a Pirate with Skull King
  scoresByPlayerId: { p1: 0, p2: 0 }, // not used by calculateRoundScores
};

const scores = calculateRoundScores(round, players);
// Alice: exact bid 2 + bonus 30 → 2*20 + 30 = 70
// Bob: zero bid success, round 3 + bonus 0 → 3*10 = 30
expect('Alice exact bid + bonus', scores['p1'], 70);
expect('Bob zero bid success', scores['p2'], 30);

// ─── calculateTotals ────────────────────────────────────────────────────────

console.log('\ncalculateTotals');

const rounds: Round[] = [
  {
    number: 1,
    bidsByPlayerId: {},
    tricksByPlayerId: {},
    bonusByPlayerId: {},
    scoresByPlayerId: { p1: 20, p2: -10 },
  },
  {
    number: 2,
    bidsByPlayerId: {},
    tricksByPlayerId: {},
    bonusByPlayerId: {},
    scoresByPlayerId: { p1: 40, p2: 20 },
  },
];

const totals = calculateTotals(rounds);
expect('Alice total (20+40)', totals['p1'], 60);
expect('Bob total (-10+20)', totals['p2'], 10);

// ─── Summary ────────────────────────────────────────────────────────────────

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
