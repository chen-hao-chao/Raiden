var loadState = {
    preload: function(){
        //music
        music_start = false;

        //label
        var load_txt = game.add.text(game.width/2, game.height/2-40, 'loading...', {font: '13px Orbitron', fill: '#ffffff'});
        load_txt.anchor.setTo(0.5, 0.5);

        //display progress bar
        var progressBar_in = game.add.sprite(game.width/2-96, game.height/2, 'progressBar_in');
        progressBar_in.anchor.setTo(0, 0.5);
        game.load.setPreloadSprite(progressBar_in);
        //image
        var progressBar = game.add.image(game.width/2, game.height/2, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        
        //load images...
        game.load.image('background', 'img/background.png');
        //player
        game.load.spritesheet('player', 'img/ship.png', 40, 74);
        game.load.spritesheet('rocket', 'img/rocket.png', 20, 43);
        game.load.spritesheet('laser', 'img/laser.png', 172, 40);
        game.load.image('bullet1', 'img/bullet1.png');
        //enemies
        game.load.spritesheet('enemy1', 'img/enemy1.png', 40, 40);
        game.load.spritesheet('bullet2', 'img/bullet2.png', 15, 15);
        //boss
        game.load.spritesheet('boss', 'img/boss.png', 200, 116);
        game.load.spritesheet('bullet3', 'img/bullet3.png');
        //explode
        game.load.spritesheet('explode1', 'img/explode1.png', 80, 92);
        game.load.spritesheet('explode2', 'img/explode2.png', 30, 34);
        game.load.image('pixel1', 'img/pixel1.png');
        game.load.image('pixel2', 'img/pixel2.png');
        //health bar
        game.load.image('healthBar_in', 'img/blood_bar_in.png');
        game.load.image('healthBar', 'img/blood_bar.png');
        game.load.image('energyBar_in', 'img/energy_bar_in.png');
        game.load.image('energyBar', 'img/energy_bar.png');
        game.load.image('panel', 'img/panel.png');
        //icon
        game.load.image('rocket_icon', 'img/rocket_icon.png');
        game.load.image('win', 'img/win.png');
        game.load.image('lose', 'img/lose.png');
        //music
        game.load.audio('play_back', 'music/play_back.mp3');
        game.load.audio('laser', 'music/laser.mp3');
        game.load.audio('bomb', 'music/bomb.mp3');
        game.load.audio('launch', 'music/launch.mp3');
        game.load.audio('destructions', 'music/destructions.mp3');
        game.load.audio('coin', 'music/coin.mp3');
        game.load.audio('beam', 'music/beam.mp3');
    },
    create: function(){
        game.state.start('play');  
    }
}