const ObjectClass = require('./object');

class Player extends ObjectClass {
    constructor(id, x, y) {
        super(id, x, y, 0, 0, 0);

        this.hp = 100;

        this.gunDelay = 0;
    }
  
    update(dt) {
        super.update(dt);

        if (this.gunDelay > 0) {
            this.gunDelay--;
        }
    }
    
    canFire() {
        if (this.gunDelay == 0) {
            return true;
        } else {
            return false;
        }
    }

    checkCollision(bullet) {
        if (this.id != bullet.id && 
            super.distanceTo(bullet) < 30/2 + 20/2) {
            this.hp -= 10;
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
            hp: this.hp
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