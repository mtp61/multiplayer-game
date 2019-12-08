// Imports object.js
const ObjectClass = require('./object');

// Imports constants.js
const Constants = require('../shared/constants');

// Player is a subclass of Object
class Player extends ObjectClass {
    constructor(x, y, id, username) {
        super(id,
            x,
            y,
            0, 0, 0,
            Constants.PLAYER_RADIUS);

        this.hp = 100;
        this.ammo = Constants.MAX_AMMO;
        this.gunDelay = 0;
        this.username = username;
        this.score = 0;
    }

    // Adds to_add to this Player's score
    add_score(to_add) {
        this.score += to_add;
    }

    // Updates this Player's position
    update(dt) {
        super.update(dt);

        if (this.gunDelay > 0) {
            this.gunDelay--;
        }

        // apply deceleration
        this.v_x *= Constants.DECELERATION;
        this.v_y *= Constants.DECELERATION;

        // check if in bounds, adjust if needed
        if (this.x < Constants.MAP.MIN_X) {
            this.x = Constants.MAP.MIN_X;
            this.v_x = 0;
        } else if (this.x > Constants.MAP.MAX_X) {
            this.x = Constants.MAP.MAX_X;
            this.v_x = 0;
        }
        if (this.y < Constants.MAP.MIN_Y) {
            this.y = Constants.MAP.MIN_Y;
            this.v_y = 0;
        } else if (this.y > Constants.MAP.MAX_Y) {
            this.y = Constants.MAP.MAX_Y;
            this.v_y = 0;
        }
    }

    // Checks if this Player has the ability to fire
    canFire() {
        if (this.gunDelay == 0 && this.ammo > 0) {
            this.ammo -= 1;
            return true;
        } else {
            return false;
        }
    }


    // Checks if this Player has collided with another Object
    checkCollision(object) {
        // don't collide unless overlapping
        if (this.id != object.id &&
            super.distanceTo(object) < .8 * (this.radius + object.radius)) {
            return true;
        }
        return false;
    }

    resetGunDelay() {
        this.gunDelay = 10;
    }

    serializeForUpdate() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            direction: this.direction,
            hp: this.hp,
            ammo: this.ammo,
            username: this.username
        };
    }

    serializeForBullet() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            v_x: this.v_x,
            v_y: this.v_y,
            direction: this.direction,
            hp: this.hp,
            ammo: this.ammo
        };
    }
}

module.exports = Player;
