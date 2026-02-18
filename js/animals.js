/**
 * ANIMALS DATA
 * List of animals for the spelling game
 * Using only animals with Lottie animations
 */

const ANIMALS = [
    // 3-letter words
    // scale: size multiplier (default 3), offsetY: pixels down (positive) or up (negative)
    { word: 'ANT', emoji: '🐜', scale: 2.4, offsetY: 5 },
    { word: 'CAT', emoji: '🐱', scale: 2.4, offsetY: 5 },
    { word: 'DOG', emoji: '🐕', scale: 2.88, offsetY: 25 },
    { word: 'PIG', emoji: '🐷', scale: 3.3, offsetY: 35 },

    // 4-letter words
    { word: 'FISH', emoji: '🐟', scale: 3, offsetY: 5 },
    { word: 'GOAT', emoji: '🐐', scale: 2.64, offsetY: 5 },

    // 5-letter words
    { word: 'SHEEP', emoji: '🐑', scale: 4.68, offsetY: 63 },
    { word: 'SNAKE', emoji: '🐍', scale: 2.4, offsetY: 5 }
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
