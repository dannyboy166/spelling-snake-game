/**
 * ANIMALS DATA - Word list for Spelling Snake
 *
 * CURRENT STATE: 6 demo words for Department of Education presentation
 * Each word has a HeyGen teacher video in assets/teacher-videos/
 *
 * TO ADD MORE WORDS:
 * 1. Create HeyGen video with green screen: "Spell the word [WORD]"
 * 2. Save as: assets/teacher-videos/spell-{word}.mp4 (lowercase)
 * 3. Add word to this ANIMALS array below
 * 4. Add word to VIDEO_WORDS array in game.js
 *
 * Format: { word: 'WORD', emoji: '🐱', scale: 2.16, offsetY: 10 }
 * - scale: Lottie animation size multiplier
 * - offsetY: pixels down (positive) or up (negative)
 */

const ANIMALS = [
    // 3-letter words
    { word: 'CAT', emoji: '🐱', scale: 2.16, offsetY: 10 },
    { word: 'DOG', emoji: '🐕', scale: 2.98, offsetY: 19 },
    { word: 'SUN', emoji: '☀️', scale: 2.16, offsetY: 10 },
    // 4-letter words
    { word: 'FISH', emoji: '🐟', scale: 2.43, offsetY: 10 },
    { word: 'GOAT', emoji: '🐐', scale: 2.38, offsetY: 10 },
    // 5-letter words
    { word: 'SNAKE', emoji: '🐍', scale: 2.16, offsetY: 15 }

    // === ADD MORE WORDS BELOW ===
    // { word: 'PIG', emoji: '🐷', scale: 3.27, offsetY: 14 },
    // { word: 'ANT', emoji: '🐜', scale: 2.16, offsetY: 10 },
    // { word: 'BUS', emoji: '🚌', scale: 2.59, offsetY: 22 },
    // { word: 'SHEEP', emoji: '🐑', scale: 4.21, offsetY: 24 },
    // { word: 'MOON', emoji: '🌙', scale: 2.16, offsetY: 10 },
    // { word: 'TREE', emoji: '🌳', scale: 3.24, offsetY: 20 },
];

/**
 * Get animals filtered by maximum word length
 * @param {number} maxLength - Maximum word length to include
 * @returns {Array} Filtered animals array
 */
function getAnimalsByDifficulty(maxLength) {
    return ANIMALS.filter(animal => animal.word.length <= maxLength);
}

/**
 * Get a random animal from the list
 * @param {Array} excludeWords - Words to exclude (already used)
 * @param {number} maxLength - Maximum word length
 * @returns {Object} Random animal object
 */
function getRandomAnimal(excludeWords = [], maxLength = 9) {
    const available = ANIMALS.filter(
        animal => !excludeWords.includes(animal.word) && animal.word.length <= maxLength
    );

    // If all animals used, return null (game complete!)
    if (available.length === 0) {
        return null;
    }

    return available[Math.floor(Math.random() * available.length)];
}
