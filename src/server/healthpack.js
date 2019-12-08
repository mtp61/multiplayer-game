// Imports object.js
const ObjectClass = require('./object');

// Imports constants.js
const Constants = require('../shared/constants');

// Healthpack is a subclass of the class Object as written in object.js
class Healthpack extends ObjectClass {
    constructor(x, y) {
        super('healthpack', x, y, 0, 0, 0, Constants.HEALTHPACK_RADIUS);
    }

    serializeForUpdate() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
        };
    }
}

module.exports = Healthpack;
