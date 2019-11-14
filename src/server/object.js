class Object {
    constructor(id, x, y, dir, vel) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = dir;
        this.vel = vel;
    }
  
    update(dt) {
        this.x += dt * this.vel * Math.sin(this.direction);
        this.y -= dt * this.vel * Math.cos(this.direction);
    }
  
    /*setDirection(dir) {
      this.direction = dir;
    }*/
  
    serializeForUpdate() {
        return {
            id: this.id,
            x: this.x,
            y: this.y
        };
    }
}
  
module.exports = Object;
  