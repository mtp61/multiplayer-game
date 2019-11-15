class Object {
    constructor(id, x, y, direction, v_x, v_y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.v_x = v_x;
        this.v_y = v_y;
    }
  
    update(dt) {
        this.x += dt * this.v_x;
        this.y += dt * this.v_y;
    }

    accelerate(accel) {
        this.v_x += accel * Math.cos(this.direction);
        this.v_y += accel * Math.sin(this.direction);
    }
  
    setDirection(dir) {
        this.direction += dir;
    }
  
    serializeForUpdate() {
        return {
            id: this.id,
            x: this.x,
            y: this.y
        };
    }
}
  
module.exports = Object;
  