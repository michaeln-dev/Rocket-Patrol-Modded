// Michael Nieto
// Rocket Patrol 1.5
// Time it took to finish: 11 hours

// Completed Mods:
// New scrolling tile sprite [5 pts]
// Add background music [5 pts]
// Randomize spaceship movement direction [5 pts]
//
// Display remaining time on screen [10 pts]
// Randomize explosion sounds [10 pts]
// New title screen [10 pts] ~ New layout and text and it even has a cool tutorial animation
// Parallax scrolling [10 pts] ~ The sun layer doesn't move while the stars do
//
// New spaceship type [15 pts] ~ Every time it respawns it changes move speed for added difficulty
// New timing system [15 pts] ~ Special ship gives high points but no time bonus
// Alternating 2 player mode [15 pts]

// Citations:
// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript\
// https://stackoverflow.com/questions/45136711/javascript-random-generate-0-or-1-integer
// Phaser Documentation

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

// reserve keyboard variable
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keyDOWN;

// Set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;