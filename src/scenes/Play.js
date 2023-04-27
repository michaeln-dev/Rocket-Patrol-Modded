class Play extends Phaser.Scene {
    constructor() {
        super('playScene');        
    }

    init (args) {
        this.currentPlayer = args.playerStart;
        this.p1Score = args.p1Score;
        this.p2Score = args.p2Score;
    }

    preload() {
        // load images/tile sprites
        // this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('special_spaceship', './assets/special_spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('stars', './assets/stars.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {    
        // Place a tilesprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.stars = this.add.tileSprite(0, 0, 640, 480, 'stars').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 
            0x00FF00).setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 
            0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 
            0xFFFFFF).setOrigin(0, 0);

        // Add the rocket
        this.p1Rocket = new Rocket(this, game.config.width/2, 
            game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        
        // add spaceships (x4)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, 
            borderUISize*4, 'spaceship', 0, 30, 2, false).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, 
            borderUISize*5 + borderPadding*2, 'spaceship', 0, 20, 1, false).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 
            'spaceship', 0, 10, 1, false).setOrigin(0,0);
        this.specialShip = new Spaceship(this, game.config.width + borderUISize*3, 
            borderUISize*7 + borderPadding*8, 'special_spaceship', 0, 50, 0, true).setOrigin(0,0);
        
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create ({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start:0, end:9, first:0 }),
            frameRate: 30
        });

        // initialize score
        //this.p1Score = 0;
        //this.p2Score = 0;

          // display p1 score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        };

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 
            this.p1Score, scoreConfig);
        
        this.scoreRight = this.add.text(game.config.width - borderUISize - borderPadding, 
            borderUISize + borderPadding*2, this.p2Score, scoreConfig).setOrigin(1, 0);
        
        // display level timer
        let timerConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 120
        };

        this.timeLeft = this.add.text((game.config.width/2) - (timerConfig.fixedWidth/2), 
            borderUISize + borderPadding*2, "00 : 00", timerConfig);
        
        scoreConfig.fixedWidth = 0;
        if (this.currentPlayer == 1) {
            this.playerText = this.add.text(game.config.width/2, game.config.height/2, 'Player 1 Start', 
                scoreConfig).setOrigin(0.5);
        }
        else {
            this.playerText = this.add.text(game.config.width/2, game.config.height/2, 'Player 2 Start', 
                scoreConfig).setOrigin(0.5);
        }
        
        this.startText = this.add.text(game.config.width/2, game.config.height/2 + 64, 
            'Press (F) to begin', scoreConfig).setOrigin(0.5);

        // Game Over Flag
        this.gameOver = false;

        // Game start flag
        this.gameStart = false;

        // 60 second play clock
        scoreConfig.fixedWidth = 0;
        this.clock;
    }

    update() {
        this.stars.tilePositionX -= game.settings.parallaxSpeed;

        if (!this.gameStart) {
            if (Phaser.Input.Keyboard.JustDown(keyF)) {
                let timerConfig = {
                    fontFamily: 'Courier',
                    fontSize: '28px',
                    backgroundColor: '#F3B141',
                    color: '#843605',
                    align: 'right',
                    padding: {
                        top: 5,
                        bottom: 5,
                    },
                    fixedWidth: 0
                };

                let gameOverText = '';
                let proceedText = 'Press (R) to proceed or ← for Main Menu';
                if (this.currentPlayer == 1) {
                    gameOverText = 'GAME OVER PLAYER 1';
                }
                else {
                    gameOverText = 'GAME OVER PLAYER 2';
                }

                this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
                    this.add.text(game.config.width/2, game.config.height/2, gameOverText, 
                        timerConfig).setOrigin(0.5);
                    timerConfig.fontSize = '24px';
                    this.add.text(game.config.width/2, game.config.height/2 + 64, 
                        proceedText, timerConfig).setOrigin(0.5);
                    this.gameOver = true;
                }, null, this);

                this.playerText.destroy();
                this.startText.destroy();

                this.gameStart = true;
            }
            return;
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            // Pass in player 2 argument if leaving player 1 gameplay
            if (this.currentPlayer == 1) {
                this.scene.restart({playerStart: 2, p1Score: this.p1Score, p2Score: 0});
            }
            else {
                this.scene.restart({playerStart: 1, p1Score: 0, p2Score: 0});
            }
            
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.game.sound.stopAll();
            this.scene.start('menuScene');
        }

        if (!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();               // update spaceships (x4)
            this.ship02.update();
            this.ship03.update();
            this.specialShip.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            console.log('kaboom ship 03');
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            console.log('kaboom ship 02');
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            console.log('kaboom ship 01');
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.specialShip)) {
            console.log('kaboom special ship');
            this.p1Rocket.reset();
            this.shipExplode(this.specialShip);
        }

        // Update Timer using the provided timer format function
        let secondsLeft = this.clock.getRemainingSeconds();
        this.timeLeft.text = this.formatTimer(secondsLeft);
    }

    formatTimer(time) {
        // Takes an argument in seconds and returns the time in 00 : 00 format
        let minutes = Math.floor(time/60);
        let seconds = Math.floor(time % 60);
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');

        return `${minutes} : ${seconds}`;
    }

    updateTimer (addedTime) {
        let timerConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };

        // Initialize the text that the game uses
        let gameOverText = '';
        let proceedText = 'Press (R) to proceed or ← for Main Menu';
        if (this.currentPlayer == 1) {
            gameOverText = 'GAME OVER PLAYER 1';
        }
        else {
            gameOverText = 'GAME OVER PLAYER 2';
        }

        // Add the current time with the newly added time
        let newTime = (this.clock.getRemainingSeconds() + addedTime) * 1000;

        // Remove the old timer and add a new timer with the new time
        this.clock.remove();
        this.clock = this.time.delayedCall(newTime, () => {
            this.add.text(game.config.width/2, game.config.height/2, gameOverText, 
                timerConfig).setOrigin(0.5);
            timerConfig.fontSize = '24px';
            this.add.text(game.config.width/2, game.config.height/2 + 64, 
                proceedText, timerConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    checkCollision (rocket, ship) {
        // Simple AABB Checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && 
            rocket.height + rocket.y > ship. y) {
            return true;
          } else {
            return false;
          }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;

        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });

        // score add and repaint
        if (this.currentPlayer == 1) {
            this.p1Score += ship.points;
            this.scoreLeft.text = this.p1Score;
        }
        else {
            this.p2Score += ship.points;
            this.scoreRight.text = this.p2Score;
        }
        

        // Add time to the timer
        this.updateTimer(ship.addedTime);
        // this.clock.timeLeft += ship.addedTime;

        // play random explosion sound effect
        // Taken from: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript\
        let max = 5;
        let min = 1;
        let randExplosionNumber = Math.floor(Math.random() * (max - min + 1) + min);

        let explosionConfig = {};
        // explosion sounds 1, 4, and 5 are a little loud, so apply a band aid fix lol
        if (randExplosionNumber == 1 || randExplosionNumber == 4 || randExplosionNumber == 5) {
            explosionConfig = {
                volume: 0.455
            };
        }
        this.sound.play('sfx_explosion' + randExplosionNumber, explosionConfig);
    }
}