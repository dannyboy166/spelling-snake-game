/**
 * SPELLING SNAKE GAME
 * A fun educational game where kids guide a snake to collect letters
 * and spell animal names!
 */

// =============================================
// GAME CONFIGURATION
// =============================================

const CONFIG = {
    // Grid settings
    GRID_SIZE: 28,          // Size of each grid cell in pixels (bigger!)
    GRID_WIDTH: 22,         // Number of cells wide
    GRID_HEIGHT: 16,        // Number of cells tall

    // Snake settings
    INITIAL_LENGTH: 3,
    INITIAL_SPEED: 150,     // Milliseconds between moves (lower = faster)
    SPEED_INCREASE: 3,      // Speed up by this much per word completed
    MIN_SPEED: 80,          // Fastest possible speed

    // Letter settings
    NUM_DECOY_LETTERS: 5,   // Number of wrong letters on screen
    HEAD_BUFFER: 4,         // No letters spawn within X tiles of snake's head

    // Colors - ALL letters glow the same (no hints!)
    COLORS: {
        background: '#16213e',
        gridLines: '#1a2744',
        snakeHead: '#4ade80',
        snakeBody: '#22c55e',
        snakeOutline: '#166534',
        letterBg: '#fbbf24',       // All letters same bright color
        letterGlow: '#fcd34d',     // All letters glow
        letterText: '#1a1a2e'      // Dark text on letters
    },

    // Color themes for gameplay
    THEMES: {
        default: {
            name: 'Classic',
            background: '#16213e',
            gridLines: '#1a2744',
            snakeHead: '#4ade80',
            snakeBody: '#22c55e',
            snakeOutline: '#166534',
            letterBg: '#fbbf24',
            letterGlow: '#fcd34d',
            letterText: '#1a1a2e'
        },
        neon: {
            name: 'Neon Pop',
            background: '#e56bbf',
            gridLines: '#d45aae',
            snakeHead: '#e1fd70',
            snakeBody: '#d4f060',
            snakeOutline: '#a8c44a',
            letterBg: '#7a64ec',
            letterGlow: '#9580ff',
            letterText: '#ffffff'
        },
        ocean: {
            name: 'Ocean',
            background: '#b7eef4',
            gridLines: '#a0e0e8',
            snakeHead: '#7a64ec',
            snakeBody: '#6b55dd',
            snakeOutline: '#5040b0',
            letterBg: '#f5ef8d',
            letterGlow: '#fffaaa',
            letterText: '#1a1a2e'
        },
        sunset: {
            name: 'Sunset',
            background: '#f2a7d0',
            gridLines: '#e896c0',
            snakeHead: '#f4ef7d',
            snakeBody: '#e8e36a',
            snakeOutline: '#c9c44d',
            letterBg: '#7a64ec',
            letterGlow: '#9580ff',
            letterText: '#ffffff'
        }
    },

    // Difficulty progression (max word length by level ranges)
    DIFFICULTY: [
        { minLevel: 1, maxLevel: 3, maxWordLength: 3 },    // CAT, DOG, etc.
        { minLevel: 4, maxLevel: 6, maxWordLength: 4 },    // FISH, DUCK, etc.
        { minLevel: 7, maxLevel: 10, maxWordLength: 5 },   // HORSE, SNAKE, etc.
        { minLevel: 11, maxLevel: 15, maxWordLength: 6 },  // MONKEY, TURTLE, etc.
        { minLevel: 16, maxLevel: 999, maxWordLength: 9 }  // All words
    ]
};

// =============================================
// GAME STATE
// =============================================

const game = {
    canvas: null,
    ctx: null,

    // Snake data
    snake: [],
    direction: { x: 1, y: 0 },
    directionQueue: [],  // Queue for buffering rapid direction inputs

    // Game state
    isRunning: false,
    isPaused: false,
    gameLoop: null,
    speed: CONFIG.INITIAL_SPEED,

    // Current word/animal
    currentAnimal: null,
    currentLetterIndex: 0,
    usedAnimals: [],

    // Letters on the board
    letters: [],

    // Score tracking
    score: 0,
    level: 1,
    animalsSpelled: 0,

    // Lives/strikes system
    strikes: 0,
    maxStrikes: 3,

    // Death animation
    isDying: false,

    // Wall mode: true = wrap around, false = walls kill
    wrapAround: true,

    // Current color theme
    currentTheme: 'default',

    // Canvas scale for responsive sizing
    scale: 1,

    // Touch handling
    touchStartX: 0,
    touchStartY: 0
};

// =============================================
// INITIALIZATION
// =============================================

function init() {
    // Get canvas and set dimensions
    game.canvas = document.getElementById('game-canvas');
    game.ctx = game.canvas.getContext('2d');

    // Set canvas size (responsive)
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        scaleWordToFit();
    });

    // Set up event listeners
    setupEventListeners();

    // Initial render
    render();
}

function resizeCanvas() {
    const baseWidth = CONFIG.GRID_SIZE * CONFIG.GRID_WIDTH;
    const baseHeight = CONFIG.GRID_SIZE * CONFIG.GRID_HEIGHT;

    // Get available width (viewport width minus some padding)
    const availableWidth = window.innerWidth - 40;

    // Only scale down if screen is narrower than the game needs
    if (availableWidth < baseWidth) {
        game.scale = availableWidth / baseWidth;
    } else {
        game.scale = 1; // Full size on desktop
    }

    // Set canvas size
    game.canvas.width = Math.floor(baseWidth * game.scale);
    game.canvas.height = Math.floor(baseHeight * game.scale);

    // Re-render if game exists
    if (game.ctx) {
        render();
    }
}

function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);

    // Touch controls (swipe)
    game.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    game.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Touch button controls
    document.querySelectorAll('.touch-btn').forEach(btn => {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const direction = btn.dataset.direction;
            setDirection(direction);
        });
        btn.addEventListener('click', (e) => {
            const direction = btn.dataset.direction;
            setDirection(direction);
        });
    });

    // Start button
    document.getElementById('start-btn').addEventListener('click', startGame);

    // Restart button
    document.getElementById('restart-btn').addEventListener('click', restartGame);

    // Wall mode toggle buttons
    document.getElementById('walls-wrap').addEventListener('click', () => {
        game.wrapAround = true;
        document.getElementById('walls-wrap').classList.add('active');
        document.getElementById('walls-solid').classList.remove('active');
    });
    document.getElementById('walls-solid').addEventListener('click', () => {
        game.wrapAround = false;
        document.getElementById('walls-solid').classList.add('active');
        document.getElementById('walls-wrap').classList.remove('active');
    });

    // Main menu button
    document.getElementById('menu-btn').addEventListener('click', goToMainMenu);

    // Color swatches
    document.querySelectorAll('#color-swatches .color-swatch').forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            e.stopPropagation();
            const color = swatch.dataset.color;
            document.body.style.background = color;
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            // Update selected color button
            document.getElementById('selected-color-btn').style.background = color;
            // Collapse after selection
            document.getElementById('bg-group').classList.remove('expanded');
        });
    });

    // Theme buttons
    document.querySelectorAll('#theme-buttons .theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const themeName = btn.dataset.theme;
            applyTheme(themeName);
            document.querySelectorAll('#theme-buttons .theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Update selected theme preview
            const selectedTheme = document.getElementById('selected-theme');
            selectedTheme.innerHTML = btn.innerHTML;
            // Collapse after selection
            document.getElementById('theme-group').classList.remove('expanded');
        });
    });

    // Collapsible setting headers
    document.querySelectorAll('.setting-group.collapsible .setting-header').forEach(header => {
        header.addEventListener('click', () => {
            const group = header.parentElement;
            // Close other expanded groups
            document.querySelectorAll('.setting-group.collapsible.expanded').forEach(g => {
                if (g !== group) g.classList.remove('expanded');
            });
            // Toggle this group
            group.classList.toggle('expanded');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.setting-group.collapsible')) {
            document.querySelectorAll('.setting-group.collapsible.expanded').forEach(g => {
                g.classList.remove('expanded');
            });
        }
    });

    // Prevent arrow key scrolling
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
    });
}

// =============================================
// THEME FUNCTIONS
// =============================================

function applyTheme(themeName) {
    if (CONFIG.THEMES[themeName]) {
        game.currentTheme = themeName;
        const theme = CONFIG.THEMES[themeName];
        // Update CONFIG.COLORS with theme colors
        CONFIG.COLORS.background = theme.background;
        CONFIG.COLORS.gridLines = theme.gridLines;
        CONFIG.COLORS.snakeHead = theme.snakeHead;
        CONFIG.COLORS.snakeBody = theme.snakeBody;
        CONFIG.COLORS.snakeOutline = theme.snakeOutline;
        CONFIG.COLORS.letterBg = theme.letterBg;
        CONFIG.COLORS.letterGlow = theme.letterGlow;
        CONFIG.COLORS.letterText = theme.letterText;
        // Re-render to show new colors
        render();
    }
}

function getThemeColors() {
    return CONFIG.THEMES[game.currentTheme] || CONFIG.THEMES.default;
}

// =============================================
// GAME FLOW
// =============================================

function startGame() {
    // Initialize audio
    audioManager.init();
    audioManager.playStart();
    audioManager.startBackgroundMusic();

    // Reset game state
    game.score = 0;
    game.level = 1;
    game.animalsSpelled = 0;
    game.usedAnimals = [];
    game.speed = CONFIG.INITIAL_SPEED;
    game.strikes = 0;

    // Update score display
    updateScoreDisplay();
    updateStrikesDisplay();

    // Hide start screen
    document.getElementById('start-screen').classList.add('hidden');

    // Start first level (with snake reset)
    startLevel(true);
}

function startLevel(isFirstLevel = false) {
    // Only reset snake on first level - keep it growing across animals!
    if (isFirstLevel) {
        initSnake();
        game.direction = { x: 1, y: 0 };
        game.directionQueue = [];
    }

    // Get new animal based on difficulty
    const maxLength = getMaxWordLength();
    game.currentAnimal = getRandomAnimal(game.usedAnimals, maxLength);
    game.usedAnimals.push(game.currentAnimal.word);
    game.currentLetterIndex = 0;

    // Update UI
    updateAnimalDisplay();
    updateWordDisplay();

    // Spawn letters
    spawnLetters();

    // Start game loop
    game.isRunning = true;

    if (game.gameLoop) clearInterval(game.gameLoop);
    game.gameLoop = setInterval(gameStep, game.speed);
}

// nextLevel is now handled automatically in levelComplete()

function restartGame() {
    document.getElementById('game-over').classList.add('hidden');
    startGame();
}

function goToMainMenu() {
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    game.letters = [];
    render();
}

function gameOver() {
    game.isRunning = false;
    clearInterval(game.gameLoop);

    audioManager.stopBackgroundMusic();
    audioManager.playGameOver();

    // Start death animation
    game.isDying = true;
    let flashes = 0;
    const maxFlashes = 6;
    const flashInterval = setInterval(() => {
        flashes++;
        render();  // render() will check isDying and alternate colors
        if (flashes >= maxFlashes) {
            clearInterval(flashInterval);
            game.isDying = false;
            showGameOverScreen();
        }
    }, 250);
}

function showGameOverScreen() {
    // Update final score display
    document.getElementById('final-score').textContent = game.score;
    document.getElementById('animals-spelled').textContent = game.animalsSpelled;

    // Show game over screen
    document.getElementById('game-over').classList.remove('hidden');
}

function levelComplete() {
    game.animalsSpelled++;
    game.score += game.currentAnimal.word.length * 10; // Bonus for completing word

    // Speed up slightly and restart loop with new speed
    game.speed = Math.max(CONFIG.MIN_SPEED, game.speed - CONFIG.SPEED_INCREASE);
    clearInterval(game.gameLoop);
    game.gameLoop = setInterval(gameStep, game.speed);

    updateScoreDisplay();

    audioManager.playWordComplete();

    // Confetti!
    triggerConfetti();

    // Clear letters from board during celebration
    game.letters = [];

    // Show celebration in header (word complete!)
    showHeaderCelebration();

    // After 2.5 seconds, find new animal and continue
    setTimeout(() => {
        game.level++;

        // Get new animal based on difficulty
        const maxLength = getMaxWordLength();
        game.currentAnimal = getRandomAnimal(game.usedAnimals, maxLength);
        game.usedAnimals.push(game.currentAnimal.word);
        game.currentLetterIndex = 0;

        // Update UI with "searching" effect
        showFindingAnimal();

        // After brief "finding" animation, spawn letters and continue
        setTimeout(() => {
            updateAnimalDisplay();
            updateWordDisplay();
            spawnLetters();
        }, 800);

    }, 2500);
}

// =============================================
// SNAKE LOGIC
// =============================================

function initSnake() {
    game.snake = [];
    const startX = Math.floor(CONFIG.GRID_WIDTH / 4);
    const startY = Math.floor(CONFIG.GRID_HEIGHT / 2);

    for (let i = 0; i < CONFIG.INITIAL_LENGTH; i++) {
        game.snake.push({ x: startX - i, y: startY });
    }
}

function gameStep() {
    if (!game.isRunning) return;

    // Apply next direction from queue if available
    if (game.directionQueue.length > 0) {
        game.direction = game.directionQueue.shift();
    }

    // Calculate new head position
    const head = game.snake[0];
    const newHead = {
        x: head.x + game.direction.x,
        y: head.y + game.direction.y
    };

    // Handle wall collision
    if (newHead.x < 0 || newHead.x >= CONFIG.GRID_WIDTH ||
        newHead.y < 0 || newHead.y >= CONFIG.GRID_HEIGHT) {
        if (game.wrapAround) {
            // Wrap to other side
            if (newHead.x < 0) newHead.x = CONFIG.GRID_WIDTH - 1;
            if (newHead.x >= CONFIG.GRID_WIDTH) newHead.x = 0;
            if (newHead.y < 0) newHead.y = CONFIG.GRID_HEIGHT - 1;
            if (newHead.y >= CONFIG.GRID_HEIGHT) newHead.y = 0;
        } else {
            gameOver();
            return;
        }
    }

    // Check self collision
    if (game.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return;
    }

    // Add new head
    game.snake.unshift(newHead);

    // Check letter collision
    const letterIndex = game.letters.findIndex(
        letter => letter.x === newHead.x && letter.y === newHead.y
    );

    if (letterIndex !== -1) {
        const letter = game.letters[letterIndex];
        const nextLetter = game.currentAnimal.word[game.currentLetterIndex];

        if (letter.isHeart) {
            // Heart pickup - restore a life!
            game.snake.pop(); // Don't grow from heart
            game.strikes = Math.max(0, game.strikes - 1);
            audioManager.playCorrectLetter(); // Happy sound
            updateStrikesDisplay();
            // Remove the heart from letters
            game.letters.splice(letterIndex, 1);
        } else if (letter.char === nextLetter) {
            // Correct letter!
            audioManager.playCorrectLetter();
            game.score += 10;
            game.currentLetterIndex++;
            updateScoreDisplay();
            updateWordDisplay();

            // Check if word complete
            if (game.currentLetterIndex >= game.currentAnimal.word.length) {
                render(); // Render the snake in its new position before celebrating
                levelComplete();
                return;
            }

            // Respawn all letters
            spawnLetters();
        } else {
            // Wrong letter - add a strike!
            game.snake.pop();
            game.strikes++;
            audioManager.playWrongLetter();
            updateStrikesDisplay();

            // Check if out of strikes
            if (game.strikes >= game.maxStrikes) {
                render();
                gameOver();
                return;
            }
        }
    } else {
        // No letter eaten - remove tail (normal movement)
        game.snake.pop();
    }

    // Render
    render();
}

// =============================================
// LETTER SPAWNING
// =============================================

function spawnLetters() {
    game.letters = [];

    // Get occupied positions (snake body)
    const occupied = new Set(game.snake.map(s => `${s.x},${s.y}`));

    // Add buffer zone around snake's head (no letters within X tiles)
    const head = game.snake[0];
    for (let dx = -CONFIG.HEAD_BUFFER; dx <= CONFIG.HEAD_BUFFER; dx++) {
        for (let dy = -CONFIG.HEAD_BUFFER; dy <= CONFIG.HEAD_BUFFER; dy++) {
            occupied.add(`${head.x + dx},${head.y + dy}`);
        }
    }

    // Get the next correct letter
    const correctLetter = game.currentAnimal.word[game.currentLetterIndex];

    // Spawn correct letter
    const correctPos = getRandomEmptyPosition(occupied);
    if (correctPos) {
        game.letters.push({
            x: correctPos.x,
            y: correctPos.y,
            char: correctLetter,
            isCorrect: true
        });
        occupied.add(`${correctPos.x},${correctPos.y}`);
    }

    // Spawn decoy letters
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < CONFIG.NUM_DECOY_LETTERS; i++) {
        const pos = getRandomEmptyPosition(occupied);
        if (pos) {
            // Pick a random letter that's NOT the correct one
            let decoyChar;
            do {
                decoyChar = alphabet[Math.floor(Math.random() * alphabet.length)];
            } while (decoyChar === correctLetter);

            game.letters.push({
                x: pos.x,
                y: pos.y,
                char: decoyChar,
                isCorrect: false
            });
            occupied.add(`${pos.x},${pos.y}`);
        }
    }

    // Spawn heart pickup (30% chance, only if player has less than 3 lives)
    if (game.strikes > 0 && Math.random() < 0.3) {
        const heartPos = getRandomEmptyPosition(occupied);
        if (heartPos) {
            game.letters.push({
                x: heartPos.x,
                y: heartPos.y,
                char: '❤️',
                isHeart: true
            });
        }
    }
}

function getRandomEmptyPosition(occupied) {
    const maxAttempts = 100;
    for (let i = 0; i < maxAttempts; i++) {
        const x = Math.floor(Math.random() * CONFIG.GRID_WIDTH);
        const y = Math.floor(Math.random() * CONFIG.GRID_HEIGHT);
        const key = `${x},${y}`;

        if (!occupied.has(key)) {
            return { x, y };
        }
    }
    return null;
}

// =============================================
// RENDERING
// =============================================

function render() {
    const ctx = game.ctx;
    const gridSize = CONFIG.GRID_SIZE * game.scale;

    // Clear canvas
    ctx.fillStyle = CONFIG.COLORS.background;
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    // Draw subtle grid
    ctx.strokeStyle = CONFIG.COLORS.gridLines;
    ctx.lineWidth = 0.5 * game.scale;
    for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * gridSize, 0);
        ctx.lineTo(x * gridSize, game.canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * gridSize);
        ctx.lineTo(game.canvas.width, y * gridSize);
        ctx.stroke();
    }

    // Draw letters and hearts
    game.letters.forEach(letter => {
        const x = letter.x * gridSize;
        const y = letter.y * gridSize;

        if (letter.isHeart) {
            // Draw heart pickup with pink/red glow
            ctx.shadowColor = '#ff6b6b';
            ctx.shadowBlur = 15 * game.scale;

            // Pink background circle
            ctx.fillStyle = '#ff4757';
            ctx.beginPath();
            ctx.arc(x + gridSize / 2, y + gridSize / 2, gridSize / 2 - 2 * game.scale, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;

            // Heart emoji
            ctx.font = `${Math.floor(gridSize * 0.6)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('❤️', x + gridSize / 2, y + gridSize / 2);
        } else {
            // All letters glow equally - kids must figure out the spelling!
            ctx.shadowColor = CONFIG.COLORS.letterGlow;
            ctx.shadowBlur = 12 * game.scale;

            // Background circle
            ctx.fillStyle = CONFIG.COLORS.letterBg;
            ctx.beginPath();
            ctx.arc(x + gridSize / 2, y + gridSize / 2, gridSize / 2 - 2 * game.scale, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;

            // Letter text
            ctx.fillStyle = CONFIG.COLORS.letterText;
            ctx.font = `bold ${Math.floor(gridSize * 0.7)}px Fredoka`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(letter.char, x + gridSize / 2, y + gridSize / 2);
        }
    });

    // Determine if snake should flash red (death animation)
    const deathFlashRed = game.isDying && (Math.floor(Date.now() / 250) % 2 === 0);

    // Draw snake
    game.snake.forEach((segment, index) => {
        const x = segment.x * gridSize;
        const y = segment.y * gridSize;
        const isHead = index === 0;

        // Snake body with rounded corners
        const radius = gridSize / 2 - 1 * game.scale;
        const centerX = x + gridSize / 2;
        const centerY = y + gridSize / 2;

        // Gradient for 3D effect (or red if dying)
        if (deathFlashRed) {
            // Flash red during death
            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 12 * game.scale;
        } else if (isHead) {
            // Head is slightly larger and brighter
            ctx.fillStyle = CONFIG.COLORS.snakeHead;
            ctx.shadowColor = CONFIG.COLORS.snakeHead;
            ctx.shadowBlur = 8 * game.scale;
        } else {
            // Body segments get slightly darker toward tail
            const brightness = 1 - (index / game.snake.length) * 0.3;
            // Convert hex to rgba for opacity
            const bodyColor = CONFIG.COLORS.snakeBody;
            const r = parseInt(bodyColor.slice(1, 3), 16);
            const g = parseInt(bodyColor.slice(3, 5), 16);
            const b = parseInt(bodyColor.slice(5, 7), 16);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`;
            ctx.shadowBlur = 0;
        }

        // Draw rounded segment
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Add outline
        ctx.strokeStyle = deathFlashRed ? '#b91c1c' : CONFIG.COLORS.snakeOutline;
        ctx.lineWidth = 2 * game.scale;
        ctx.stroke();

        // Draw eyes on head (not during death flash)
        if (isHead && !deathFlashRed) {
            const eyeOffset = 4 * game.scale;
            const eyeRadius = 3 * game.scale;
            const eyeInset = 3 * game.scale;
            const pupilRadius = 1.5 * game.scale;

            // Position eyes based on direction
            let eye1X, eye1Y, eye2X, eye2Y;

            if (game.direction.x === 1) { // Right
                eye1X = centerX + eyeInset; eye1Y = centerY - eyeOffset;
                eye2X = centerX + eyeInset; eye2Y = centerY + eyeOffset;
            } else if (game.direction.x === -1) { // Left
                eye1X = centerX - eyeInset; eye1Y = centerY - eyeOffset;
                eye2X = centerX - eyeInset; eye2Y = centerY + eyeOffset;
            } else if (game.direction.y === -1) { // Up
                eye1X = centerX - eyeOffset; eye1Y = centerY - eyeInset;
                eye2X = centerX + eyeOffset; eye2Y = centerY - eyeInset;
            } else { // Down
                eye1X = centerX - eyeOffset; eye1Y = centerY + eyeInset;
                eye2X = centerX + eyeOffset; eye2Y = centerY + eyeInset;
            }

            // White of eyes
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(eye1X, eye1Y, eyeRadius, 0, Math.PI * 2);
            ctx.arc(eye2X, eye2Y, eyeRadius, 0, Math.PI * 2);
            ctx.fill();

            // Pupils
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath();
            ctx.arc(eye1X + game.direction.x * game.scale, eye1Y + game.direction.y * game.scale, pupilRadius, 0, Math.PI * 2);
            ctx.arc(eye2X + game.direction.x * game.scale, eye2Y + game.direction.y * game.scale, pupilRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// =============================================
// INPUT HANDLING
// =============================================

function handleKeyDown(e) {
    // Spacebar to start/restart when not running
    if (e.key === ' ' && !game.isRunning) {
        const startScreen = document.getElementById('start-screen');
        const gameOverScreen = document.getElementById('game-over');

        if (!startScreen.classList.contains('hidden')) {
            startGame();
        } else if (!gameOverScreen.classList.contains('hidden')) {
            restartGame();
        }
        return;
    }

    if (!game.isRunning) return;

    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            setDirection('up');
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            setDirection('down');
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            setDirection('left');
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            setDirection('right');
            break;
    }
}

function setDirection(dir) {
    if (!game.isRunning) return;

    // Get the last queued direction, or current direction if queue is empty
    const lastDir = game.directionQueue.length > 0
        ? game.directionQueue[game.directionQueue.length - 1]
        : game.direction;

    let newDir = null;

    switch (dir) {
        case 'up':
            if (lastDir.y !== 1) newDir = { x: 0, y: -1 };
            break;
        case 'down':
            if (lastDir.y !== -1) newDir = { x: 0, y: 1 };
            break;
        case 'left':
            if (lastDir.x !== 1) newDir = { x: -1, y: 0 };
            break;
        case 'right':
            if (lastDir.x !== -1) newDir = { x: 1, y: 0 };
            break;
    }

    // Add to queue if valid and queue not full (max 2 buffered inputs)
    if (newDir && game.directionQueue.length < 2) {
        game.directionQueue.push(newDir);
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    game.touchStartX = touch.clientX;
    game.touchStartY = touch.clientY;
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!game.touchStartX || !game.touchStartY) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - game.touchStartX;
    const deltaY = touch.clientY - game.touchStartY;

    const minSwipe = 30; // Minimum swipe distance

    if (Math.abs(deltaX) > minSwipe || Math.abs(deltaY) > minSwipe) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            setDirection(deltaX > 0 ? 'right' : 'left');
        } else {
            // Vertical swipe
            setDirection(deltaY > 0 ? 'down' : 'up');
        }

        // Reset touch start
        game.touchStartX = 0;
        game.touchStartY = 0;
    }
}

// =============================================
// UI UPDATES
// =============================================

function updateAnimalDisplay() {
    document.getElementById('animal-emoji').textContent = game.currentAnimal.emoji;
}

function updateWordDisplay() {
    const container = document.getElementById('word-letters');
    container.innerHTML = '';
    container.style.transform = 'scale(1)'; // Reset scale

    game.currentAnimal.word.split('').forEach((letter, index) => {
        const box = document.createElement('div');
        box.className = 'letter-box';

        if (index < game.currentLetterIndex) {
            // Already collected - show the letter
            box.classList.add('collected');
            box.textContent = letter;
        } else {
            // Not yet collected - show ? (no hints!)
            box.textContent = '?';
        }

        container.appendChild(box);
    });

    // Scale down if word is too wide for container
    requestAnimationFrame(() => {
        scaleWordToFit();
    });
}

function scaleWordToFit() {
    const container = document.getElementById('word-letters');
    const parent = container.parentElement;
    const containerWidth = container.scrollWidth;
    const parentWidth = parent.offsetWidth;

    if (containerWidth > parentWidth) {
        const scale = parentWidth / containerWidth;
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = 'center center';
    } else {
        container.style.transform = 'scale(1)';
    }
}

function updateScoreDisplay() {
    document.getElementById('score').textContent = game.score;
}

function updateStrikesDisplay() {
    const container = document.getElementById('strikes-display');
    container.innerHTML = '';

    for (let i = 0; i < game.maxStrikes; i++) {
        const cross = document.createElement('span');
        cross.className = 'strike-icon';
        if (i < game.strikes) {
            cross.classList.add('used');
            cross.textContent = '❌';
        } else {
            cross.textContent = '❤️';
        }
        container.appendChild(cross);
    }
}

function showHeaderCelebration() {
    // Show the completed word with celebration styling
    const container = document.getElementById('word-letters');
    container.innerHTML = '';

    game.currentAnimal.word.split('').forEach((letter) => {
        const box = document.createElement('div');
        box.className = 'letter-box collected celebrating';
        box.textContent = letter;
        container.appendChild(box);
    });

    // Make animal emoji celebrate
    const emoji = document.getElementById('animal-emoji');
    emoji.classList.add('celebrating');
}

function showFindingAnimal() {
    // Show "finding" state while searching for new animal
    const container = document.getElementById('word-letters');
    container.innerHTML = '<div class="finding-text">Finding next animal...</div>';

    // Show searching emoji
    const emoji = document.getElementById('animal-emoji');
    emoji.classList.remove('celebrating');
    emoji.textContent = '🔍';
}

// =============================================
// EFFECTS
// =============================================

function triggerConfetti() {
    // Center burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Side cannons
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 200);
}

// =============================================
// DIFFICULTY
// =============================================

function getMaxWordLength() {
    for (const diff of CONFIG.DIFFICULTY) {
        if (game.level >= diff.minLevel && game.level <= diff.maxLevel) {
            return diff.maxWordLength;
        }
    }
    return 9; // Default to all words
}

// =============================================
// START
// =============================================

// Initialize when page loads
window.addEventListener('DOMContentLoaded', init);
