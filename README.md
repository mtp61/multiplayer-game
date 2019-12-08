# Multiplayer asteroids
By Matt Pauly, Thomas Maisonneuve and Kabir Nagral

## Overview
Our CS50 Final project is an online real time multiplayer game called **Multiplayer asteroids**. Each player controls a spaceship in a 2D environment. The goal is to survive the longest and maximize one's score, which can be done in two different ways: by shooting at the other players connected to the server at the same time, or by destroying the dangerous asteroids floating around the map.

## How to setup
The game currently runs on localhost, on the port **3000**. To build it and run it, download the source files and execute the following commands in a terminal:

     - npm init
     - npm install
     - npm run develop
     
Then open your browser and go to your localhost at  [http://127.0.0.1:3000/](http://127.0.0.1:3000/) or [http://localhost:3000](http://localhost:3000)
## Controls

Enter your name, then hit **PLAY**. You will be spawned randomly in the map. Make yourself familiar with the game controls. Press **W** to move forward, **A** to rotate to the left and **D** to rotate to the right. To shoot laser beams, press the **spacebar**. 

## How to play
On the bottom right corner of the screen you will see a minimap, showing where you currently are in the map. You are the black dot, and all your opponents will be red dots. Just on top of the minimap are two indicators, for **AMMO** and **HP** respectively. 

You will initially have an **HP** of 100 and an **AMMO** of 20 laser blasts. Use them sparingly! If you hit an asteroid or another player shoots you, you will lose HP. If it gets to zero, you will die and will be brought back to the start screen. To prevent this from happening, you can hover onto the **Health packs** to refill HP and onto the **Ammo packs** to refill AMMO. Each pack contais 10 HP or 10 AMMO.

You can **shoot** at players and at asteroids. Big asteroids break up into smaller ones, which cause smaller damage to the players. 

The **score** is displayed in the leaderboard. It can be increased by destroying asteroids or by killing opponents. 
