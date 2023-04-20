//const { Phaser } = require("../lib/phaser")

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