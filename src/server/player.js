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
}
  
module.exports = Player;