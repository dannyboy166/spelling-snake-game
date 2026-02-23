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

## AI Teacher Character (Video Generation)

The game features an animated teacher character that says "Spell the word X" using AI-generated lip-sync videos.

### Technology Stack
- **Google Vertex AI Veo 3.1** - Image-to-video with lip-sync (~$0.60 per 4-second video, NO daily limits)
- **ffmpeg chromakey** - Green screen removal with alpha transparency
- **WebM VP9** - Output format with alpha channel support

### Source Files
- `teacher_full.PNG` - Original teacher image (1024x1536, green screen background)
- `teacher-portrait.jpg` - Prepared 9:16 image for Veo
- `test-veo-vertex.js` - Video generation script (Vertex AI - NO rate limits)
- `test-veo.js` - Old script using AI Studio (has 10/day limit - don't use)

### Prerequisites (One-time Setup)

1. **Google Cloud Project**: `sasco-project`
2. **gcloud CLI** installed: `brew install google-cloud-sdk`
3. **Authenticated**: `gcloud auth login`
4. **Vertex AI API enabled** on the project

### Complete Workflow to Generate a New Teacher Video

#### Step 1: Edit the Prompt in test-veo-vertex.js

Change the word in the prompt (line ~133):
```javascript
const prompt = `The animated teacher character speaks to the camera and says "Spell the word YOUR_WORD". She has friendly expressions and natural lip movements as she speaks slowly and clearly. She gestures gently with her hands while talking.`;
```

#### Step 2: Generate Video with Vertex AI

```bash
node test-veo-vertex.js
```

This will:
- Get OAuth token from gcloud CLI
- Send image + prompt to Vertex AI Veo 3.1
- Poll until video is ready (~45-60 seconds)
- Save as `teacher-veo.mp4`

#### Step 3: Remove Green Screen & Convert to WebM

```bash
ffmpeg -y -i teacher-veo.mp4 \
  -vf "chromakey=0x00FF00:0.25:0.1" \
  -c:v libvpx-vp9 \
  -pix_fmt yuva420p \
  -b:v 1M \
  -c:a libopus \
  assets/teacher-videos/spell-WORD.webm
```

**Chromakey settings explained:**
- `0x00FF00` - Pure green color
- `0.25` - Similarity threshold (how much green to remove)
- `0.1` - Blend amount (softness of edges)

**If teacher is too transparent:** Lower similarity (try 0.2:0.08)
**If green outlines visible:** Raise similarity (try 0.3:0.12)

#### Step 4: Add to VIDEO_WORDS

Edit `js/game.js`:
```javascript
const VIDEO_WORDS = ['ANT', 'CAT', 'YOUR_WORD'];  // Add your word (uppercase)
```

#### Step 5: Test

```bash
open "index.html?words=YOUR_WORD"
```

### Quick Reference Commands

```bash
# 1. Generate video (edit prompt first!)
node test-veo-vertex.js

# 2. Remove green screen & convert (replace WORD)
ffmpeg -y -i teacher-veo.mp4 \
  -vf "chromakey=0x00FF00:0.25:0.1" \
  -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 1M -c:a libopus \
  assets/teacher-videos/spell-WORD.webm

# 3. Clean up temp file
rm teacher-veo.mp4

# 4. Add word to VIDEO_WORDS in js/game.js

# 5. Test in game
open "index.html?words=WORD"
```

### Video Duration
- **Supported**: 4, 6, or 8 seconds (minimum 4)
- **Recommended**: 4 seconds for "Spell the word X" videos
- Set in `test-veo-vertex.js` → `parameters.durationSeconds: 4`

### Costs
- **Vertex AI Veo 3.1**: ~$0.15/second = ~$0.60 per 4-second video
- **No daily limits** (unlike AI Studio's 10/day)
- 100 words ≈ $60

### Video Storage
- Location: `assets/teacher-videos/`
- Naming: `spell-{word}.webm` (e.g., `spell-cat.webm`)
- Format: WebM with VP9 codec and alpha transparency

### Registering Videos in the Game

After creating a video, you must add the word to `VIDEO_WORDS` in `js/game.js`:

```javascript
// Near top of game.js (line ~175)
const VIDEO_WORDS = ['ANT', 'CAT'];  // Add your word here (uppercase)
```

**How it works:**
- The teacher video only appears for words in `VIDEO_WORDS`
- Video auto-plays when a word starts
- For words without videos, no teacher appears
- Works with both default game and Teacher Portal custom lists

### Complete Steps to Add a New Word

1. **Edit prompt** in `test-veo-vertex.js` - change word in the prompt string
2. **Run** `node test-veo-vertex.js` - generates `teacher-veo.mp4` (~60 seconds)
3. **Remove green screen & convert:**
   ```bash
   ffmpeg -y -i teacher-veo.mp4 \
     -vf "chromakey=0x00FF00:0.25:0.1" \
     -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 1M -c:a libopus \
     assets/teacher-videos/spell-YOURWORD.webm
   ```
4. **Clean up:** `rm teacher-veo.mp4`
5. **Add to VIDEO_WORDS** in `js/game.js`
6. **Test** with `open "index.html?words=YOURWORD"`

### Prepared Image (Already Done)

The image `teacher-portrait.jpg` is already prepared with:
- 9:16 aspect ratio (1024x1820)
- Green padding on TOP
- Teacher at BOTTOM of frame

**You don't need to redo this** unless you change the teacher character.

If you ever need to recreate it from `teacher_full.PNG`:
```python
from PIL import Image
img = Image.open('teacher_full.PNG')
width, height = img.size
green = img.getpixel((10, 10))
target_height = int(width * 16 / 9)
new_img = Image.new('RGB', (width, target_height), green[:3])
new_img.paste(img, (0, target_height - height))  # Teacher at bottom
new_img.save('teacher-portrait.jpg', 'JPEG', quality=95)
```

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Teacher too transparent | Lower similarity: `chromakey=0x00FF00:0.2:0.08` |
| Green outlines visible | Raise similarity: `chromakey=0x00FF00:0.3:0.12` |
| Hands cut off | Add more green padding to sides of source image |
| Teacher floating (not at bottom) | Put all green padding on TOP of image |
| gcloud auth error | Run `gcloud auth login` |
| 401 Unauthenticated | Token expired, re-run script (gets fresh token) |

## External Dependencies

Loaded from CDN (in index.html):
- Google Fonts (Fredoka)
- canvas-confetti 1.6.0

## Development Guidelines

- **Keep it simple** - Target audience is ages 4-7
- **Test on mobile** - Many kids use tablets
- **No build process** - Direct file editing, refresh browser
- **Forgiving gameplay** - Wrong letters cost a strike, not instant death
