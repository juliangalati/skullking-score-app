# Skull King Score App

## Project
React Native mobile app to track scores in the Skull King card game. Supports multi-player sessions across 10 rounds with automatic score calculation.

## Tech Stack
- React Native via Expo (managed workflow)
- TypeScript
- Expo Router (file-based navigation)

## Project Structure
```
app/          # Screens and navigation (Expo Router)
components/   # Reusable UI components
hooks/        # Custom React hooks
utils/        # Score calculation logic and helpers
types/        # Shared TypeScript types
assets/       # Images, fonts, icons
```

## Development
```bash
npm install
npx expo start
```

## Code Rules
- Prefer functional components with hooks
- Keep UI simple and readable — no over-engineering
- Avoid adding unnecessary dependencies
- No default exports for utility functions or types; use named exports
- Co-locate types with the code that uses them unless shared across multiple files

## Scoring Logic
Skull King official rules:
- **Correct bid (non-zero):** 20 pts × tricks won
- **Correct bid (zero):** 10 pts × round number
- **Incorrect bid:** -10 pts × |tricks won − bid|
- Validate bids before scoring (bid must be 0 to round number, inclusive)
- Bonus points for special card captures (Skull King caught by Mermaid, Pirate caught by Skull King, etc.) are tracked separatelyc
