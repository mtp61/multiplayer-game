const ObjectClass = require('./object');

const Constants = require('../shared/constants');

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

module.exports = Ammopack;