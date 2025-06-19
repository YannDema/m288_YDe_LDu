import { GameEngine } from './modules/game-engine.js';
import { UIManager } from './modules/ui-manager.js';
import { Physics } from './modules/physics.js';

const canvas = document.getElementById('game-canvas');
const uiManager = new UIManager('score-display', 'game-over-modal');
const physics = new Physics();
const game = new GameEngine(canvas, physics, uiManager);

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        game.jumpPlayer();
    }
    if (event.code === 'ArrowDown') {
        game.crouchPlayer(true);
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowDown') {
        game.crouchPlayer(false);
    }
});

// Modal-Events binden
uiManager.bindEvents(game.score);

game.start();
