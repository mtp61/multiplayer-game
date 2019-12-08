// Super class for all objects in the game (Asteroid, Bullet, Healthpack, Player)

class Object {
    // Object's constructor
    constructor(id, x, y, direction, v_x, v_y, radius) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.v_x = v_x;
        this.v_y = v_y;
        this.radius = radius;
    }

    // Updates this Object's position based on time interval delta t (dt)
    update(dt) {
        this.x += dt * this.v_x;
        this.y += dt * this.v_y;
    }

    // Accelerates this Object
    accelerate(accel) {
        this.v_x += accel * Math.cos(this.direction);
        this.v_y += accel * Math.sin(this.direction);
    }

    // Calculates distance between this Object and the Object object
    distanceTo(object) {
        let dx = this.x - object.x;
        let dy = this.y - object.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Sets the direction of the movement of the Object
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

// Exports Object class
module.exports = Object;
