const ObjectClass = require('./object');

const Constants = require('../shared/constants');

class Asteroid extends ObjectClass {
    constructor(x, y, radius, velocity, direction, hp, type) {
        super('asteroid', 
        x,
        y,
        direction, 
        0, 0, 
        radius);

        this.hp = hp;

        this.type = Math.random();

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
            radius: this.radius,
            type: this.type
        };
    }
}

module.exports = Asteroid;