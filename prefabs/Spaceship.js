// Space Prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;

        // Taken from: https://stackoverflow.com/questions/45136711/javascript-random-generate-0-or-1-integer
        this.direction = (Math.random()>=0.5)? -1 : 1;

        // Flip sprite horizontally if the ship moves to the left
        if (this.direction == -1) {
            this.setFlipX(true);
        }
    }
    
    update () {
        // move spaceship in the intended direction
        this.x -= this.moveSpeed * this.direction;

        // wrap from left edge to right edge
        if (this.direction == 1) {
            if (this.x <= 0 - this.width) {
                this.x = game.config.width;
            }
        }
        // Wrap from right edge to left edge
        else {
            if (this.x >= game.config.width + this.width) {
                this.x = 0 - this.width;
            }
        }
    }

    reset () {
        this.x = game.config.width;
    }
}