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
            idle: '/assets/images/sprites/standing.png',
            run: '/assets/images/sprites/running.png',
            jump: '/assets/images/sprites/jumping.png',
            crouch: '/assets/images/sprites/ducking.png',
            crash: '/assets/images/sprites/falling.png',
            down: '/assets/images/sprites/lying.png',
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
        this.physics.update(this);
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
        // this.physics.resetPhysics(this);
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
