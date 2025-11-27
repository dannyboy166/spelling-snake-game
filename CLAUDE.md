# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Spelling Snake** - an educational game where kids guide a snake to collect letters and spell animal names. It's a vanilla JavaScript + Canvas implementation designed for young learners (infants/early primary).

**Key characteristics:**
- Pure vanilla JavaScript - no frameworks, no build process
- HTML5 Canvas for smooth rendering
- Web Audio API for sound effects (no external audio files)
- Built from scratch for the SASCO Games collection
- Fully functional - just open `index.html` in a browser

## Testing the Game

**No build process needed** - just open `index.html` in a browser:
```bash
open index.html
```

Changes are instant. After modifying files, just refresh the browser.

## Architecture

### File Structure

```
spelling-snake-game/
├── index.html          # Main entry point
├── css/
│   └── style.css       # All styling (responsive, animations)
├── js/
│   ├── animals.js      # Animal data (words, emojis, difficulty)
│   ├── audio.js        # Web Audio API sound effects
│   └── game.js         # Core game engine
├── assets/
│   ├── images/         # (Reserved for future custom images)
│   └── audio/          # (Reserved for future audio files)
└── CLAUDE.md           # This file
```

### Core Components

1. **game.js** - Main game engine (~500 lines)
   - `CONFIG` object: All game settings (grid size, speed, colors, difficulty)
   - `game` object: Runtime state (snake, letters, score, etc.)
   - `init()`: Canvas setup and event listeners
   - `gameStep()`: Main game loop (movement, collision, scoring)
   - `render()`: Canvas drawing (snake, letters, grid)
   - `spawnLetters()`: Places correct + decoy letters on grid
   - Touch + keyboard input handling
   - UI updates (word display, score, overlays)

2. **animals.js** - Word data (~80 animals)
   - Animals sorted by word length (3-9 letters)
   - Each entry: `{ word: 'CAT', emoji: '🐱' }`
   - `getRandomAnimal(excludeWords, maxLength)`: Gets unused animal within difficulty

3. **audio.js** - Sound effects via Web Audio API
   - `AudioManager` class with tone generation
   - `playCorrectLetter()`, `playWrongLetter()`, `playWordComplete()`, `playGameOver()`
   - No external audio files needed

4. **style.css** - Responsive styling
   - CSS Grid/Flexbox layouts
   - Animations (bounce, pulse, celebrate)
   - Mobile-first with touch control styling
   - SASCO green color scheme (#4ade80, #22c55e)

### Game Flow

```
Start Screen → Player clicks "Start Game!"
    ↓
Level starts → Snake initialized, animal chosen, letters spawned
    ↓
Game loop (every 150ms):
    → Move snake head in current direction
    → Check wall collision → Game Over if hit
    → Check self collision → Game Over if hit
    → Check letter collision:
        → Correct letter: Grow snake, update progress, respawn letters
        → Wrong letter: No growth (optional: small penalty)
        → If word complete: Level Complete!
    → Render frame
    ↓
Level Complete → Confetti + sound → "Next Animal!" button
    ↓
Game Over → Show final score → "Play Again!" button
```

### Difficulty Progression

Difficulty increases based on level number:

| Levels | Max Word Length | Example Words |
|--------|----------------|---------------|
| 1-3    | 3 letters      | CAT, DOG, PIG |
| 4-6    | 4 letters      | FISH, DUCK, BEAR |
| 7-10   | 5 letters      | HORSE, SNAKE, TIGER |
| 11-15  | 6 letters      | MONKEY, TURTLE |
| 16+    | 9 letters      | ELEPHANT, KANGAROO |

Speed also increases slightly after each word completed.

### Key Configuration (game.js)

```javascript
const CONFIG = {
    GRID_SIZE: 20,          // Pixels per cell
    GRID_WIDTH: 20,         // 20 cells wide
    GRID_HEIGHT: 15,        // 15 cells tall
    INITIAL_SPEED: 150,     // ms between moves (lower = faster)
    MIN_SPEED: 80,          // Fastest possible
    NUM_DECOY_LETTERS: 4,   // Wrong letters on screen
    // ... colors, difficulty settings
};
```

## Common Development Tasks

### Adding New Animals

Edit `js/animals.js`:
```javascript
{ word: 'NEWANIMAL', emoji: '🦄' },
```
Place in order by word length for proper difficulty sorting.

### Changing Difficulty

Edit `CONFIG.DIFFICULTY` in `js/game.js`:
```javascript
{ minLevel: 1, maxLevel: 5, maxWordLength: 3 },  // More easy levels
```

### Adding New Sounds

Edit `js/audio.js` - add new method to `AudioManager`:
```javascript
playMySound() {
    this.playTone(440, 0.2, 'sine', 0.3);  // frequency, duration, type, volume
}
```

### Changing Colors

Edit `CONFIG.COLORS` in `js/game.js`:
```javascript
COLORS: {
    snakeHead: '#4ade80',
    snakeBody: '#22c55e',
    correctLetter: '#fbbf24',
    // ...
}
```

## Portal Integration (Future Work)

When integrating with Victor's SASCO portal, follow the pattern from other games:

### Phase 1: Basic Launch
1. **URL Parameter Support** - Parse `?studentId=X&sessionId=Y&token=Z`
   - Add parsing at start of `init()` in `js/game.js`
2. **Return to Portal Button** - Add in header or game over screen
   - Click handler: `window.parent.postMessage({ action: 'closeGame' }, '*')`
3. **Iframe Embedding** - Game works as-is in iframes

### Phase 2: Progress Tracking (Optional)
- Track: high score, animals spelled, levels completed, total letters collected
- Use Victor's JS Interop API with token authentication

## SASCO Games Collection Context

This game is part of a coordinated collection of 6 educational games:

1. **MathCrush2** (Unity WebGL) - Educational + Time Earner
2. **Wordle** (React/TypeScript) - Educational/Homework
3. **2048** (Vanilla JS) - Free Time Reward
4. **Kangaroo Hop** (Phaser.js) - Free Time Reward
5. **Memory Game** (Vanilla JS) - Free Time Reward
6. **Spelling Snake** (Vanilla JS) - Educational ← **THIS GAME**

**Central Planning**: All game coordination at `/Users/danielsamus/sasco-games-portal/`

## Educational Role

**Target Audience**: Infants / Early Primary (ages 4-7)

**Learning Objectives**:
- Letter recognition
- Spelling common animal names
- Hand-eye coordination
- Pattern recognition

**Future Enhancements**:
- Different word packs (fruits, colors, shapes)
- Phonetic audio ("C... A... T... CAT!")
- Dyslexia-friendly font options
- Teacher-assigned word lists

## Browser Compatibility

- Requires HTML5 Canvas support (all modern browsers)
- Requires Web Audio API (all modern browsers)
- Touch events for mobile devices
- External dependencies loaded from CDN:
  - Google Fonts (Fredoka)
  - canvas-confetti 1.6.0

## Development Guidelines

- **Keep it simple** - This is for young children
- **No build process** - Direct file editing only
- **Bright, fun colors** - Kid-friendly visual design
- **Forgiving gameplay** - Wrong letters don't kill, just don't grow
- **Test on mobile** - Many kids use tablets
- **MIT License compatible** - Built from scratch, safe for school use

## Deployment

Can be deployed via GitHub Pages:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/dannyboy166/spelling-snake-game.git
git push -u origin main
```

Then enable GitHub Pages in repository settings.

Live URL will be: `https://dannyboy166.github.io/spelling-snake-game/`

---

**Last Updated**: 2025-11-27
**Game Version**: 1.0
**Tech Stack**: Vanilla JS + HTML5 Canvas
