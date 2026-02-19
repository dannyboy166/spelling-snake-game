# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Spelling Snake** - an educational game where kids guide a snake to collect letters and spell animal names. It's a vanilla JavaScript + Canvas implementation designed for young learners (ages 4-7).

**Key characteristics:**
- Pure vanilla JavaScript - no frameworks, no build process
- HTML5 Canvas for smooth rendering
- Web Audio API for sound effects (no external audio files)
- Part of the SASCO Games collection for schools

## Running the Game

**No build process** - just open `index.html` in a browser:
```bash
open index.html
```

Refresh browser after file changes.

## Architecture

### Core Components

1. **game.js** - Main game engine (~1680 lines)
   - `CONFIG` object: Grid settings, speed, colors, difficulty tiers, themes
   - `game` object: Runtime state (snake, letters, score, strikes, customWordList, etc.)
   - Key functions: `init()`, `gameStep()`, `render()`, `spawnLetters()`, `parseURLParams()`
   - Touch + keyboard input (arrows, WASD, swipe, on-screen buttons)
   - Text-to-Speech support for custom words

2. **animals.js** - Word data (12 words with Lottie animations)
   - Format: `{ word: 'CAT', emoji: '🐱', scale: 2.16, offsetY: 10 }`
   - `getRandomAnimal(excludeWords, maxLength)`: Gets unused word within difficulty

3. **audio.js** - Sound effects via Web Audio API
   - `AudioManager` class with `playTone(frequency, duration, type, volume)`
   - Methods: `playCorrectLetter()`, `playWrongLetter()`, `playWordComplete()`, `playGameOver()`, `playStart()`, `playMove()`

4. **style.css** - Responsive styling with SASCO green theme (#4ade80, #22c55e)

### Game Flow

```
Start Screen → "Start Game!" → Level starts (snake + animal + letters)
    ↓
Game loop (150ms intervals):
    → Move snake → Check collisions (wall/self = game over)
    → Letter collision: correct = grow + progress, wrong = strike
    → 3 strikes = game over
    → Word complete = confetti + auto-continue to next animal
    ↓
Game Over → Final score → "Play Again!"
```

### Strikes System

Players have 3 lives (shown as 💚). Wrong letters cost a strike (shown as ❌). 3 strikes = game over.

### Difficulty Progression

| Levels | Max Length | Examples |
|--------|-----------|----------|
| 1-3    | 3 letters | CAT, DOG, PIG |
| 4-6    | 4 letters | FISH, DUCK, BEAR |
| 7-10   | 5 letters | HORSE, SNAKE, TIGER |
| 11-15  | 6 letters | MONKEY, TURTLE |
| 16+    | 9 letters | ELEPHANT, KANGAROO |

Speed increases after each completed word.

## Common Development Tasks

### Adding New Animals

Edit `js/animals.js` - place in order by word length:
```javascript
{ word: 'NEWANIMAL', emoji: '🦄' },
```

### Changing Difficulty

Edit `CONFIG.DIFFICULTY` in `js/game.js`:
```javascript
{ minLevel: 1, maxLevel: 5, maxWordLength: 3 },  // More easy levels
```

### Adding New Sounds

Add method to `AudioManager` in `js/audio.js`:
```javascript
playMySound() {
    this.playTone(440, 0.2, 'sine', 0.3);  // frequency, duration, type, volume
}
```

### Changing Colors

Edit `CONFIG.COLORS` in `js/game.js`.

## Teacher Portal

The Teacher Portal (`teacher.html`) allows educators to create custom spelling word lists:

### Features
- Select from 12 animated words (ANT, BUS, CAT, DOG, FISH, GOAT, MOON, PIG, SHEEP, SNAKE, SUN, TREE)
- Add custom words (any word - uses Text-to-Speech instead of animation)
- Generate shareable game links with URL parameters
- Save/load word lists to localStorage

### URL Parameters
The game accepts custom word lists via URL parameters:
```
index.html?words=CAT,DOG,HOUSE,APPLE
```

Words that exist in `ANIMALS` array show Lottie animations. Custom words show a 🔊 icon and use Web Speech API.

### Key Files
- `teacher.html` - Teacher Portal UI
- `js/teacher-portal.js` - Portal logic (word selection, link generation, saved lists)
- `css/teacher.css` - Portal styling

### Functions in game.js
- `parseURLParams()` - Reads `?words=` from URL
- `buildCustomWordList()` - Creates word objects, marking which have Lottie
- `getRandomCustomWord()` - Picks from custom list
- `speakWord()` - Text-to-Speech for custom words

## Portal Integration (Future)

For SASCO portal integration:
1. **URL Parameters** - Parse `?studentId=X&sessionId=Y&token=Z` in `init()`
2. **Return Button** - `window.parent.postMessage({ action: 'closeGame' }, '*')`
3. **Progress Tracking** - High score, animals spelled, levels completed

## External Dependencies

Loaded from CDN (in index.html):
- Google Fonts (Fredoka)
- canvas-confetti 1.6.0

## Development Guidelines

- **Keep it simple** - Target audience is ages 4-7
- **Test on mobile** - Many kids use tablets
- **No build process** - Direct file editing, refresh browser
- **Forgiving gameplay** - Wrong letters cost a strike, not instant death
