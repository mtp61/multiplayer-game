const ObjectClass = require('./object');

class Bullet extends ObjectClass {
    constructor(id, x, y, direction) {
        super(id, x, y, direction, 0, 0);

        super.accelerate(500);
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