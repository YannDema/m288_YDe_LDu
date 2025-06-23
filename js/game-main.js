// game-main.js
import { GameEngine } from '/js/modules/game-engine.js';
import { UIManager } from '/js/modules/ui-manager.js';
import { Physics } from '/js/modules/physics.js';

// Wichtige DOM-Elemente
const canvas = document.getElementById('game-canvas');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// UI & Physics & Engine Instanz erzeugen
const uiManager = new UIManager('score-display', 'game-over-modal');
const physics = new Physics();
const game = new GameEngine(canvas, physics, uiManager);

// Events für Start & Restart
startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    game.start();
    uiManager.bindEvents(game.score);
});

if (restartButton) {
    restartButton.addEventListener('click', () => {
        location.reload();
    });
}

// Tasteneingaben für Sprung & Ducken
window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'Space':
            event.preventDefault();
            game.jumpPlayer();
            break;
        case 'ArrowDown':
            game.crouchPlayer(true);
            break;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowDown') {
        game.crouchPlayer(false);
    }
});
