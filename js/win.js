var winState = {
    preload: function(){
    },
    create: function(){
        this.win = game.add.sprite(game.width/2, 140, 'win');
        this.win.width = 50;
        this.win.height = 100;
        this.win.anchor.setTo(0.5, 0.5);

        var menu_txt_start = game.add.text(game.width/2, 200, 'YOU WIN!', {font: '13px Orbitron', fill: '#ffffff'});
        menu_txt_start.anchor.setTo(0.5, 0.5);
        var score_txt = game.add.text(game.width/2, 240, 'YOU GOT ' + score + ' points!', {font: '13px Orbitron', fill: '#ffffff', backgroundColor: '#6A5ACD'});
        score_txt.anchor.setTo(0.5, 0.5);
        var name_txt = game.add.text(game.width/2-50, 280, 'INPUT YOUR NAME:', {font: '13px Orbitron', fill: '#ffffff'});
        name_txt.anchor.setTo(0.5, 0.5);
        var menu_txt_enter = game.add.text(game.width/2, 320, '<Press Enter To Menu>', {font: '13px Orbitron', fill: '#ffffff'});
        menu_txt_enter.anchor.setTo(0.5, 0.5);
        
        //key control
        this.cursor = game.input.keyboard.createCursorKeys();
        var key_enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        key_enter.onDown.add(this.control_enter, this);
        //ABC
        this.user_name = game.add.text(game.width/2+20, 280, ' ', {font: '13px Orbitron', fill: '#ffffff', backgroundColor: '#6A5ACD'});
        this.user_name.anchor.setTo(0, 0.5);
        var key_BS = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
        key_BS.onDown.add(function(){
            var len = this.user_name.text.length-1;
            var n_str = this.user_name.text.substring(0,len);
            this.user_name.text = n_str;
        }, this);

        var key_A = game.input.keyboard.addKey(Phaser.Keyboard.A);
        key_A.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'A';}, this);
        var key_B = game.input.keyboard.addKey(Phaser.Keyboard.B);
        key_B.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'B';}, this);
        var key_C = game.input.keyboard.addKey(Phaser.Keyboard.C);
        key_C.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'C';}, this);
        var key_D = game.input.keyboard.addKey(Phaser.Keyboard.D);
        key_D.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'D';}, this);
        var key_E = game.input.keyboard.addKey(Phaser.Keyboard.E);
        key_E.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'E';}, this);
        var key_F = game.input.keyboard.addKey(Phaser.Keyboard.F);
        key_F.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'F';}, this);
        var key_G = game.input.keyboard.addKey(Phaser.Keyboard.G);
        key_G.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'G';}, this);
        var key_H = game.input.keyboard.addKey(Phaser.Keyboard.H);
        key_H.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'H';}, this);
        var key_I = game.input.keyboard.addKey(Phaser.Keyboard.I);
        key_I.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'I';}, this);
        var key_J = game.input.keyboard.addKey(Phaser.Keyboard.J);
        key_J.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'J';}, this);
        var key_K = game.input.keyboard.addKey(Phaser.Keyboard.K);
        key_K.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'K';}, this);
        var key_L = game.input.keyboard.addKey(Phaser.Keyboard.L);
        key_L.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'L';}, this);
        var key_M = game.input.keyboard.addKey(Phaser.Keyboard.M);
        key_M.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'M';}, this);
        var key_N = game.input.keyboard.addKey(Phaser.Keyboard.N);
        key_N.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'N';}, this);
        var key_O = game.input.keyboard.addKey(Phaser.Keyboard.O);
        key_O.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'O';}, this);
        var key_P = game.input.keyboard.addKey(Phaser.Keyboard.P);
        key_P.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'P';}, this);
        var key_Q = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        key_Q.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'Q';}, this);
        var key_R = game.input.keyboard.addKey(Phaser.Keyboard.R);
        key_R.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'R';}, this);
        var key_S = game.input.keyboard.addKey(Phaser.Keyboard.S);
        key_S.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'S';}, this);
        var key_T = game.input.keyboard.addKey(Phaser.Keyboard.T);
        key_T.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'T';}, this);
        var key_U = game.input.keyboard.addKey(Phaser.Keyboard.U);
        key_U.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'U';}, this);
        var key_V = game.input.keyboard.addKey(Phaser.Keyboard.V);
        key_V.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'V';}, this);
        var key_W = game.input.keyboard.addKey(Phaser.Keyboard.W);
        key_W.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'W';}, this);
        var key_X = game.input.keyboard.addKey(Phaser.Keyboard.X);
        key_X.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'X';}, this);
        var key_Y = game.input.keyboard.addKey(Phaser.Keyboard.Y);
        key_Y.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'Y';}, this);
        var key_Z = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        key_Z.onDown.add(function(){if(this.user_name.text.length<10)this.user_name.text=this.user_name.text+'Z';}, this);
    },
    update: function(){
    },
    control_enter: function (){
        music.stop();
        music_start=false;
        var rankRef = firebase.database().ref('rank');
        var newPostRef = rankRef.push();
        newPostRef.set({
            name: this.user_name.text,
            score: score
        });
        game.state.start('menu');
    }
}

