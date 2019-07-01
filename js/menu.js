var menuState = {
    preload: function(){//console.log("menu");
        //load all game assets
        game.load.spritesheet('controlBar','img/control_bar.png', 169, 18);
        game.load.image('button', 'img/button.png');
        game.load.image('sound', 'img/sound.png');
        game.load.audio('menu_back', 'music/menu_back.mp3');
        game.load.audio('select', 'music/sound_select.wav');
        game.load.audio('shift', 'music/sound_shift.wav');
        var rank_idx = 0;
        var rankRef = firebase.database().ref('rank');
        rankRef.once('value').then(function (snapshot) {
            snapshot.forEach(function(childSnapshot) {
                rank_list[rank_idx] = childSnapshot;
                rank_idx++;
            });
            if(rank_list.length >= 2){
                rank_list.sort(function (a, b) {
                    return (b.child("score").val() - a.child("score").val());
                });
            }
        });
    },
    create: function(){        
        //music
        if(music_start == false){
            music = game.add.audio('menu_back');
            music.loopFull();
            select = game.add.audio('select');
            shift = game.add.audio('shift');
            music.volume = 0.5;
            music.play();
            music_start = true;
        }
        //control bar
        //txt: [start, about]
        var title_txt = game.add.text(game.width/2, 170, 'RAIDEN', {font: '18px Orbitron', fill: '#ffffff', backgroundColor: 'rgba(0,210,190)'});
        title_txt.anchor.setTo(0.5, 0.5);
        var menu_txt_start = game.add.text(game.width/2, 240, 'START', {font: '13px Orbitron', fill: '#ffffff'});
        menu_txt_start.anchor.setTo(0.5, 0.5);
        var menu_txt_about = game.add.text(game.width/2, 280, 'MORE', {font: '13px Orbitron', fill: '#ffffff'});
        menu_txt_about.anchor.setTo(0.5, 0.5);
        //img
        this.control_bar = game.add.sprite(game.width/2, 240, 'controlBar');
        this.control_bar.anchor.setTo(0.5, 0.5);
        this.control_bar.animations.add('run_controlBar', [0,1,2,3,4,5], 12, true);
        //key control
        this.control_pos = 0;
        this.cursor = game.input.keyboard.createCursorKeys();
        var key_down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        key_down.onDown.add(this.control, this);
        var key_up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        key_up.onDown.add(this.control, this);
        var key_enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        key_enter.onDown.add(this.control_enter, this);
    },
    update: function(){
        this.control_bar.animations.play('run_controlBar');
    },
    control: function(){
        shift.play();
        this.control_bar.y = (this.control_pos == 0)? 280 : 240;
        this.control_pos = (this.control_pos == 1)? 0 : 1;
    },
    control_enter: function (){
        select.play();
        if(this.control_pos == 0){
            game.state.start('load');
        }
        else{
            game.state.start('about');
        }
    }
}

