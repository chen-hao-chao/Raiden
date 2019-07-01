
var loseState = {
    preload: function(){
    },
    create: function(){
        this.lose = game.add.sprite(game.width/2, 150, 'lose');
        this.lose.width = 50;
        this.lose.height = 50;
        this.lose.anchor.setTo(0.5, 0.5);
        var menu_txt_start = game.add.text(game.width/2, 240, 'YOU LOSE...', {font: '13px Orbitron', fill: '#ffffff'});
        menu_txt_start.anchor.setTo(0.5, 0.5);
        var menu_txt_enter = game.add.text(game.width/2, 280, '<Press Enter To Menu>', {font: '13px Orbitron', fill: '#ffffff'});
        menu_txt_enter.anchor.setTo(0.5, 0.5);
        
        //key control
        this.cursor = game.input.keyboard.createCursorKeys();
        var key_enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        key_enter.onDown.add(this.control_enter, this);
    },
    update: function(){
    },
    control_enter: function (){
        music.stop();
        music_start=false;
        game.state.start('menu');
    }
}

