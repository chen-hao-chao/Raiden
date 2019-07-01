var bootState = {
    preload: function(){
        game.load.image('progressBar_in', 'img/progress_bar_in.png');
        game.load.image('progressBar', 'img/progress_bar.png');
    },
    create: function(){
        //game settings
        game.stage.backgroundColor = '#000000';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.renderer.renderSession.roundPixels = true;
        //load state
        game.state.start('menu');
    }

}