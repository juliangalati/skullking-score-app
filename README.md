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

- [React Native](https://reactnative.dev/) via [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your iOS or Android device (for physical device testing)
- Or an iOS Simulator / Android Emulator configured locally

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/skullking-score-app.git
cd skullking-score-app

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

Then scan the QR code with Expo Go, or press `i` / `a` to open in a simulator.

## Project Structure

```
skullking-score-app/
├── app/              # Screens and navigation (Expo Router)
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── utils/            # Score calculation logic and helpers
├── types/            # Shared TypeScript types
└── assets/           # Images, fonts, icons
```

## Scoring Rules

- **Correct bid (non-zero):** 20 points × tricks won
- **Correct bid (zero):** 10 points × round number
- **Incorrect bid:** -10 points × tricks off from bid
- **Special cards** (Skull King, Mermaids, Pirates) add bonus points when captured

> Full rules: [Skull King rulebook](https://www.grandpabecksgames.com/skull-king)

## Future Improvements

- Bonus points for special card captures (Skull King captured by Mermaid, etc.)
- Game history and persistent storage
- Multiple concurrent game sessions
- Player stats across sessions
- Dark mode support

## License

MIT
