class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload () {
        // load image of the rocket
        this.load.image('rocket', './assets/rocket.png');

        // load audio
        this.load.audio('sfx_select', './assets/ui_select.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shoot.wav');

        // load explosion audio
        this.load.audio('sfx_explosion1', './assets/explosion1.wav');
        this.load.audio('sfx_explosion2', './assets/explosion2.wav');
        this.load.audio('sfx_explosion3', './assets/explosion3.wav');
        this.load.audio('sfx_explosion4', './assets/explosion4.wav');
        this.load.audio('sfx_explosion5', './assets/explosion5.wav');

        // load music
        this.load.audio('ingame_music', './assets/ingame_music.mp3');
    }
    
    create () {
        // title text configuration
        let titleConfig = {
            fontFamily: "Source Sans Pro",
            fontSize: '60px',
            backgroundColor: '#F3B141',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 10,
                left: 10
            }
        };

        // create Rocket Patrol game title
        this.add.text(game.config.width/2, borderUISize - borderPadding, 
            'ROCKET\nPATROL', titleConfig).setOrigin(0.5, 0);

        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            },
            fixedWidth: 0
        };

        // difficulty tip text
        this.add.text((game.config.width/2)/2, game.config.height/1.75 - borderUISize - borderPadding, 
            'Use ←→ arrows to change difficulty:', menuConfig).setOrigin(0.5);
        
        // difficulty text
        menuConfig.color = '#000000'
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.padding.right = 15;
        menuConfig.padding.left = 15;
        this.difficultyText = this.add.text((game.config.width/2)/2, 
            game.config.height/1.55 - borderUISize - borderPadding, 'NOVICE', 
            menuConfig).setOrigin(0.5, 0.5);
        
        // start button
        menuConfig.color = '#843605'
        menuConfig.padding.right = 5;
        menuConfig.padding.left = 5;
        this.add.text((game.config.width/2) / 2, game.config.height/1.35, 
            'PRESS (F) TO START', menuConfig).setOrigin(0.5);

        // tutorial text configuration
        let tutorialConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            },
            fixedWidth: 0
        };

        this.add.text(game.config.width/1.335, game.config.height/1.75 - borderUISize - borderPadding, 
            'Use ← and → to move your ship\nPress (F) to fire', tutorialConfig).setOrigin(0.5);

        // variable which stores difficulty 
        this.noviceDifficulty = true;

        // place a rocket in the scene to demo the movement in the game
        // I'm using the below method to avoid any future resolution issues
        this.centerPosition = new Phaser.Math.Vector2(game.config.width/1.335, game.config.height/1.15);
        this.leftPosition = new Phaser.Math.Vector2((game.config.width/2) + ((this.centerPosition.x - (game.config.width/2))/2), 
            this.centerPosition.y);
        this.rightPosition = new Phaser.Math.Vector2(this.centerPosition.x + ((this.centerPosition.x - (game.config.width/2))/2), 
            this.centerPosition.y);
        this.topPosition = new Phaser.Math.Vector2(this.centerPosition.x, 
            game.config.height/1.55 - borderUISize - borderPadding);
        
        this.demoRocket = this.add.sprite(this.centerPosition.x, this.centerPosition.y, 
            'rocket', 0); // add the rocket
        
        this.demoRocketState = 1;
        this.demoRocketSpeed = 2;

        

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    update () {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT) || Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            if (this.noviceDifficulty) {
                this.noviceDifficulty = false;
                this.difficultyText.text = "EXPERT";
                this.sound.play('sfx_select', {volume: 0.4});
            }
            else {
                this.noviceDifficulty = true;
                this.difficultyText.text = "NOVICE";
                this.sound.play('sfx_select', {volume: 0.4});
            }
        }

        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            // play easy mode
            if (this.noviceDifficulty) {
                game.settings = {
                    parallaxSpeed: 2,
                    spaceshipSpeed: 3,
                    gameTimer: 60000    
                }
                this.sound.play('sfx_select', {volume: 0.4});
                this.scene.start('playScene');  
    
                // Add in game music
                this.music = this.sound.add('ingame_music', {loop: true});
                this.music.play(); 
            }

            // play expert mode
            else {
                game.settings = {
                    parallaxSpeed: 3,
                    spaceshipSpeed: 4,
                    gameTimer: 45000    
                }
                this.sound.play('sfx_select', {volume: 0.4});
                this.scene.start('playScene');  
    
                // Add in game music
                this.music = this.sound.add('ingame_music', {loop: true});
                this.music.play(); 
            }
        }

        // move the spaceship depending on the state it's currently in
        if (this.demoRocketState == 1) { // Moving from the center to the left
            this.demoRocket.x -= this.demoRocketSpeed;

            if (this.demoRocket.x <= this.leftPosition.x) { // transition to moving right once it's moved to the left
                this.demoRocket.x = this.leftPosition.x;
                this.demoRocketState = 0;
                this.time.delayedCall(1000, () => {
                    this.demoRocketState = 2;
                }, null, this);
            }
        }

        if (this.demoRocketState == 2) { // Moving from the left to the right
            this.demoRocket.x += this.demoRocketSpeed;

            if (this.demoRocket.x >= this.rightPosition.x) { // transition to moving right once it's moved to the left
                this.demoRocket.x = this.rightPosition.x;
                this.demoRocketState = 0;
                this.time.delayedCall(1000, () => {
                    this.demoRocketState = 3;
                }, null, this);
            }
        }

        if (this.demoRocketState == 3) { // Moving from the right to the center
            this.demoRocket.x -= this.demoRocketSpeed;

            if (this.demoRocket.x <= this.centerPosition.x) { // transition to moving right once it's moved to the left
                this.demoRocket.x = this.centerPosition.x;
                this.demoRocketState = 0;
                this.time.delayedCall(1000, () => {
                    this.demoRocketState = 4;
                }, null, this);
            }
        }

        if (this.demoRocketState == 4) { // Moving from the center to the top
            this.demoRocket.y -= this.demoRocketSpeed;

            if (this.demoRocket.y <= this.topPosition.y) { // transition to moving right once it's moved to the left
                this.demoRocket.y = this.centerPosition.y;
                this.demoRocketState = 0;
                this.time.delayedCall(1000, () => {
                    this.demoRocketState = 1;
                }, null, this);
            }
        }
    }
}