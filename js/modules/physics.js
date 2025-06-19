// Physics Engine Module
export class Physics {
    constructor() {
        this.gravity = 0.8;
        this.jumpPower = -15;
        this.maxFallSpeed = 12;
        this.groundLevel = 320; // Canvas height - player height
    }

    // Apply gravity to an object
    applyGravity(object) {
        if (!object.onGround) {
            object.velocityY += this.gravity;
            
            // Limit fall speed
            if (object.velocityY > this.maxFallSpeed) {
                object.velocityY = this.maxFallSpeed;
            }
            
            object.y += object.velocityY;
            
            // Ground collision
            if (object.y >= this.groundLevel) {
                object.y = this.groundLevel;
                object.velocityY = 0;
                object.onGround = true;
                object.isJumping = false;
                object.isFalling = false;
            } else if (object.velocityY > 0) {
                object.isFalling = true;
                object.isJumping = false;
            }
        }
    }

    // Make an object jump
    jump(object) {
        if (object.onGround && !object.isJumping) {
            object.velocityY = this.jumpPower;
            object.onGround = false;
            object.isJumping = true;
            object.isFalling = false;
            return true;
        }
        return false;
    }

    // Check collision between two rectangular objects
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    // Check if object is completely off screen
    isOffScreen(object, canvasWidth) {
        return object.x + object.width < 0;
    }

    // Create smooth easing function for animations
    easeOutQuad(t) {
        return t * (2 - t);
    }

    // Linear interpolation
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Calculate distance between two points
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Normalize velocity vector
    normalize(velocity) {
        const magnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        if (magnitude === 0) return { x: 0, y: 0 };
        
        return {
            x: velocity.x / magnitude,
            y: velocity.y / magnitude
        };
    }

    // Apply air resistance (for more realistic physics)
    applyAirResistance(object, resistance = 0.99) {
        if (!object.onGround) {
            object.velocityX *= resistance;
        }
    }

    // Update object position based on velocity
    updatePosition(object) {
        object.x += object.velocityX || 0;
        object.y += object.velocityY || 0;
    }

    // Reset object physics properties
    resetPhysics(object) {
        object.velocityX = 0;
        object.velocityY = 0;
        object.onGround = true;
        object.isJumping = false;
        object.isFalling = false;
        object.y = this.groundLevel;
    }
}
