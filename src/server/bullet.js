const ObjectClass = require('./object');

class Bullet extends ObjectClass {
    constructor(id, x, y, direction, v_x, v_y) {
        super(id, x, y, direction, v_x, v_y);

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