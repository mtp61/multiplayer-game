const Player = require('./player');
const Bullet = require('./bullet');
const Healthpack = require('./healthpack');

const Constants = require('../shared/constants');

class Game {
    constructor() {
        this.sockets = {};
        this.players = {};
        this.bullets = [];
        this.healthpacks = [];
        

        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        setInterval(this.update.bind(this), 1000 / 60);
    }

    addPlayer(socket, username) {
        this.sockets[socket.id] = socket;

        this.players[socket.id] = new Player(socket.id, username, 200, 200);
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
        
        // update healthpacks
        while (this.healthpacks.length < Constants.NUM_HEALTHPACKS) { // while need hps
            // make healthpack
            this.healthpacks.push(new Healthpack(
                Math.floor(Math.random() * (Constants.MAP.MAX_X - Constants.MAP.MIN_X)) + Constants.MAP.MIN_X, // generate random locations
                Math.floor(Math.random() * (Constants.MAP.MAX_Y - Constants.MAP.MIN_Y)) + Constants.MAP.MIN_Y
            ))
        }
        for (let i = 0; i < this.healthpacks.length; i++) { // loop thru healthpacks
            for (let j = 0; j < Object.keys(this.sockets).length; j++) { // loop thru players
                if (this.players[Object.keys(this.sockets)[j]].checkCollision(this.healthpacks[i])) {
                    if (this.players[Object.keys(this.sockets)[j]].hp + Constants.HEALTHPACK_HEALTH <= 100) {
                        this.players[Object.keys(this.sockets)[j]].hp += Constants.HEALTHPACK_HEALTH;
                        this.healthpacks.splice(i, 1); // destroy healthpack
                        break;
                    }
                }
            }
        }

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
                    // update player hp
                    this.players[Object.keys(this.sockets)[j]].hp -= 10;
                    // update player score if kill
                    if (this.players[Object.keys(this.sockets)[j]].hp <= 0) {
                        this.players[this.bullets[i].id].add_score(Constants.KILL_SCORE);
                    }
                    this.bullets.splice(i, 1); // destroy bullet
                    break;
                }
            }
        }
        
        // Check if any players are dead
        Object.keys(this.sockets).forEach(playerID => {
            const socket = this.sockets[playerID];
            const player = this.players[playerID];
            if (player.hp <= 0) {
                socket.emit(Constants.MSG.GAME_OVER);
                this.removePlayer(socket);
            }
        });

        // Send a game update to each player every other time
        if (this.shouldSendUpdate) {
            const leaderboard = this.getLeaderboard();
            Object.keys(this.sockets).forEach(playerID => {
                const socket = this.sockets[playerID];
                const player = this.players[playerID];
                socket.emit(Constants.MSG.GAME_UPDATE, this.createUpdate(player, leaderboard));
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

    getLeaderboard() {
      return Object.values(this.players)
        .sort((p1, p2) => p2.score - p1.score)
        .slice(0, 5)
        .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

    createUpdate(player, leaderboard) {
        const otherPlayers = Object.values(this.players).filter(
            p => p !== player
        );

        return {
            t: Date.now(),
            me: player.serializeForUpdate(),
            others: otherPlayers.map(p => p.serializeForUpdate()),
            bullets: this.bullets.map(b => b.serializeForUpdate()),
            healthpacks: this.healthpacks.map(h => h.serializeForUpdate()),
            leaderboard
        };
    }
}

module.exports = Game;
