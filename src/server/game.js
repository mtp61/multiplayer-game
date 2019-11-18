const Player = require('./player');
const Bullet = require('./bullet');

const Constants = require('../shared/constants');

class Game {
    constructor() {
        this.sockets = {};
        this.players = {};
        this.bullets = [];

        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        setInterval(this.update.bind(this), 1000 / 60);
    }

    addPlayer(socket) {
        this.sockets[socket.id] = socket;
    
        this.players[socket.id] = new Player(socket.id, 200, 200);
    }
    
    removePlayer(socket) {
        delete this.sockets[socket.id];
        delete this.players[socket.id];
    }

    update() {
        // Calculate time elapsed
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        // update each player
        Object.keys(this.sockets).forEach(playerID => {
            const player = this.players[playerID];
            player.update(dt);
        });

        // update bullets
        for (let i = 0; i < this.bullets.length; i++) { // loop thru bullets
            this.bullets[i].update(dt);
            if (this.bullets[i].x < Constants.MAP.MIN_X ||
                this.bullets[i].x > Constants.MAP.MAX_X ||
                this.bullets[i].y < Constants.MAP.MIN_Y ||
                this.bullets[i].y > Constants.MAP.MAX_Y) { // check if in bounds
                this.bullets.splice(i, 1);
                continue;
            }
            
            for (let j = 0; j < Object.keys(this.sockets).length; j++) { // loop thru players
                if (this.players[Object.keys(this.sockets)[j]].checkCollision(this.bullets[i])) {
                    this.bullets.splice(i, 1);
                    break;
                }
            }
        } 

        // Send a game update to each player every other time
        if (this.shouldSendUpdate) {
            Object.keys(this.sockets).forEach(playerID => {
                const socket = this.sockets[playerID];
                const player = this.players[playerID];
                socket.emit(Constants.MSG.GAME_UPDATE, this.createUpdate(player));
            });
            this.shouldSendUpdate = false;
        } else {
            this.shouldSendUpdate = true;
        }
    }

    newBullet(player) {
        this.bullets.push(new Bullet(player.id, player.x, player.y, player.direction, player.v_x, player.v_y));
    }

    handleInput(socket, input) {
        if (this.players[socket.id]) {
            this.players[socket.id].setDirection(input.rotation);
            this.players[socket.id].accelerate(input.throttle);

            if (input.gun && this.players[socket.id].canFire()) {
                this.newBullet(this.players[socket.id].serializeForBullet());
                this.players[socket.id].resetGunDelay();
            }
        }
    }

    createUpdate(player) {
        const otherPlayers = Object.values(this.players).filter(
            p => p !== player
        );

        return {
            t: Date.now(),
            me: player.serializeForUpdate(),
            others: otherPlayers.map(p => p.serializeForUpdate()),
            bullets: this.bullets.map(b => b.serializeForUpdate())
        };
    }
}

module.exports = Game;
