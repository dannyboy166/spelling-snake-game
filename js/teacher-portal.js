/**
 * TEACHER PORTAL
 * Allows teachers to create custom spelling word lists
 */

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

// =============================================
// INITIALIZATION
// =============================================

function init() {
    renderWordCheckboxes();
    loadSavedLists();
    setupEventListeners();
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
// SAVED LISTS
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
