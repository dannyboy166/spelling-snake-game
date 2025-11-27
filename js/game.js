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
    nextDirection: { x: 1, y: 0 },

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

    // Set canvas size
    game.canvas.width = CONFIG.GRID_SIZE * CONFIG.GRID_WIDTH;
    game.canvas.height = CONFIG.GRID_SIZE * CONFIG.GRID_HEIGHT;

    // Set up event listeners
    setupEventListeners();

    // Initial render
    render();
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

    // Prevent arrow key scrolling
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
    });
}

// =============================================
// GAME FLOW
// =============================================

function startGame() {
    // Initialize audio
    audioManager.init();
    audioManager.playStart();

    // Reset game state
    game.score = 0;
    game.level = 1;
    game.animalsSpelled = 0;
    game.usedAnimals = [];
    game.speed = CONFIG.INITIAL_SPEED;

    // Update score display
    updateScoreDisplay();

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
        game.nextDirection = { x: 1, y: 0 };
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

function gameOver() {
    game.isRunning = false;
    clearInterval(game.gameLoop);

    audioManager.playGameOver();

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

    // Apply next direction
    game.direction = { ...game.nextDirection };

    // Calculate new head position
    const head = game.snake[0];
    const newHead = {
        x: head.x + game.direction.x,
        y: head.y + game.direction.y
    };

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= CONFIG.GRID_WIDTH ||
        newHead.y < 0 || newHead.y >= CONFIG.GRID_HEIGHT) {
        gameOver();
        return;
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

        if (letter.char === nextLetter) {
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
            // Wrong letter - remove tail (no growth), optional penalty
            game.snake.pop();
            audioManager.playWrongLetter();
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
    const gridSize = CONFIG.GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = CONFIG.COLORS.background;
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    // Draw subtle grid
    ctx.strokeStyle = CONFIG.COLORS.gridLines;
    ctx.lineWidth = 0.5;
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

    // Draw letters - ALL letters look the same (no hints!)
    game.letters.forEach(letter => {
        const x = letter.x * gridSize;
        const y = letter.y * gridSize;

        // All letters glow equally - kids must figure out the spelling!
        ctx.shadowColor = CONFIG.COLORS.letterGlow;
        ctx.shadowBlur = 12;

        // Background circle
        ctx.fillStyle = CONFIG.COLORS.letterBg;
        ctx.beginPath();
        ctx.arc(x + gridSize / 2, y + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Letter text
        ctx.fillStyle = CONFIG.COLORS.letterText;
        ctx.font = `bold ${gridSize - 8}px Fredoka`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter.char, x + gridSize / 2, y + gridSize / 2 + 1);
    });

    // Draw snake
    game.snake.forEach((segment, index) => {
        const x = segment.x * gridSize;
        const y = segment.y * gridSize;
        const isHead = index === 0;

        // Snake body with rounded corners
        const radius = gridSize / 2 - 1;
        const centerX = x + gridSize / 2;
        const centerY = y + gridSize / 2;

        // Gradient for 3D effect
        if (isHead) {
            // Head is slightly larger and brighter
            ctx.fillStyle = CONFIG.COLORS.snakeHead;
            ctx.shadowColor = CONFIG.COLORS.snakeHead;
            ctx.shadowBlur = 8;
        } else {
            // Body segments get slightly darker toward tail
            const brightness = 1 - (index / game.snake.length) * 0.3;
            ctx.fillStyle = `rgba(34, 197, 94, ${brightness})`;
            ctx.shadowBlur = 0;
        }

        // Draw rounded segment
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Add outline
        ctx.strokeStyle = CONFIG.COLORS.snakeOutline;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw eyes on head
        if (isHead) {
            const eyeOffset = 4;
            const eyeRadius = 3;

            // Position eyes based on direction
            let eye1X, eye1Y, eye2X, eye2Y;

            if (game.direction.x === 1) { // Right
                eye1X = centerX + 3; eye1Y = centerY - eyeOffset;
                eye2X = centerX + 3; eye2Y = centerY + eyeOffset;
            } else if (game.direction.x === -1) { // Left
                eye1X = centerX - 3; eye1Y = centerY - eyeOffset;
                eye2X = centerX - 3; eye2Y = centerY + eyeOffset;
            } else if (game.direction.y === -1) { // Up
                eye1X = centerX - eyeOffset; eye1Y = centerY - 3;
                eye2X = centerX + eyeOffset; eye2Y = centerY - 3;
            } else { // Down
                eye1X = centerX - eyeOffset; eye1Y = centerY + 3;
                eye2X = centerX + eyeOffset; eye2Y = centerY + 3;
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
            ctx.arc(eye1X + game.direction.x, eye1Y + game.direction.y, 1.5, 0, Math.PI * 2);
            ctx.arc(eye2X + game.direction.x, eye2Y + game.direction.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// =============================================
// INPUT HANDLING
// =============================================

function handleKeyDown(e) {
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

    const current = game.direction;

    switch (dir) {
        case 'up':
            if (current.y !== 1) game.nextDirection = { x: 0, y: -1 };
            break;
        case 'down':
            if (current.y !== -1) game.nextDirection = { x: 0, y: 1 };
            break;
        case 'left':
            if (current.x !== 1) game.nextDirection = { x: -1, y: 0 };
            break;
        case 'right':
            if (current.x !== -1) game.nextDirection = { x: 1, y: 0 };
            break;
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
}

function updateScoreDisplay() {
    document.getElementById('score').textContent = game.score;
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
