Github: https://github.com/mtp61/multiplayer-game

Our project is based on an io game tutorial (https://victorzhou.com/blog/build-an-io-game-part-1/). We used this tutorial to guide the construction of the project as using node.js was new to us and we needed a place to start. Much of the basic structure outlined in this post is used in our project, but the vast majority of the code was written by us. A notable exception was the code for webpack which builds the project which will be discussed later.

The server runs on node.js which was chosen as it makes it relatively simple to set up a web server and uses javascript which the three of us were somewhat familiar with before the project. Webpack, a javascript module bundler, was used because it makes it easy to separate code into multiple files and let us utilize some basic object oriented programming for some parts of the project. The code that launches the server using webpack and the specific npm packages were taken from the previously referenced tutorial because they worked well without us needed to change anything. The same goes for the structure of the server. We didn't know much about how to design a server and the structure provided in the tutorial worked well so we didn't change it. 

The project is divided into public and source folders, with the public folder containing the assets for the game and the sources folder subdivided into the folders client, server, and shared which contain the code that makes the project run. 

The shared folder contains only one file, constants.js. This file contains the constants that both the client and server need to run the game. Examples include the size of the map, information about the scoring, and sizes for different in game objects. This file makes it easy for us to change parameters without needing to go into the code and change every instance of a constant.

The server folder contains the javascript files that run the server. 

server.js contains the code that sets up the server. It also creates a new instance of the game class which is from game.js. The game class contains all of the code that runs the game. The main loop first checks how long it has been since the last update the updates the different objects (players, bullets, healthpacks, etc.) accordingly. An update is then sent to the players every other loop. The game class also handles the creation of new objects using the object classes. 

object.js contains the object superclass. This class contains basic functions for in game objects. The player, asteroid, bullet, ammopack, and healthpack classes are subclasses of the object class and are each contained in their own file. This separation made it easy to add specific code to each of the different objects while also sharing much of the basic functionality. 

The client folder contains the javascript needed to run the client side of the game as well as some very minimal html and css. The html file is not much more than a canvas for the game and a framework for the leaderboard. The javascript is separated into multiple files. 

index.js is the main client file. It waits for a connection and for the assets to be downloaded then prompts the user for a username. Once the user provides a username, functions are called to start the rendering, communication with the server, and monitor input. 

networking.js handles the connection with the server. When disconnected or when the player dies, the window reloads. This is not the most elegant solution but it gets the jobs done and allows the user to play again.

render.js contains the main loop for rendering the player. It contains a loop where each of the objects are drawn to the game canvas. 

input.js handles the user's input using event listeners. 

state.js contains the code for creating a game state and updating the leaderboard. With our limited time and experience, we were not able to implement lag compensation but the game runs very smoothly under normal conditions and even has minimal lag when players connect from long distances (Italy to Boston!).

assets.js loads the assets and leaderboard.js handles the leaderboard. Both of these files are mostly copied from the tutorial. 
