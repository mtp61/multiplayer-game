const ObjectClass = require('./object');

const Constants = require('../shared/constants');

class Player extends ObjectClass {
    constructor(id, username, x, y) {
        super(id, x, y, 0, 0, 0, Constants.PLAYER_RADIUS);

        this.hp = 100;
        this.gunDelay = 0;
        this.username = username;
        this.score = 0;
    }

    add_score(to_add) {
        this.score += to_add;
    }

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

    canFire() {
        if (this.gunDelay == 0) {
            return true;
        } else {
            return false;
        }
    }

    checkCollision(object) {
        if (this.id != object.id &&
            super.distanceTo(object) < this.radius/2 + object.radius/2) {
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
            hp: this.hp
        };
    }
}

module.exports = Player;
