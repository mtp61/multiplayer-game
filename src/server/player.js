const ObjectClass = require('./object');

class Player extends ObjectClass {
    constructor(id, x, y) {
        super(id, x, y, 0, 0);
    }
  
    update(dt) {
        super.update(dt);
    }
  
    serializeForUpdate() { // old code may have worked
        var obj_ser = super.serializeForUpdate(); 
        return {
            id: obj_ser.id,
            x: obj_ser.x,
            y: obj_ser.y,
            direction: this.direction
        };
    }
}
  
module.exports = Player;