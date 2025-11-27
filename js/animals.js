/**
 * ANIMALS DATA
 * List of animals for the spelling game
 * Organized by difficulty (shorter words first)
 */

const ANIMALS = [
    // 3-letter words (easiest)
    { word: 'CAT', emoji: '🐱' },
    { word: 'DOG', emoji: '🐕' },
    { word: 'PIG', emoji: '🐷' },
    { word: 'COW', emoji: '🐄' },
    { word: 'HEN', emoji: '🐔' },
    { word: 'BAT', emoji: '🦇' },
    { word: 'BEE', emoji: '🐝' },
    { word: 'ANT', emoji: '🐜' },
    { word: 'OWL', emoji: '🦉' },
    { word: 'FOX', emoji: '🦊' },

    // 4-letter words
    { word: 'FISH', emoji: '🐟' },
    { word: 'DUCK', emoji: '🦆' },
    { word: 'FROG', emoji: '🐸' },
    { word: 'BEAR', emoji: '🐻' },
    { word: 'LION', emoji: '🦁' },
    { word: 'DEER', emoji: '🦌' },
    { word: 'WOLF', emoji: '🐺' },
    { word: 'GOAT', emoji: '🐐' },
    { word: 'BIRD', emoji: '🐦' },
    { word: 'CRAB', emoji: '🦀' },
    { word: 'SEAL', emoji: '🦭' },

    // 5-letter words
    { word: 'HORSE', emoji: '🐴' },
    { word: 'SHEEP', emoji: '🐑' },
    { word: 'MOUSE', emoji: '🐭' },
    { word: 'SNAKE', emoji: '🐍' },
    { word: 'WHALE', emoji: '🐋' },
    { word: 'SHARK', emoji: '🦈' },
    { word: 'ZEBRA', emoji: '🦓' },
    { word: 'TIGER', emoji: '🐯' },
    { word: 'PANDA', emoji: '🐼' },
    { word: 'KOALA', emoji: '🐨' },
    { word: 'CAMEL', emoji: '🐪' },
    { word: 'BUNNY', emoji: '🐰' },

    // 6-letter words (harder)
    { word: 'MONKEY', emoji: '🐵' },
    { word: 'RABBIT', emoji: '🐇' },
    { word: 'TURTLE', emoji: '🐢' },
    { word: 'PARROT', emoji: '🦜' },
    { word: 'SPIDER', emoji: '🕷️' },
    { word: 'TURKEY', emoji: '🦃' },
    { word: 'WALRUS', emoji: '🦭' },
    { word: 'LIZARD', emoji: '🦎' },

    // 7-letter words (challenging)
    { word: 'DOLPHIN', emoji: '🐬' },
    { word: 'PENGUIN', emoji: '🐧' },
    { word: 'CHICKEN', emoji: '🐔' },
    { word: 'HAMSTER', emoji: '🐹' },
    { word: 'GIRAFFE', emoji: '🦒' },
    { word: 'GORILLA', emoji: '🦍' },
    { word: 'ROOSTER', emoji: '🐓' },

    // 8-letter words (expert)
    { word: 'ELEPHANT', emoji: '🐘' },
    { word: 'KANGAROO', emoji: '🦘' },
    { word: 'HEDGEHOG', emoji: '🦔' },
    { word: 'BUTTERFLY', emoji: '🦋' },
    { word: 'CROCODILE', emoji: '🐊' },
    { word: 'JELLYFISH', emoji: '🪼' },
    { word: 'DRAGONFLY', emoji: '🪰' }
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

    // If all animals used, reset but keep difficulty
    if (available.length === 0) {
        const filtered = ANIMALS.filter(animal => animal.word.length <= maxLength);
        return filtered[Math.floor(Math.random() * filtered.length)];
    }

    return available[Math.floor(Math.random() * available.length)];
}
