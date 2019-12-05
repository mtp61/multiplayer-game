const ObjectClass = require('./object');

const Constants = require('../shared/constants');

class Bullet extends ObjectClass {
    constructor(id, x, y, direction, v_x, v_y) {
        super(id, x, y, direction, v_x, v_y, Constants.BULLET_RADIUS);
        
        super.accelerate(Constants.BULLET_VELOCITY);
    }

    update(dt) {
        super.update(dt);
    }

    serializeForUpdate() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            direction: this.direction
        };
    }
}

module.exports = Bullet;