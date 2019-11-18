const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../../webpack.dev.js');

const socketio = require('socket.io');

const Constants = require('../shared/constants');

// Setup an Express server
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
    // Setup Webpack for development
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler));
} else {
    // Static serve the dist/ folder in production
    app.use(express.static('dist'));
}

// Listen on port 3000
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on('connection', socket => {
    console.log('Player connected:', socket.id);

    socket.on(Constants.MSG.GAME_JOIN, joinGame);
    socket.on(Constants.MSG.INPUT, handleInput);
    
    socket.on('disconnect', onDisconnect);
});

const Game = require('./game');

// Setup the Game
const game = new Game();

function handleInput(input) {
    game.handleInput(this, input);
}

function joinGame() {
    game.addPlayer(this);
}

function onDisconnect() {
    console.log('Player disconnected:', this.id);

    game.removePlayer(this);
}
