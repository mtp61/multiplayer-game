const Player = require('./player');

const Constants = require('../shared/constants');

class Game {
    constructor() {
        this.sockets = {};
        this.players = {};

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

    handleInput(socket, [direction, acceleration]) {
        if (this.players[socket.id]) {
            this.players[socket.id].setDirection(direction);
            this.players[socket.id].accelerate(acceleration);
        }
    }

    createUpdate(player) {
        const otherPlayers = Object.values(this.players).filter(
            p => p !== player
        );

        return {
            t: Date.now(),
            me: player.serializeForUpdate(),
            others: otherPlayers.map(p => p.serializeForUpdate())
        };
    }
}

module.exports = Game;
