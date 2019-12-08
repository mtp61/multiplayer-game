// Imports object.js
const ObjectClass = require('./object');

// Imports constants.js
const Constants = require('../shared/constants');

// Asteroid is a subclass of the class Object as written in object.js
class Asteroid extends ObjectClass {
    constructor(x, y, radius, velocity, direction, hp, type) {
        super('asteroid',
        x,
        y,
        direction,
        0, 0,
        radius);

        // Sets the Asteroid's health points (hp) the value of hp
        this.hp = hp;

        this.type = Math.random();

        // Calls Object's accelerate function
        super.accelerate(velocity);
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
            direction: this.direction,
            radius: this.radius,
            type: this.type
        };
    }
}

// Exports Asteroid class
module.exports = Asteroid;
