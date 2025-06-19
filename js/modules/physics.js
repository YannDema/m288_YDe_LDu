export class Player {
    constructor(ctx, physics) {
        this.ctx = ctx;
        this.physics = physics;

        // Position und Bewegung
        this.x = 100;
        this.y = physics.groundLevel;
        this.velocityX = 0;
        this.velocityY = 0;

        // Zustände
        this.onGround = true;
        this.isJumping = false;
        this.isFalling = false;

        // Sprite-Konfiguration
        this.state = 'idle';
        this.width = 48;
        this.height = 48;

        this.spriteMap = {
            idle: 'assets/sprites/player/idle.png',
            run: 'assets/sprites/player/run.png',
            jump: 'assets/sprites/player/jump.png',
            crouch: 'assets/sprites/player/crouch.png',
            crash: 'assets/sprites/player/crash.png',
            down: 'assets/sprites/player/down.png',
        };

        this.sprites = {};
        this.loadSprites();

        this.frameCounter = 0;
    }

    loadSprites() {
        for (const state in this.spriteMap) {
            const img = new Image();
            img.src = this.spriteMap[state];
            this.sprites[state] = img;
        }
    }

    update() {
        // Gravitation anwenden
        this.physics.applyGravity(this);

        // Bewegung aktualisieren (z. B. für Air-Resistance, falls aktiv)
        this.physics.updatePosition(this);
    }

    jump() {
        if (this.physics.jump(this)) {
            this.state = 'jump';
        }
    }

    crouch(active) {
        if (this.onGround) {
            this.state = active ? 'crouch' : 'run';
        }
    }

    crash() {
        this.state = 'crash';
    }

    reset() {
        this.physics.resetPhysics(this);
        this.state = 'idle';
    }

    draw() {
        const sprite = this.sprites[this.state] || this.sprites['idle'];
        this.ctx.drawImage(sprite, this.x, this.y - this.height, this.width, this.height);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y - this.height,
            width: this.width,
            height: this.height
        };
    }
}

