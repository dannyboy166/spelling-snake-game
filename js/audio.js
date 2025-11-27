/**
 * AUDIO MANAGER
 * Web Audio API sound effects for the game
 * No external audio files needed!
 */

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.bgMusicSource = null;
        this.bgMusicBuffer = null;
        this.bgMusicGain = null;
    }

    /**
     * Initialize audio context (must be called after user interaction)
     */
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    /**
     * Start background music (using Web Audio API for seamless looping)
     */
    async startBackgroundMusic() {
        if (this.bgMusicSource) return; // Already playing
        if (!this.audioContext) this.init();

        try {
            const response = await fetch('assets/audio/background-music.wav');
            const arrayBuffer = await response.arrayBuffer();
            this.bgMusicBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            this.bgMusicSource = this.audioContext.createBufferSource();
            this.bgMusicSource.buffer = this.bgMusicBuffer;
            this.bgMusicSource.loop = true;

            this.bgMusicGain = this.audioContext.createGain();
            this.bgMusicGain.gain.value = 0.3;

            this.bgMusicSource.connect(this.bgMusicGain);
            this.bgMusicGain.connect(this.audioContext.destination);

            this.bgMusicSource.start(0);
        } catch (e) {
            console.log('Background music failed:', e);
        }
    }

    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        if (this.bgMusicSource) {
            this.bgMusicSource.stop();
            this.bgMusicSource = null;
        }
    }

    /**
     * Play a tone with specified parameters
     */
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        // Envelope for smoother sound
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    /**
     * Play when snake eats correct letter
     */
    playCorrectLetter() {
        this.playTone(523.25, 0.15, 'sine', 0.4);  // C5
        setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.4), 100);  // E5
    }

    /**
     * Play when snake eats wrong letter (optional mild feedback)
     */
    playWrongLetter() {
        this.playTone(200, 0.2, 'triangle', 0.2);
    }

    /**
     * Play when word is completed - happy jingle!
     */
    playWordComplete() {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.25, 'sine', 0.35), i * 120);
        });
    }

    /**
     * Play game over sound
     */
    playGameOver() {
        this.playTone(300, 0.3, 'sawtooth', 0.25);
        setTimeout(() => this.playTone(200, 0.4, 'sawtooth', 0.2), 200);
        setTimeout(() => this.playTone(150, 0.5, 'sawtooth', 0.15), 400);
    }

    /**
     * Play snake movement sound (subtle)
     */
    playMove() {
        this.playTone(150, 0.05, 'sine', 0.05);
    }

    /**
     * Play game start sound
     */
    playStart() {
        this.playTone(440, 0.1, 'sine', 0.3);
        setTimeout(() => this.playTone(550, 0.1, 'sine', 0.3), 100);
        setTimeout(() => this.playTone(660, 0.15, 'sine', 0.3), 200);
    }

    /**
     * Toggle sound on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Global audio instance
const audioManager = new AudioManager();
