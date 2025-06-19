import { Player } from './player.js';
import { Obstacles } from './obstacles.js';

export class GameEngine {
    constructor(canvas, physics, uiManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.physics = physics;
        this.ui = uiManager;

        // Game Objects
        this.player = new Player(this.ctx, this.physics);
        this.obstacles = new Obstacles(this.ctx, this.physics, canvas.width);

        // Game State
        this.score = 0;
        this.running = false;

        // Bindings
        this.loop = this.loop.bind(this);
        this.spawnRate = 2000;
    }

    start() {
        this.reset();
        this.running = true;
        this.spawnTimer = setInterval(() => {
            this.obstacles.spawnRandomObstacle();
        }, this.spawnRate);
        requestAnimationFrame(this.loop);
    }

    stop() {
        this.running = false;
        clearInterval(this.spawnTimer);
    }

    reset() {
        this.score = 0;
        this.player.reset();
        this.obstacles.reset();
    }

    loop() {
        if (!this.running) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and Draw Game Elements
        this.player.update();
        this.player.draw();

        this.obstacles.update();
        this.obstacles.draw();

        // Update Score
        this.score++;
        this.ui.updateScore(this.score);

        // Collision Detection
        if (this.obstacles.checkCollision(this.player)) {
            this.player.crash();
            this.ui.showGameOver(this.score);
            this.stop();
            return;
        }

        requestAnimationFrame(this.loop);
    }

    jumpPlayer() {
        this.player.jump();
    }

    crouchPlayer(active) {
        this.player.crouch(active);
    }
}
