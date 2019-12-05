const ObjectClass = require('./object');

const Constants = require('../shared/constants');

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