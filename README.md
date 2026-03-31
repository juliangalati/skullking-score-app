# Skull King Score App

A mobile app for tracking scores in the [Skull King](https://www.grandpabecksgames.com/skull-king) card game. Built with React Native and Expo.

## Features

- Add and manage players for each game session
- Track rounds 1 through 10
- Record bids, tricks won, and bonus points per player per round
- Automatic score calculation following official Skull King rules (including bonus points)
- Input validation: submit blocked until all bids/tricks are filled and tricks sum to the round number
- Running totals and score progression chart visible throughout the game
- In-app FAQ and Reference Cards viewer
- Final results screen at game end

## Tech Stack

- [React Native](https://reactnative.dev/) via [Expo](https://expo.dev/) (managed workflow)
- [TypeScript](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/) (native-stack)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your iOS or Android device (for physical device testing)
- Or an iOS Simulator / Android Emulator configured locally

## Getting Started

```bash
# Clone the repository
git clone https://github.com/juliangalati/skullking-score-app.git
cd skullking-score-app

# Install dependencies
npm install

# Start the Expo development server
npm start
```

Then scan the QR code with Expo Go, or press `i` / `a` to open in a simulator.

```bash
# Run scoring unit tests (no test framework required)
npx tsx src/game/__tests__/scoring.test.ts
```

## Project Structure

```
skullking-score-app/
├── App.tsx           # Entry point — NavigationContainer + NativeStack navigator
├── src/
│   ├── components/   # Reusable UI components
│   │   ├── ScoreChart.tsx          # Custom SVG score progression line chart
│   │   ├── CardCountsButton.tsx    # Header button — card counts reference popup
│   │   ├── ReferenceCardsButton.tsx # Header button — reference card image viewer
│   │   ├── FaqButton.tsx           # Header button — FAQ modal
│   │   └── index.ts                # Barrel re-export
│   ├── screens/      # HomeScreen, PlayerSetupScreen, RoundEntryScreen, ScoreboardScreen
│   ├── types/        # Shared TypeScript types (Player, Round, Game, RootStackParamList)
│   ├── utils/        # Pure helper functions (generateId, etc.)
│   ├── game/         # Scoring rules and game logic
│   │   ├── scoring.ts          # calculatePlayerRoundScore, calculateRoundScores, calculateTotals
│   │   ├── game.ts             # createGame, createRound, applyRoundScores, validateRoundInput
│   │   ├── GameContext.tsx     # React context — shared game state across screens
│   │   ├── index.ts            # Barrel re-export
│   │   └── __tests__/          # Scoring unit tests (run with: npx tsx src/game/__tests__/scoring.test.ts)
│   └── constants/    # Static config (TOTAL_ROUNDS, MIN/MAX_PLAYERS)
└── assets/           # Images, fonts, icons
```

## Scoring Rules

| Outcome | Points |
|---|---|
| Exact non-zero bid | `bid × 20 + bonus` |
| Exact zero bid | `roundNumber × 10 + bonus` |
| Missed bid (any) | `-10 × \|bid − tricksWon\|` |
| Failed zero bid | `roundNumber × -10` |

Bonus points are awarded only when the bid is exact:

| Bonus Event | Points |
|---|---|
| Standard-suit (#14 in green/purple/yellow) captured | +10 |
| Black (#14 trump) captured | +20 |
| Mermaid captured by a Pirate | +20 |
| Pirate captured by the Skull King | +30 |
| Skull King captured by a Mermaid | +40 |

> Full rules: [Skull King rulebook](https://www.grandpabecksgames.com/skull-king)

## Future Improvements

- Game history and persistent storage
- Multiple concurrent game sessions
- Player stats across sessions
- Dark mode support

## License

MIT
