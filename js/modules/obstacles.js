export class Obstacles {
    constructor(ctx, physics, canvasWidth) {
        this.ctx = ctx;
        this.physics = physics;
        this.canvasWidth = canvasWidth;

        this.obstacles = [];

        this.spriteMap = {
            hydrant: {
                src: 'assets\images\obstacles\fire-hydrant.png',
                width: 40,
                height: 60,
                yOffset: 0
            },
            bottle: {
                src: 'assets\images\obstacles\bottle.png',
                width: 32,
                height: 32,
                yOffset: 80 // schwebt über Boden
            }
        };

        this.sprites = {};
        this.loadSprites();
    }

    loadSprites() {
        for (const key in this.spriteMap) {
            const img = new Image();
            img.src = this.spriteMap[key].src;
            this.sprites[key] = img;
        }
    }

    spawnRandomObstacle() {
        const types = Object.keys(this.spriteMap);
        const randomType = types[Math.floor(Math.random() * types.length)];
        this.spawnObstacle(randomType);
    }

    spawnObstacle(type) {
        const def = this.spriteMap[type];

        const obstacle = {
            type: type,
            x: this.canvasWidth + 20,
            y: this.physics.groundLevel - def.height - def.yOffset,
            width: def.width,
            height: def.height,
            velocityX: -6
        };

        this.obstacles.push(obstacle);
    }

    update() {
        this.obstacles.forEach(obstacle => {
            this.physics.updatePosition(obstacle);
        });

        // Entferne Hindernisse, die vom Bildschirm sind
        this.obstacles = this.obstacles.filter(
            obstacle => !this.physics.isOffScreen(obstacle, this.canvasWidth)
        );
    }

    draw() {
        this.obstacles.forEach(obstacle => {
            const sprite = this.sprites[obstacle.type];
            this.ctx.drawImage(sprite, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    checkCollision(player) {
        const playerBox = player.getBounds();

        return this.obstacles.some(obstacle => {
            return this.physics.checkCollision(playerBox, obstacle);
        });
    }

    reset() {
        this.obstacles = [];
    }
}
