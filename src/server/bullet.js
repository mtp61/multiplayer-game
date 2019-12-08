// Imports object.js
const ObjectClass = require('./object');

// Imports constants.js
const Constants = require('../shared/constants');

// Bullet is a subclass of the class Object as written in object.js
class Bullet extends ObjectClass {
    constructor(id, x, y, direction, v_x, v_y) {
        super(id, x, y, direction, v_x, v_y, Constants.BULLET_RADIUS);

        super.accelerate(Constants.BULLET_VELOCITY);
    }

    // Updates this Asteroid's position
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

// Exports Bullet class
module.exports = Bullet;
