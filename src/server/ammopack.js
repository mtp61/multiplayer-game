// Imports object.js
const ObjectClass = require('./object');

// Imports constants.js
const Constants = require('../shared/constants');

// Healthpack is a subclass of the class Object as written in object.js
class Ammopack extends ObjectClass {
    constructor(x, y) {
        super('ammopack', x, y, 0, 0, 0, Constants.AMMOPACK_RADIUS);
    }

    serializeForUpdate() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
        };
    }
}

// Exports Bullet class
module.exports = Ammopack;
