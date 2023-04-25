// Michael Nieto
// *Mod Title here*
// Time it took to finish: 0 hours

// Intended mods:
// <- 5 point tier ->
// Add background music [5 points]
// new scrolling tile sprite [5 points]
//
// <- 10 point tier ->
// new title screen [10 points]
// parallax scrolling [10 points]
// 
// <- 15 point tier ->
// new spaceship type [15 points]
// new timing system [15 points]
// create particle emitter [15 points]

// Completed Mods:
// Randomize spaceship movement direction [5 pts]
// Display remaining time on screen [10 pts]
// Randomize explosion sounds [10 points]

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

// reserve keyboard variable
let keyF, keyR, keyLEFT, keyRIGHT;

// Set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;