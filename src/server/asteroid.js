const ObjectClass = require('./object');

const Constants = require('../shared/constants');

class Asteroid extends ObjectClass {
    constructor(x, y, radius, velocity, direction, hp) {
        super('asteroid', 
        x,
        y,
        direction, 
        0, 0, 
        radius);

        this.hp = hp;

        super.accelerate(velocity);
    }
    
    update(dt) {
        super.update(dt);
    }

    serializeForUpdate() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            direction: this.direction,
            radius: this.radius
        };
    }
}

module.exports = Asteroid;