/**
 * ANIMALS DATA
 * List of animals for the spelling game
 * Using only animals with Lottie animations
 */

const ANIMALS = [
    // 3-letter words
    // scale: size multiplier, offsetY: pixels down (positive) or up (negative)
    // Values perfected in lottie-test.html, then 10% smaller + 10px down
    { word: 'ANT', emoji: '🐜', scale: 2.16, offsetY: 10 },
    { word: 'CAT', emoji: '🐱', scale: 2.16, offsetY: 10 },
    { word: 'DOG', emoji: '🐕', scale: 2.98, offsetY: 19 },
    { word: 'PIG', emoji: '🐷', scale: 3.27, offsetY: 14 },

    // 4-letter words
    { word: 'FISH', emoji: '🐟', scale: 2.43, offsetY: 10 },
    { word: 'GOAT', emoji: '🐐', scale: 2.38, offsetY: 10 },

    // 5-letter words
    { word: 'SHEEP', emoji: '🐑', scale: 4.21, offsetY: 24 },
    { word: 'SNAKE', emoji: '🐍', scale: 2.16, offsetY: 15 },

    // Other words (not animals)
    { word: 'SUN', emoji: '☀️', scale: 2.16, offsetY: 10 },
    { word: 'BUS', emoji: '🚌', scale: 2.59, offsetY: 22 },
    { word: 'MOON', emoji: '🌙', scale: 2.16, offsetY: 10 },
    { word: 'TREE', emoji: '🌳', scale: 3.24, offsetY: 20 }
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
