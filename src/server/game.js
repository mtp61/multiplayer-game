// Imports player.js, bullet.js, healthpack.js, ammopack.js, asteroid.js
const Player = require('./player');
const Bullet = require('./bullet');
const Healthpack = require('./healthpack');
const Ammopack = require('./ammopack');
const Asteroid = require('./asteroid');

// Imports constants.js
const Constants = require('../shared/constants');

class Game {
    // Constructs initial game setup
    constructor() {
        this.sockets = {};
        this.players = {};
        this.bullets = [];
        this.healthpacks = [];
        this.asteroids = [];
        this.ammopacks = [];

        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        setInterval(this.update.bind(this), 1000 / 60);
    }

    // Adds a Player to the Game
    addPlayer(socket, username) {
        // Adds new socket to this Game's sockets dictionary
        this.sockets[socket.id] = socket;

        // need to make sure it doesn't hit any asteroids
        let hits_asteroid, testX, testY;
            do {
                hits_asteroid = false; // need to make player not hitting any asteroids
                testX = Math.floor(Math.random() * (Constants.MAP.MAX_X - Constants.MAP.MIN_X)) + Constants.MAP.MIN_X // generate random locations
                testY = Math.floor(Math.random() * (Constants.MAP.MAX_Y - Constants.MAP.MIN_Y)) + Constants.MAP.MIN_Y
                // loop thru asteroid
                for (let j = 0; j < this.asteroids.length; j++) { 
                    let asteroidX = this.asteroids[j].x;
                    let asteroidY = this.asteroids[j].y;
                    if (Math.sqrt(Math.pow(asteroidX - testX, 2) + Math.pow(asteroidY - testY, 2)) <
                    2 * (this.asteroids[j].radius + Constants.PLAYER_RADIUS)) {
                        hits_asteroid = true;
                        break;
                    }
                }
            }
            while (hits_asteroid)

        // Adds new Plyaer to this Game's players dictionary
        this.players[socket.id] = new Player(
            testX,
            testY,
            socket.id, username);
    }

    // Removes socket (and associated player) from the Game
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
        // loop thru healthpacks
        for (let i = 0; i < this.healthpacks.length; i++) {
            // loop thru players
            for (let j = 0; j < Object.keys(this.sockets).length; j++) {
                if (this.players[Object.keys(this.sockets)[j]].checkCollision(this.healthpacks[i])) {
                    if (this.players[Object.keys(this.sockets)[j]].hp + Constants.HEALTHPACK_HEALTH <= 100) {
                        this.players[Object.keys(this.sockets)[j]].hp += Constants.HEALTHPACK_HEALTH;
                        this.healthpacks.splice(i, 1); // destroy healthpack
                        break;
                    }
                }
            }
        }

        //update ammopacks
        while (this.ammopacks.length < Constants.NUM_AMMOPACKS) { // while need hps
            // make healthpack
            this.ammopacks.push(new Ammopack(
                Math.floor(Math.random() * (Constants.MAP.MAX_X - Constants.MAP.MIN_X)) + Constants.MAP.MIN_X, // generate random locations
                Math.floor(Math.random() * (Constants.MAP.MAX_Y - Constants.MAP.MIN_Y)) + Constants.MAP.MIN_Y
            ))
        }
        for (let i = 0; i < this.ammopacks.length; i++) { // loop thru ammopacks
            for (let j = 0; j < Object.keys(this.sockets).length; j++) { // loop thru players
                if (this.players[Object.keys(this.sockets)[j]].checkCollision(this.ammopacks[i])) {
                    if (this.players[Object.keys(this.sockets)[j]].ammo + Constants.AMMOPACK_CONTENT <= Constants.MAX_AMMO + Constants.AMMOPACK_CONTENT - 1) {
                        this.players[Object.keys(this.sockets)[j]].ammo = Math.min(Constants.AMMOPACK_CONTENT + this.players[Object.keys(this.sockets)[j]].ammo, Constants.MAX_AMMO);
                        this.ammopacks.splice(i, 1); // destroy ammopack
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
        }
        for (let i = 0; i < this.bullets.length; i++) {
            for (let j = 0; j < Object.keys(this.sockets).length; j++) { // loop thru players
                if (this.players[Object.keys(this.sockets)[j]].checkCollision(this.bullets[i])) { // if hits player
                    // update player hp
                    this.players[Object.keys(this.sockets)[j]].hp -= Constants.BULLET_DAMAGE;
                    // update player score if kill
                    if (this.players[Object.keys(this.sockets)[j]].hp <= 0) {
                        this.players[this.bullets[i].id].add_score(Constants.KILL_SCORE);
                    }
                    this.bullets.splice(i, 1); // destroy bullet
                    break;
                }
            }
        }
        for (let i = 0; i < this.bullets.length; i++) { // loop thru bullets
            for (let j = 0; j < this.asteroids.length; j++) { // loop thru asteroids
                if (this.asteroids[j].distanceTo(this.bullets[i]) < .8 * (this.asteroids[j].radius + Constants.BULLET_RADIUS)) {
                    // update asteroid
                    this.asteroids[j].hp -= Constants.BULLET_DAMAGE;
                    if (this.asteroids[j].hp <= 0) { // if ded
                        switch (this.asteroids[j].radius) {
                            case Constants.BIG_ASTEROID_RADIUS:
                                this.players[this.bullets[i].id].score += Constants.BIG_ASTEROID_SCORE; // update score
                                for (let k = 0; k < 3; k++) { // make new smaller asteroids
                                    this.asteroids.push(new Asteroid(
                                        Math.floor(Math.random() * 20 - 20/2 + this.asteroids[j].x),
                                        Math.floor(Math.random() * 20 - 20/2 + this.asteroids[j].y),
                                        Constants.MEDIUM_ASTEROID_RADIUS,
                                        Constants.MEDIUM_ASTEROID_VELOCITY,
                                        (k-1) * (Math.random() * (2*Math.PI/6) - (2*Math.PI/6/2)) + this.asteroids[j].direction,
                                        Constants.MEDIUM_ASTEROID_HP
                                    ));
                                }
                                this.asteroids.splice(j, 1); // destroy old asteroid
                                break;
                            case Constants.MEDIUM_ASTEROID_RADIUS:
                                this.players[this.bullets[i].id].score += Constants.MEDIUM_ASTEROID_SCORE; // update score
                                for (let k = 0; k < 3; k++) { // make new smaller asteroids
                                    this.asteroids.push(new Asteroid(
                                        Math.floor(Math.random() * 20 - 20/2 + this.asteroids[j].x),
                                        Math.floor(Math.random() * 20 - 20/2 + this.asteroids[j].y),
                                        Constants.SMALL_ASTEROID_RADIUS,
                                        Constants.SMALL_ASTEROID_VELOCITY,
                                        (k-1) * (Math.random() * (2*Math.PI/6) - (2*Math.PI/6/2)) + this.asteroids[j].direction,
                                        Constants.SMALL_ASTEROID_HP
                                    ));
                                }
                                this.asteroids.splice(j, 1); // destroy old asteroid
                                break;
                            case Constants.SMALL_ASTEROID_RADIUS:
                                this.players[this.bullets[i].id].score += Constants.SMALL_ASTEROID_SCORE; // update score
                                this.asteroids.splice(j, 1); // destroy old asteroid
                                break;
                        }
                    }

                    this.bullets.splice(i, 1); // destroy bullet
                    break;
                }
            }
        }

        // update asteroids
        let numBigAsteroids = 0;
        for (let i = 0; i < this.asteroids.length; i++) {
            if (this.asteroids[i].radius == Constants.BIG_ASTEROID_RADIUS) {
                numBigAsteroids++;
            }
        }
        for (let i = numBigAsteroids; i < Constants.NUM_BIG_ASTEROIDS; i++) { // new asteroids
            let hits_player, testX, testY;
            do {
                hits_player = false; // need to make asteroid not hitting any players
                testX = Math.floor(Math.random() * (Constants.MAP.MAX_X - Constants.MAP.MIN_X)) + Constants.MAP.MIN_X // generate random locations
                testY = Math.floor(Math.random() * (Constants.MAP.MAX_Y - Constants.MAP.MIN_Y)) + Constants.MAP.MIN_Y
                for (let j = 0; j < Object.keys(this.sockets).length; j++) { // loop thru players
                    let playerX = this.players[Object.keys(this.sockets)[j]].x;
                    let playerY = this.players[Object.keys(this.sockets)[j]].y;
                    if (Math.sqrt(Math.pow(playerX - testX, 2) + Math.pow(playerY - testY, 2)) <
                    2 * (Constants.BIG_ASTEROID_RADIUS + Constants.PLAYER_RADIUS)) {
                        hits_player = true;
                        break;
                    }
                }
            }
            while (hits_player)

            this.asteroids.push(new Asteroid(testX,
                testY,
                Constants.BIG_ASTEROID_RADIUS,
                Constants.BIG_ASTEROID_VELOCITY,
                Math.floor(Math.random() * 2 * Math.PI),
                Constants.BIG_ASTEROID_HP)); // make asteroid
        }
        for (let i = 0; i < this.asteroids.length; i++) { // loop thru asteroids
            this.asteroids[i].update(dt);
            if (this.asteroids[i].x < Constants.MAP.MIN_X ||
                this.asteroids[i].x > Constants.MAP.MAX_X ||
                this.asteroids[i].y < Constants.MAP.MIN_Y ||
                this.asteroids[i].y > Constants.MAP.MAX_Y) { // check if in bounds
                this.asteroids.splice(i, 1); // delete asteroid
                continue;
            }

            for (let j = 0; j < Object.keys(this.sockets).length; j++) { // loop thru players
                if (this.players[Object.keys(this.sockets)[j]].checkCollision(this.asteroids[i])) {
                    switch (this.asteroids[i].radius) { // see which type of asteroid, update player hp
                        case Constants.BIG_ASTEROID_RADIUS:
                            this.players[Object.keys(this.sockets)[j]].hp -= Constants.BIG_ASTEROID_DAMAGE;
                            break;
                        case Constants.MEDIUM_ASTEROID_RADIUS:
                            this.players[Object.keys(this.sockets)[j]].hp -= Constants.MEDIUM_ASTEROID_DAMAGE;
                            break;
                        case Constants.SMALL_ASTEROID_RADIUS:
                            this.players[Object.keys(this.sockets)[j]].hp -= Constants.SMALL_ASTEROID_DAMAGE;
                            break;
                    }
                    this.asteroids.splice(i, 1); // destroy asteroid
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

    // Handles this Player's (from associated socket) input
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

    // Returns the current Game leaderboard
    getLeaderboard() {
      return Object.values(this.players)
        .sort((p1, p2) => p2.score - p1.score)
        .slice(0, 5)
        .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

    // Returns update information for the Game
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
            ammopacks: this.ammopacks.map(h => h.serializeForUpdate()),
            asteroids: this.asteroids.map(a => a.serializeForUpdate()),
            leaderboard
        };
    }
}

module.exports = Game;
