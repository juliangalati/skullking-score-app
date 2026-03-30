# Skull King Score App

A mobile app for tracking scores in the [Skull King](https://www.grandpabecksgames.com/skull-king) card game. Built with React Native and Expo.

## Features

- Add and manage players for each game session
- Track rounds 1 through 10
- Record bids and tricks won per player per round
- Automatic score calculation following official Skull King rules
- Running totals visible throughout the game
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
│   ├── screens/      # HomeScreen, PlayerSetupScreen, RoundEntryScreen, ScoreboardScreen
│   ├── types/        # Shared TypeScript types (Player, Round, Game, RootStackParamList)
│   ├── utils/        # Pure helper functions (generateId, etc.)
│   ├── game/         # Scoring rules and game logic (pure functions, no UI dependencies)
│   │   ├── scoring.ts          # calculatePlayerRoundScore, calculateRoundScores, calculateTotals
│   │   ├── game.ts             # createGame, createRound, applyRoundScores, validateRoundInput
│   │   ├── index.ts            # Barrel re-export
│   │   └── __tests__/          # Scoring unit tests (run with: npx tsx src/game/__tests__/scoring.test.ts)
│   └── constants/    # Static config (TOTAL_ROUNDS, MIN/MAX_PLAYERS)
└── assets/           # Images, fonts, icons
```

## Scoring Rules

| Outcome | Points |
|---|---|
| Exact non-zero bid | `bid × 20` |
| Exact zero bid | `roundNumber × 10` |
| Missed bid (any) | `-10 × \|bid − tricksWon\|` |
| Failed zero bid | `roundNumber × -10` |

Bonus points for special card captures (Skull King caught by Mermaid, etc.) are not yet implemented.

> Full rules: [Skull King rulebook](https://www.grandpabecksgames.com/skull-king)

## Future Improvements

- Bonus points for special card captures (Skull King captured by Mermaid, etc.)
- Game history and persistent storage
- Multiple concurrent game sessions
- Player stats across sessions
- Dark mode support

## License

MIT
