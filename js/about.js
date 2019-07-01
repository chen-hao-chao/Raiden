var aboutState = {
    create: function(){
        var sound_txt = game.add.text(game.width/2, 50, 'SOUND', {font: '15px Orbitron', fill: '#ffffff', backgroundColor: 'rgba(0,210,190)'});
        sound_txt.anchor.setTo(0.5, 0.5);
        var rank_txt = game.add.text(game.width/2, 200, 'RANK', {font: '15px Orbitron', fill: '#ffffff', backgroundColor: 'rgba(0,210,190)'});
        rank_txt.anchor.setTo(0.5, 0.5);

        var key_enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        key_enter.onDown.add(this.control_enter, this);

        //slider
        var w = (music.volume)*170;
        this.bounds= new Phaser.Rectangle(130,100,170,10);
        var graphics = game.add.graphics(this.bounds.x, this.bounds.y);
        graphics.beginFill(0xeeeeee);
        graphics.drawRect(0, 0, this.bounds.width, this.bounds.height);

        this.sound = game.add.sprite(100, 100, 'sound');
        this.sound.width = 15;
        this.sound.height = 15;
        this.slider = game.add.sprite(130+w, 100, 'button');
        this.slider.width = 13;
        this.slider.height = 10;
        this.slider.inputEnabled = true;
        this.slider.input.enableDrag(false,false,false,255,this.bounds);
        this.slider.input.allowVerticalDrag = false;
        this.min=1;

        //rank
        for(var i=0;i<10;i++){
            var name_ = (rank_list[i] == undefined)? "-----" : rank_list[i].child("name").val();
            var score_ = (rank_list[i] == undefined)? "0" : rank_list[i].child("score").val();
            var n_txt = game.add.text(140, 250+i*20, name_, {font: '12px Orbitron', fill: '#ffffff'});
            n_txt.anchor.setTo(0.5, 0.5);
            var s_txt = game.add.text(280, 250+i*20, score_, {font: '12px Orbitron', fill: '#ffffff'});
            s_txt.anchor.setTo(0.5, 0.5);
        }
    },
    update: function(){
        music.volume = (this.slider.x-130)/170;
    },
    control_enter: function(){
        select.play();
        game.state.start('menu');
    },
}
