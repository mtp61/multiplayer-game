const ObjectClass = require('./object');

const Constants = require('../shared/constants');

class Bullet extends ObjectClass {
    constructor(id, x, y, direction, v_x, v_y) {
        super(id, x, y, direction, v_x, v_y, Constants.BULLET_RADIUS);

        super.accelerate(1500);
    }

    update(dt) {
        super.update(dt);
    }

    serializeForUpdate() {
        var obj_ser = super.serializeForUpdate(); 
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            direction: this.direction
        };
    }
}

module.exports = Bullet;