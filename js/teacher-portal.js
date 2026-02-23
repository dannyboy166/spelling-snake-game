/**
 * TEACHER PORTAL
 * Allows teachers to create custom spelling word lists
 */

// =============================================
// SHARED LISTS (visible to everyone)
// To add a new list: add it here and push to GitHub
// =============================================
const SHARED_LISTS = [
    // ========== YEAR 2 CORE WORDS ==========
    {
        name: "Year 2 - Week 1",
        words: ["ABOUT", "AFTER", "AGAIN", "ALONG", "ALSO", "ANY"],
        author: "Year 2"
    },
    {
        name: "Year 2 - Week 2",
        words: ["BECAUSE", "BEFORE", "BEST", "BEEN", "BETTER", "BROTHER"],
        author: "Year 2"
    },
    {
        name: "Year 2 - Week 3",
        words: ["CALLED", "CAME", "CHILDREN", "COMING", "COULD", "CRY"],
        author: "Year 2"
    },
    {
        name: "Year 2 - Week 4",
        words: ["DEAR", "DOES", "DOING", "DOOR", "EAT", "EVERY"],
        author: "Year 2"
    },
    {
        name: "Year 2 - Week 5",
        words: ["FACE", "FAST", "FIND", "FIRST", "FOUND", "FRIEND"],
        author: "Year 2"
    },
    {
        name: "Year 2 - Week 6",
        words: ["GAVE", "GIVE", "GOING", "GONE", "HALF", "HAPPY"],
        author: "Year 2"
    },
    {
        name: "Year 2 - Week 7",
        words: ["HEAD", "HEAR", "HOUSE", "INSIDE", "KIND", "LETTER"],
        author: "Year 2"
    },
    {
        name: "Year 2 - Week 8",
        words: ["LIVE", "LUNCH", "LONG", "MADE", "MAKE", "MANY"],
        author: "Year 2"
    },
    {
        name: "Year 2 - Week 9",
        words: ["MORNING", "MYSELF", "NAME", "NEVER", "NEW", "NEXT"],
        author: "Year 2"
    },
    {
        name: "Year 2 - Week 10",
        words: ["NICE", "NIGHT", "NOW", "OLD", "ONCE", "OPEN"],
        author: "Year 2"
    },
    {
        name: "Year 2 - Days of Week",
        words: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
        author: "Year 2"
    },
    {
        name: "Year 2 - Weekend + Numbers",
        words: ["SATURDAY", "SUNDAY", "ONE", "TWO", "THREE", "FOUR", "FIVE"],
        author: "Year 2"
    },
    {
        name: "Year 2 - Numbers 6-12",
        words: ["SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE"],
        author: "Year 2"
    },
    {
        name: "Year 2 - Seasons",
        words: ["SUMMER", "AUTUMN", "WINTER", "SPRING"],
        author: "Year 2"
    },

    // ========== YEAR 3 CORE WORDS ==========
    {
        name: "Year 3 - Week 1",
        words: ["ABLE", "ACROSS", "AGAINST", "AIR", "ALONG", "ALREADY"],
        author: "Year 3"
    },
    {
        name: "Year 3 - Week 2",
        words: ["ANIMAL", "ANYTHING", "ASLEEP", "AUSTRALIA", "BEAUTIFUL", "BIRD"],
        author: "Year 3"
    },
    {
        name: "Year 3 - Week 3",
        words: ["BOOK", "BOX", "BROUGHT", "CITY", "CLOTHES", "COLD"],
        author: "Year 3"
    },
    {
        name: "Year 3 - Week 4",
        words: ["COLOUR", "CORNER", "DIFFERENT", "DOLLARS", "DURING", "EARLY"],
        author: "Year 3"
    },
    {
        name: "Year 3 - Week 5",
        words: ["EVEN", "EVERYBODY", "EVERYTHING", "FEET", "FELT", "FINALLY"],
        author: "Year 3"
    },
    {
        name: "Year 3 - Week 6",
        words: ["FLOOR", "GAMES", "GOES", "HAIR", "HARD", "HELLO"],
        author: "Year 3"
    },
    {
        name: "Year 3 - Week 7",
        words: ["HIGH", "LARGE", "LEAVE", "LIGHT", "NOTHING", "OWN"],
        author: "Year 3"
    },
    {
        name: "Year 3 - Week 8",
        words: ["PACKED", "PARENTS", "PEOPLE", "PERSON", "QUICKLY", "RAIN"],
        author: "Year 3"
    },
    {
        name: "Year 3 - Week 9",
        words: ["RING", "SEEN", "SENT", "SHOULD", "SHOW", "SIDE"],
        author: "Year 3"
    },
    {
        name: "Year 3 - Week 10",
        words: ["SLEPT", "SLOWLY", "SOMEONE", "SPACE", "STATION", "STAY"],
        author: "Year 3"
    },

    // ========== DOLCH SIGHT WORDS ==========
    {
        name: "Dolch - Pre-K Set 1",
        words: ["AND", "AWAY", "BIG", "BLUE", "CAN", "COME"],
        author: "Dolch"
    },
    {
        name: "Dolch - Pre-K Set 2",
        words: ["DOWN", "FIND", "FOR", "FUNNY", "GO", "HELP"],
        author: "Dolch"
    },
    {
        name: "Dolch - Pre-K Set 3",
        words: ["HERE", "IN", "IS", "IT", "JUMP", "LITTLE"],
        author: "Dolch"
    },
    {
        name: "Dolch - Pre-K Set 4",
        words: ["LOOK", "MAKE", "ME", "MY", "NOT", "ONE"],
        author: "Dolch"
    },
    {
        name: "Dolch - Pre-K Set 5",
        words: ["PLAY", "RED", "RUN", "SAID", "SEE", "THE"],
        author: "Dolch"
    },
    {
        name: "Dolch - Kindergarten 1",
        words: ["ALL", "AM", "ARE", "AT", "ATE", "BE"],
        author: "Dolch"
    },
    {
        name: "Dolch - Kindergarten 2",
        words: ["BLACK", "BROWN", "BUT", "CAME", "DID", "DO"],
        author: "Dolch"
    },
    {
        name: "Dolch - Kindergarten 3",
        words: ["EAT", "FOUR", "GET", "GOOD", "HAVE", "HE"],
        author: "Dolch"
    },
    {
        name: "Dolch - Kindergarten 4",
        words: ["INTO", "LIKE", "MUST", "NEW", "NO", "NOW"],
        author: "Dolch"
    },
    {
        name: "Dolch - Kindergarten 5",
        words: ["ON", "OUR", "OUT", "PLEASE", "PRETTY", "RAN"],
        author: "Dolch"
    },
    {
        name: "Dolch - Grade 1 Set 1",
        words: ["AFTER", "AGAIN", "AN", "ANY", "AS", "ASK"],
        author: "Dolch"
    },
    {
        name: "Dolch - Grade 1 Set 2",
        words: ["BY", "COULD", "EVERY", "FLY", "FROM", "GIVE"],
        author: "Dolch"
    },
    {
        name: "Dolch - Grade 1 Set 3",
        words: ["GOING", "HAD", "HAS", "HER", "HIM", "HIS"],
        author: "Dolch"
    },
    {
        name: "Dolch - Grade 2 Set 1",
        words: ["ALWAYS", "AROUND", "BECAUSE", "BEEN", "BEFORE", "BEST"],
        author: "Dolch"
    },
    {
        name: "Dolch - Grade 2 Set 2",
        words: ["BOTH", "BUY", "CALL", "COLD", "DOES", "FAST"],
        author: "Dolch"
    },
    {
        name: "Dolch - Grade 2 Set 3",
        words: ["FIRST", "FIVE", "FOUND", "GAVE", "GOES", "GREEN"],
        author: "Dolch"
    },
    {
        name: "Dolch - Nouns Animals",
        words: ["CAT", "DOG", "PIG", "FISH", "BIRD", "DUCK"],
        author: "Dolch"
    },
    {
        name: "Dolch - Nouns Home",
        words: ["BED", "DOOR", "TABLE", "CHAIR", "FLOOR", "WINDOW"],
        author: "Dolch"
    },
    {
        name: "Dolch - Nouns Nature",
        words: ["SUN", "TREE", "RAIN", "SNOW", "GRASS", "FLOWER"],
        author: "Dolch"
    },
    {
        name: "Dolch - Nouns Family",
        words: ["MOTHER", "FATHER", "SISTER", "BROTHER", "BABY", "BOY", "GIRL"],
        author: "Dolch"
    }
];

// Words with Lottie animations available in the game
const LOTTIE_WORDS = [
    { word: 'ANT', emoji: '🐜' },
    { word: 'BUS', emoji: '🚌' },
    { word: 'CAT', emoji: '🐱' },
    { word: 'DOG', emoji: '🐕' },
    { word: 'FISH', emoji: '🐟' },
    { word: 'GOAT', emoji: '🐐' },
    { word: 'MOON', emoji: '🌙' },
    { word: 'PIG', emoji: '🐷' },
    { word: 'SHEEP', emoji: '🐑' },
    { word: 'SNAKE', emoji: '🐍' },
    { word: 'SUN', emoji: '☀️' },
    { word: 'TREE', emoji: '🌳' }
];

// State
let selectedWords = new Set();
let customWords = [];
let savedLists = [];

// State for filtering
let currentFilter = 'all';

// =============================================
// INITIALIZATION
// =============================================

function init() {
    renderWordCheckboxes();
    renderSharedLists();
    loadSavedLists();
    setupEventListeners();
    setupFilterButtons();
}

function renderWordCheckboxes() {
    const grid = document.getElementById('word-grid');
    grid.innerHTML = '';

    LOTTIE_WORDS.forEach(item => {
        const label = document.createElement('label');
        label.className = 'word-checkbox';
        label.innerHTML = `
            <input type="checkbox" value="${item.word}" class="checkbox-input">
            <span class="checkbox-custom"></span>
            <span class="word-emoji">${item.emoji}</span>
            <span class="word-text">${item.word}</span>
        `;
        grid.appendChild(label);

        // Add change listener
        const checkbox = label.querySelector('input');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                selectedWords.add(item.word);
                label.classList.add('selected');
            } else {
                selectedWords.delete(item.word);
                label.classList.remove('selected');
            }
            updateSelectedCount();
        });
    });
}

function setupEventListeners() {
    // Custom words input
    const customInput = document.getElementById('custom-words-input');
    customInput.addEventListener('input', handleCustomWordsInput);
    customInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleCustomWordsInput(e);
        }
    });

    // Generate button
    document.getElementById('generate-btn').addEventListener('click', generateLink);

    // Copy button
    document.getElementById('copy-btn').addEventListener('click', copyToClipboard);

    // Open game button
    document.getElementById('open-btn').addEventListener('click', openGame);

    // Save button
    document.getElementById('save-btn').addEventListener('click', showSaveDialog);

    // Save dialog
    document.getElementById('cancel-save').addEventListener('click', hideSaveDialog);
    document.getElementById('confirm-save').addEventListener('click', saveList);
    document.getElementById('list-name-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveList();
        if (e.key === 'Escape') hideSaveDialog();
    });

    // Close dialog on overlay click
    document.getElementById('save-dialog').addEventListener('click', (e) => {
        if (e.target.id === 'save-dialog') hideSaveDialog();
    });
}

// =============================================
// CUSTOM WORDS HANDLING
// =============================================

function handleCustomWordsInput(e) {
    const input = e.target.value.toUpperCase();
    const preview = document.getElementById('custom-words-preview');
    const tagsContainer = document.getElementById('preview-tags');

    // Parse comma-separated words
    customWords = input
        .split(',')
        .map(w => w.trim())
        .filter(w => w.length > 0 && /^[A-Z]+$/.test(w));

    if (customWords.length > 0) {
        preview.classList.remove('hidden');
        tagsContainer.innerHTML = customWords.map(word => {
            const isLottie = LOTTIE_WORDS.some(l => l.word === word);
            return `<span class="preview-tag ${isLottie ? 'has-animation' : 'tts-word'}">${word}${isLottie ? '' : ' 🔊'}</span>`;
        }).join('');
    } else {
        preview.classList.add('hidden');
    }

    updateSelectedCount();
}

// =============================================
// LINK GENERATION
// =============================================

function getAllSelectedWords() {
    // Combine selected Lottie words and custom words, removing duplicates
    const allWords = [...selectedWords, ...customWords];
    return [...new Set(allWords)];
}

function updateSelectedCount() {
    const allWords = getAllSelectedWords();
    document.getElementById('selected-count').textContent = allWords.length;
}

function generateLink() {
    const allWords = getAllSelectedWords();

    if (allWords.length === 0) {
        alert('Please select at least one word!');
        return;
    }

    // Build the URL
    const baseUrl = window.location.href.replace('teacher.html', 'index.html');
    const url = `${baseUrl}?words=${allWords.join(',')}`;

    // Show the link output
    const linkOutput = document.getElementById('link-output');
    const linkInput = document.getElementById('game-link');
    linkInput.value = url;
    linkOutput.classList.remove('hidden');

    // Scroll to show it
    linkOutput.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function copyToClipboard() {
    const linkInput = document.getElementById('game-link');
    linkInput.select();

    navigator.clipboard.writeText(linkInput.value).then(() => {
        // Show feedback
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="copy-icon">✓</span>';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        document.execCommand('copy');
    });
}

function openGame() {
    const linkInput = document.getElementById('game-link');
    window.open(linkInput.value, '_blank');
}

// =============================================
// SHARED LISTS (Pre-made, visible to everyone)
// =============================================

function renderSharedLists() {
    const container = document.getElementById('shared-lists');

    const filteredLists = currentFilter === 'all'
        ? SHARED_LISTS
        : SHARED_LISTS.filter(list => list.author === currentFilter);

    container.innerHTML = filteredLists.map((list, index) => {
        const originalIndex = SHARED_LISTS.indexOf(list);
        return `
        <div class="saved-list-item shared-item" data-index="${originalIndex}">
            <div class="list-info">
                <span class="list-name">${list.name}</span>
                <span class="list-count">${list.words.length} words</span>
            </div>
            <div class="list-words">${list.words.join(', ')}</div>
            <div class="list-actions">
                <button class="list-btn load-btn" onclick="loadSharedList(${originalIndex})" title="Load this list">
                    Load
                </button>
                <button class="list-btn play-btn" onclick="playSharedList(${originalIndex})" title="Play now">
                    🎮 Play
                </button>
            </div>
        </div>
    `}).join('');
}

function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderSharedLists();
        });
    });
}

function loadSharedList(index) {
    const list = SHARED_LISTS[index];
    if (!list) return;

    // Clear current selections
    selectedWords.clear();
    document.querySelectorAll('.word-checkbox').forEach(label => {
        const checkbox = label.querySelector('input');
        checkbox.checked = false;
        label.classList.remove('selected');
    });

    // Load Lottie words
    list.words.forEach(word => {
        const lottieWord = LOTTIE_WORDS.find(l => l.word === word);
        if (lottieWord) {
            selectedWords.add(word);
            const checkbox = document.querySelector(`input[value="${word}"]`);
            if (checkbox) {
                checkbox.checked = true;
                checkbox.closest('.word-checkbox').classList.add('selected');
            }
        }
    });

    // Load custom words
    const customWordsList = list.words.filter(w => !LOTTIE_WORDS.some(l => l.word === w));
    document.getElementById('custom-words-input').value = customWordsList.join(', ');
    customWords = customWordsList;

    // Update preview
    const preview = document.getElementById('custom-words-preview');
    const tagsContainer = document.getElementById('preview-tags');
    if (customWords.length > 0) {
        preview.classList.remove('hidden');
        tagsContainer.innerHTML = customWords.map(word =>
            `<span class="preview-tag tts-word">${word} 🔊</span>`
        ).join('');
    } else {
        preview.classList.add('hidden');
    }

    updateSelectedCount();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function playSharedList(index) {
    const list = SHARED_LISTS[index];
    if (!list) return;

    const baseUrl = window.location.href.replace('teacher.html', 'index.html');
    const url = `${baseUrl}?words=${list.words.join(',')}`;
    window.open(url, '_blank');
}

// =============================================
// SAVED LISTS (Personal, localStorage)
// =============================================

function loadSavedLists() {
    const saved = localStorage.getItem('spellingSnakeWordLists');
    savedLists = saved ? JSON.parse(saved) : [];
    renderSavedLists();
}

function saveSavedLists() {
    localStorage.setItem('spellingSnakeWordLists', JSON.stringify(savedLists));
}

function renderSavedLists() {
    const container = document.getElementById('saved-lists');
    const noSavedMsg = document.getElementById('no-saved-lists');

    if (savedLists.length === 0) {
        container.innerHTML = '';
        noSavedMsg.classList.remove('hidden');
        return;
    }

    noSavedMsg.classList.add('hidden');
    container.innerHTML = savedLists.map((list, index) => `
        <div class="saved-list-item" data-index="${index}">
            <div class="list-info">
                <span class="list-name">${list.name}</span>
                <span class="list-count">${list.words.length} words</span>
            </div>
            <div class="list-words">${list.words.join(', ')}</div>
            <div class="list-actions">
                <button class="list-btn load-btn" onclick="loadList(${index})" title="Load this list">
                    Load
                </button>
                <button class="list-btn play-btn" onclick="playList(${index})" title="Play now">
                    🎮 Play
                </button>
                <button class="list-btn delete-btn" onclick="deleteList(${index})" title="Delete">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

function showSaveDialog() {
    const dialog = document.getElementById('save-dialog');
    const input = document.getElementById('list-name-input');
    dialog.classList.remove('hidden');
    input.value = '';
    input.focus();
}

function hideSaveDialog() {
    document.getElementById('save-dialog').classList.add('hidden');
}

function saveList() {
    const nameInput = document.getElementById('list-name-input');
    const name = nameInput.value.trim();

    if (!name) {
        nameInput.focus();
        return;
    }

    const allWords = getAllSelectedWords();
    if (allWords.length === 0) {
        alert('No words selected to save!');
        return;
    }

    savedLists.push({
        name: name,
        words: allWords,
        created: new Date().toISOString()
    });

    saveSavedLists();
    renderSavedLists();
    hideSaveDialog();
}

function loadList(index) {
    const list = savedLists[index];
    if (!list) return;

    // Clear current selections
    selectedWords.clear();
    document.querySelectorAll('.word-checkbox').forEach(label => {
        const checkbox = label.querySelector('input');
        checkbox.checked = false;
        label.classList.remove('selected');
    });

    // Load Lottie words
    list.words.forEach(word => {
        const lottieWord = LOTTIE_WORDS.find(l => l.word === word);
        if (lottieWord) {
            selectedWords.add(word);
            const checkbox = document.querySelector(`input[value="${word}"]`);
            if (checkbox) {
                checkbox.checked = true;
                checkbox.closest('.word-checkbox').classList.add('selected');
            }
        }
    });

    // Load custom words
    const customWordsList = list.words.filter(w => !LOTTIE_WORDS.some(l => l.word === w));
    document.getElementById('custom-words-input').value = customWordsList.join(', ');
    customWords = customWordsList;

    // Update preview
    const preview = document.getElementById('custom-words-preview');
    const tagsContainer = document.getElementById('preview-tags');
    if (customWords.length > 0) {
        preview.classList.remove('hidden');
        tagsContainer.innerHTML = customWords.map(word =>
            `<span class="preview-tag tts-word">${word} 🔊</span>`
        ).join('');
    } else {
        preview.classList.add('hidden');
    }

    updateSelectedCount();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function playList(index) {
    const list = savedLists[index];
    if (!list) return;

    const baseUrl = window.location.href.replace('teacher.html', 'index.html');
    const url = `${baseUrl}?words=${list.words.join(',')}`;
    window.open(url, '_blank');
}

function deleteList(index) {
    if (confirm('Delete this word list?')) {
        savedLists.splice(index, 1);
        saveSavedLists();
        renderSavedLists();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
