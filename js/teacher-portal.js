/**
 * TEACHER PORTAL
 * Allows teachers to create custom spelling word lists
 */

// =============================================
// SHARED LISTS (visible to everyone)
// Complete word lists from curriculum PDFs
// =============================================
const SHARED_LISTS = [
    // ========== YEAR 2 CORE WORDS (Australian Curriculum) ==========
    {
        name: "Year 2 Core Words",
        category: "Year 2",
        words: [
            "ABOUT", "AFTER", "AFTERNOON", "ALONG", "ALSO", "AGAIN", "ANY", "ANYONE",
            "ANYTHING", "ANOTHER", "AROUND", "ASK", "BECAUSE", "BEFORE", "BEST", "BEEN",
            "BETTER", "BROTHER", "CALLED", "CAME", "CHILDREN", "COMING", "COULD", "CRY",
            "DEAR", "DOES", "DOING", "DOOR", "EAT", "EVERY", "FACE", "FAST", "FIND",
            "FIRST", "FOUND", "FRIEND", "GAVE", "GIVE", "GOING", "GONE", "HALF", "HAPPY",
            "HEAD", "HEAR", "HOUSE", "INSIDE", "KIND", "LETTER", "LIVE", "LUNCH", "LONG",
            "MADE", "MAKE", "MANY", "MISS", "MORNING", "MR", "MRS", "MYSELF", "NAME",
            "NEVER", "NEW", "NEXT", "NICE", "NIGHT", "NOW", "OLD", "ONCE", "OPEN", "OUR",
            "OUT", "PEOPLE", "PLACE", "PRETTY", "READ", "ROAD", "SHOULD", "SISTER",
            "SOMETHING", "START", "STORY", "THEIR", "THERE", "THESE", "THING", "THINK",
            "TIME", "TOLD", "TODAY", "TOO", "TWO", "VERY", "WANT", "WATER", "WERE",
            "WHAT", "WHO", "WOULD", "YEAR", "YOUR"
        ]
    },
    {
        name: "Year 2 Days of the Week",
        category: "Year 2",
        words: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
    },
    {
        name: "Year 2 Numbers",
        category: "Year 2",
        words: [
            "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN",
            "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN",
            "EIGHTEEN", "NINETEEN", "TWENTY"
        ]
    },
    {
        name: "Year 2 Months",
        category: "Year 2",
        words: [
            "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
        ]
    },
    {
        name: "Year 2 Seasons",
        category: "Year 2",
        words: ["SUMMER", "AUTUMN", "WINTER", "SPRING"]
    },

    // ========== YEAR 3 CORE WORDS (Australian Curriculum) ==========
    {
        name: "Year 3 Core Words",
        category: "Year 3",
        words: [
            "ABLE", "ACROSS", "AGAINST", "AIR", "ALONG", "ALREADY", "ANIMAL", "ANYTHING",
            "ASLEEP", "AUSTRALIA", "BEAUTIFUL", "BIRD", "BOOK", "BOX", "BROUGHT", "CITY",
            "CLOTHES", "COLD", "COLOUR", "CORNER", "DIED", "DIFFERENT", "DOLLARS", "DURING",
            "EARLY", "EVEN", "EVERYBODY", "EVERYTHING", "FEET", "FELT", "FINALLY", "FLOOR",
            "GAMES", "GOES", "HAIR", "HARD", "HELLO", "HIGH", "LARGE", "LEAVE", "LIGHT",
            "NOTHING", "OWN", "PACKED", "PARENTS", "PEOPLE", "PERSON", "QUICKLY", "RAIN",
            "RING", "SEEN", "SENT", "SHOULD", "SHOW", "SIDE", "SLEPT", "SLOWLY", "SOMEONE",
            "SPACE", "STATION", "STAY", "STRAIGHT", "STRANGE", "STREET", "SUDDEN", "SURE",
            "TALK", "TELEVISION", "THAN", "TOWN", "TRAIN", "TRY", "USED", "VOICE", "WATCH",
            "WEEKS", "WON", "WRITE"
        ]
    },

    // ========== DOLCH SIGHT WORDS ==========
    {
        name: "Dolch Pre-Kindergarten",
        category: "Dolch",
        words: [
            "A", "AND", "AWAY", "BIG", "BLUE", "CAN", "COME", "DOWN", "FIND", "FOR",
            "FUNNY", "GO", "HELP", "HERE", "I", "IN", "IS", "IT", "JUMP", "LITTLE",
            "LOOK", "MAKE", "ME", "MY", "NOT", "ONE", "PLAY", "RED", "RUN", "SAID",
            "SEE", "THE", "THREE", "TO", "TWO", "UP", "WE", "WHERE", "YELLOW", "YOU"
        ]
    },
    {
        name: "Dolch Kindergarten",
        category: "Dolch",
        words: [
            "ALL", "AM", "ARE", "AT", "ATE", "BE", "BLACK", "BROWN", "BUT", "CAME",
            "DID", "DO", "EAT", "FOUR", "GET", "GOOD", "HAVE", "HE", "INTO", "LIKE",
            "MUST", "NEW", "NO", "NOW", "ON", "OUR", "OUT", "PLEASE", "PRETTY", "RAN",
            "RIDE", "SAW", "SAY", "SHE", "SO", "SOON", "THAT", "THERE", "THEY", "THIS",
            "TOO", "UNDER", "WANT", "WAS", "WELL", "WENT", "WHAT", "WHITE", "WHO",
            "WILL", "WITH", "YES"
        ]
    },
    {
        name: "Dolch First Grade",
        category: "Dolch",
        words: [
            "AFTER", "AGAIN", "AN", "ANY", "AS", "ASK", "BY", "COULD", "EVERY", "FLY",
            "FROM", "GIVE", "GOING", "HAD", "HAS", "HER", "HIM", "HIS", "HOW", "JUST",
            "KNOW", "LET", "LIVE", "MAY", "OF", "OLD", "ONCE", "OPEN", "OVER", "PUT",
            "ROUND", "SOME", "STOP", "TAKE", "THANK", "THEM", "THEN", "THINK", "WALK",
            "WERE", "WHEN"
        ]
    },
    {
        name: "Dolch Second Grade",
        category: "Dolch",
        words: [
            "ALWAYS", "AROUND", "BECAUSE", "BEEN", "BEFORE", "BEST", "BOTH", "BUY",
            "CALL", "COLD", "DOES", "FAST", "FIRST", "FIVE", "FOUND", "GAVE", "GOES",
            "GREEN", "ITS", "MADE", "MANY", "OFF", "OR", "PULL", "READ", "RIGHT", "SING",
            "SIT", "SLEEP", "TELL", "THEIR", "THESE", "THOSE", "UPON", "US", "USE",
            "VERY", "WASH", "WHICH", "WHY", "WISH", "WORK", "WOULD", "WRITE", "YOUR"
        ]
    },
    {
        name: "Dolch Third Grade",
        category: "Dolch",
        words: [
            "ABOUT", "BETTER", "BRING", "CARRY", "CLEAN", "CUT", "DONE", "DRAW", "DRINK",
            "EIGHT", "FALL", "FAR", "FULL", "GOT", "GROW", "HOLD", "HOT", "HURT", "IF",
            "KEEP", "KIND", "LAUGH", "LIGHT", "LONG", "MUCH", "MYSELF", "NEVER", "ONLY",
            "OWN", "PICK", "SEVEN", "SHALL", "SHOW", "SIX", "SMALL", "START", "TEN",
            "TODAY", "TOGETHER", "TRY", "WARM"
        ]
    },
    {
        name: "Dolch Nouns",
        category: "Dolch",
        words: [
            "APPLE", "BABY", "BACK", "BALL", "BEAR", "BED", "BELL", "BIRD", "BIRTHDAY",
            "BOAT", "BOX", "BOY", "BREAD", "BROTHER", "CAKE", "CAR", "CAT", "CHAIR",
            "CHICKEN", "CHILDREN", "CHRISTMAS", "COAT", "CORN", "COW", "DAY", "DOG",
            "DOLL", "DOOR", "DUCK", "EGG", "EYE", "FARM", "FARMER", "FATHER", "FEET",
            "FIRE", "FISH", "FLOOR", "FLOWER", "GAME", "GARDEN", "GIRL", "GOODBYE",
            "GRASS", "GROUND", "HAND", "HEAD", "HILL", "HOME", "HORSE", "HOUSE", "KITTY",
            "LEG", "LETTER", "MAN", "MEN", "MILK", "MONEY", "MORNING", "MOTHER", "NAME",
            "NEST", "NIGHT", "PAPER", "PARTY", "PICTURE", "PIG", "RABBIT", "RAIN", "RING",
            "ROBIN", "SCHOOL", "SEED", "SHEEP", "SHOE", "SISTER", "SNOW", "SONG",
            "SQUIRREL", "STICK", "STREET", "SUN", "TABLE", "THING", "TIME", "TOP", "TOY",
            "TREE", "WATCH", "WATER", "WAY", "WIND", "WINDOW", "WOOD"
        ]
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

// State for expanded list
let expandedListIndex = null;
let listSelectedWords = new Set();

// =============================================
// SHARED LISTS (Pre-made, visible to everyone)
// =============================================

function renderSharedLists() {
    const container = document.getElementById('shared-lists');

    const filteredLists = currentFilter === 'all'
        ? SHARED_LISTS
        : SHARED_LISTS.filter(list => list.category === currentFilter);

    container.innerHTML = filteredLists.map((list) => {
        const originalIndex = SHARED_LISTS.indexOf(list);
        const isExpanded = expandedListIndex === originalIndex;

        return `
        <div class="shared-list-item ${isExpanded ? 'expanded' : ''}" data-index="${originalIndex}">
            <div class="list-header" onclick="toggleListExpand(${originalIndex})">
                <div class="list-info">
                    <span class="expand-icon">${isExpanded ? '▼' : '▶'}</span>
                    <span class="list-name">${list.name}</span>
                    <span class="list-count">${list.words.length} words</span>
                </div>
                <div class="list-quick-actions">
                    <button class="list-btn play-btn" onclick="event.stopPropagation(); playSharedList(${originalIndex})" title="Play all words">
                        🎮 Play All
                    </button>
                </div>
            </div>
            ${isExpanded ? renderExpandedList(list, originalIndex) : ''}
        </div>
    `}).join('');
}

function renderExpandedList(list, index) {
    const wordsHtml = list.words.map(word => {
        const isSelected = listSelectedWords.has(word);
        const hasLottie = LOTTIE_WORDS.some(l => l.word === word);
        return `
            <label class="list-word-checkbox ${isSelected ? 'selected' : ''}" onclick="event.stopPropagation()">
                <input type="checkbox" value="${word}" ${isSelected ? 'checked' : ''}
                       onchange="toggleListWord('${word}', this.checked)">
                <span class="word-label">${word}</span>
                ${hasLottie ? '<span class="has-anim">✨</span>' : '<span class="has-tts">🔊</span>'}
            </label>
        `;
    }).join('');

    const selectedCount = listSelectedWords.size;

    return `
        <div class="list-expanded-content" onclick="event.stopPropagation()">
            <div class="list-select-actions">
                <button class="select-action-btn" onclick="selectAllListWords(${index})">Select All</button>
                <button class="select-action-btn" onclick="deselectAllListWords()">Deselect All</button>
                <span class="selected-info">${selectedCount} selected</span>
            </div>
            <div class="list-words-grid">
                ${wordsHtml}
            </div>
            <div class="list-use-actions">
                <button class="use-selected-btn" onclick="useSelectedWords()" ${selectedCount === 0 ? 'disabled' : ''}>
                    Use ${selectedCount} Selected Words
                </button>
            </div>
        </div>
    `;
}

function toggleListExpand(index) {
    if (expandedListIndex === index) {
        expandedListIndex = null;
    } else {
        expandedListIndex = index;
        listSelectedWords.clear();
    }
    renderSharedLists();
}

function toggleListWord(word, isChecked) {
    if (isChecked) {
        listSelectedWords.add(word);
    } else {
        listSelectedWords.delete(word);
    }
    renderSharedLists();
}

function selectAllListWords(index) {
    const list = SHARED_LISTS[index];
    list.words.forEach(word => listSelectedWords.add(word));
    renderSharedLists();
}

function deselectAllListWords() {
    listSelectedWords.clear();
    renderSharedLists();
}

function useSelectedWords() {
    if (listSelectedWords.size === 0) return;

    // Clear current selections
    selectedWords.clear();
    document.querySelectorAll('.word-checkbox').forEach(label => {
        const checkbox = label.querySelector('input');
        checkbox.checked = false;
        label.classList.remove('selected');
    });

    // Load selected words
    listSelectedWords.forEach(word => {
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

    // Load custom words (those without Lottie)
    const customWordsList = [...listSelectedWords].filter(w => !LOTTIE_WORDS.some(l => l.word === w));
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

    // Collapse the list and scroll to top
    expandedListIndex = null;
    listSelectedWords.clear();
    renderSharedLists();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            expandedListIndex = null;
            listSelectedWords.clear();
            renderSharedLists();
        });
    });
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
