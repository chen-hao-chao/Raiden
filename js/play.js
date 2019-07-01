var DIR = {
    STOP: 0,
    FORWARD: 1,
    BACKWARD: 2,
    LEFT: 3,
    RIGHT: 4,
};
var STATE = {
    CHASE: 0,
    OUT_L: 1,
    OUT_R: 2
}
var STAGE = {
    ROUND1: 0,
    IDLE: 1,
    ROUND2: 2,
    BOSS_DIE: 3,
    PLAYER_DIE: 4
}
var ENEMY1_NUM = 5;
var ENEMY1_ATT_PERIOD = 100;
const PLAYER_HEALTH = 100;
const PLAYER_ENERGY = 500;
const NEXT_STAGE = 100;
const BOSS_HEALTH = 1000;
var playState = {
    preload: function(){
        //nothing to do.
        ENEMY1_NUM = 5;
        ENEMY1_ATT_PERIOD = 100;
    },
    create: function(){
        //music
        var p_bomb = game.add.audio('bomb');
        var p_launch = game.add.audio('launch');
        var p_laser = game.add.audio('laser');
        var p_des = game.add.audio('destructions');
        var p_coin = game.add.audio('coin');
        var p_beam = game.add.audio('beam');
        this.sound_effect = [p_laser, p_bomb, p_launch, p_des, p_coin, p_beam];
        if(music_start == false){
            music.stop();
            music = game.add.audio('play_back');
            music.play();
            music.start = true;
        }
        //stage
        this.stage = STAGE.ROUND1;
        this.counter = 0;
        //background
        this.background = game.add.tileSprite(-30, -30, 600, 600, 'background');
        //icon
        this.rocket_icon = game.add.sprite(200, 200, 'rocket_icon');
        this.rocket_icon.enableBody = true;
        this.rocket_icon.anchor.setTo(0.5, 0.5);
        this.rocket_icon.visible = false;
        this.get_rocket = false;
        game.physics.arcade.enable(this.rocket_icon);
        //create player
        this.player = game.add.sprite(game.width/2, 300, 'player');
        this.player.enableBody = true;
        this.player.anchor.setTo(0.5, 0.5);
        this.player.animations.add('player_left', [1,2], 8, false);
        this.player.animations.add('player_right', [3,4], 8, false);
        this.player.animations.add('player_forward', [5,6,7,8], 8, true);
        this.player.maxHealth = PLAYER_HEALTH;
        this.player.health = PLAYER_HEALTH;
        this.player_dir = DIR.STOP;
        this.player_energy = PLAYER_ENERGY;
        game.physics.arcade.enable(this.player);
        // bullet
        this.bullet = game.add.weapon(30, 'bullet1');
        this.bullet.enableBody = true;
        this.bullet.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.bullet.bulletAngleOffset = 90;
        this.bullet.bulletSpeed = 400;
        this.bullet.fireRate = 60;
        this.bullet.bulletAngleVariance = 10;
        this.bullet.trackSprite(this.player, 0, -30);// -30 is offset(distance between player and bullet)
        //rocket
        this.rocket = game.add.sprite(700, 700, 'rocket');
        this.rocket.animations.add('run_rocket', [0,1,2,3], 20, true);
        this.rocket.animations.play('run_rocket');
        this.rocket.enableBody = true;
        this.rocket.anchor.setTo(0.5, 0.5);
        this.rocket.alive = false;
        this.rocket.visible = false;
        this.rocket_target = -1;
        game.physics.arcade.enable(this.rocket);
        //cursor
        this.cursors = this.input.keyboard.createCursorKeys();
        this.laserButton = this.input.keyboard.addKey(Phaser.KeyCode.Z);
        this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        //create enemy group
        this.enemies_dir = [];
        this.enemies_state = [];
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        for(var i=0;i<ENEMY1_NUM;i++){
            var pos = game.rnd.pick([0, 1, 2, 3, 4])*game.width/5+10;
            var enemy_ = this.enemies.create(pos, 10, 'enemy1');
            enemy_.animations.add('enemy_hurt', [1, 0], 12, false);
            enemy_.anchor.setTo(0.5, 0.5);
            enemy_.alive = false;
            enemy_.maxHealth = 200;
            enemy_.health = 200;
            //direction
            this.enemies_dir[i] = DIR.STOP;
            this.enemies_state[i] = STATE.CHASE;
        }
        game.time.events.loop(1000, this.addEnemy, this);
        //bullet
        this.enemy_bullet_period = [];
        for(var i=0;i<ENEMY1_NUM*2;i++) this.enemy_bullet_period[i] = 0;
        this.enemy_bullet = game.add.group();
        this.enemy_bullet.enableBody = true;
        this.enemy_bullet.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemy_bullet.createMultiple(ENEMY1_NUM*2, 'bullet2');
        this.enemy_bullet.callAll('animations.add', 'animations', 'run_bullet2', [0, 1, 2, 3], 8, true);
        this.enemy_bullet.callAll('animations.play', 'animations', 'run_bullet2');
        this.enemy_bullet.setAll('anchor.x', 0.5);
        this.enemy_bullet.setAll('anchor.y', 0.5);
        this.enemy_bullet.setAll('checkWorldBounds', true);
        this.enemy_bullet.setAll('outOfBoundsKill', true);

        //boss
        this.boss = game.add.sprite(game.width/2, -20, 'boss');
        this.boss.animations.add('boss_hurt', [1, 0], 12, false);
        this.boss.maxHealth = BOSS_HEALTH;
        this.boss.health = BOSS_HEALTH;
        this.boss.enableBody = true;
        this.boss.anchor.setTo(0.5, 0.5);
        this.boss.alive = false;
        game.physics.arcade.enable(this.boss);
        // bullet
        this.boss_bullet = game.add.weapon(10, 'bullet3');
        this.boss_bullet.enableBody = true;
        this.boss_bullet.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.boss_bullet.bulletAngleOffset = 90;
        this.boss_bullet.bulletSpeed = -300;
        this.boss_bullet.fireRate = 10;
        this.boss_bullet.bulletAngleVariance = 20;
        this.boss_bullet.trackSprite(this.boss, 0, 50);
        game.physics.arcade.enable(this.boss_bullet);
        //laser
        this.laser = game.add.sprite(game.width/2, 10, 'laser');
        var ani = this.laser.animations.add('run_laser', [0,1,2,3,4,5,6,7,8,9], 20, false);
        this.laser.enableBody = true;
        this.laser.anchor.setTo(0.5, 0.5);
        this.laser.angle = 270;
        this.laser.visible = false;
        this.laser.alive = false;
        game.physics.arcade.enable(this.laser);
        //emmiter1
        this.emitter1 = game.add.emitter(0,0,15)
        this.emitter1.makeParticles('pixel1');
        this.emitter1.setYSpeed(-150,150);
        this.emitter1.setXSpeed(-150, 150);
        this.emitter1.setScale(2,0,2,0,800);
        this.emitter1.gravity = 0;
        //emmiter2
        this.emitter2 = game.add.emitter(0,0,120)
        this.emitter2.makeParticles('pixel2');
        this.emitter2.setYSpeed(-150,150);
        this.emitter2.setXSpeed(-280, 280);
        this.emitter2.setScale(2,0,2,0,1300);
        this.emitter2.gravity = 0;

        //panel
        this.panel = game.add.image(-40, -60, 'panel');
        //score
        this.score = 0;
        this.score_txt = game.add.text(10, 10, 'score: 0', {font: '10px Orbitron', fill: '#ffffff'});
        //blood
        this.health_bar_in = game.add.image(259, 10, 'healthBar_in');//+19
        this.health_bar_in.scale.setTo(1.04, 1);
        this.health_bar = game.add.image(240, 10, 'healthBar');
        //energy
        this.energy_bar_in = game.add.image(99, 10, 'energyBar_in');//+19
        this.energy_bar_in.scale.setTo(1.04, 1);
        this.energy_bar = game.add.image(80, 10, 'energyBar');
    },
    update: function(){
        if(this.laser.frame == 9){
            this.laser.visible = false;
            this.laser.alive = false;
        }
        game.physics.arcade.overlap(this.rocket, this.boss, this.rocket_hit_boss, null, this);
        
        //background
        this.background.tilePosition.y += 2;
        
        //movement control
        this.player_control();
        this.rocket_control();
        this.enemy_control();
        this.boss_control();
        
        
        //attack system
        game.physics.arcade.overlap(this.bullet.bullets, this.enemies, this.player_hit_enemy1, null, this);
        game.physics.arcade.overlap(this.rocket, this.enemies, this.rocket_hit_enemy, null, this);
        game.physics.arcade.overlap(this.enemy_bullet, this.player, this.enemy_hit_player, null, this);
        //boss
        game.physics.arcade.overlap(this.bullet.bullets, this.boss, this.player_hit_boss, null, this);
        game.physics.arcade.overlap(this.boss_bullet.bullets, this.player, this.boss_hit_player, null, this);
        //laser
        game.physics.arcade.overlap(this.laser, this.boss, this.laser_hit_boss, null, this);
        game.physics.arcade.overlap(this.laser, this.enemies, this.laser_hit_enemy, null, this);
        //icon
        game.physics.arcade.overlap(this.rocket_icon, this.player, this.player_get_rocket, null, this);
        game.physics.arcade.overlap(this.boss, this.player, this.boss_player_ov, null, this);
        //boundary
        this.boundary_handler();
        //blood
        this.player_energy=(this.player_energy <= PLAYER_ENERGY-0.15)? this.player_energy+0.15 : PLAYER_ENERGY;
        this.energy_bar_in.width = (this.player_energy/PLAYER_ENERGY)*127;

        //blood
        if(this.player.health <= 0 && this.stage != STAGE.PLAYER_DIE && this.stage != STAGE.BOSS_DIE){
            this.stage = STAGE.PLAYER_DIE;
            this.player_lose();
            this.counter = 0;
            
        }
        else if(this.boss.health <= 0 && this.stage != STAGE.PLAYER_DIE && this.stage != STAGE.BOSS_DIE){
            this.stage = STAGE.BOSS_DIE;
            this.health_bar_in.width = 0;
            this.player_win();
            this.counter = 0;
            this.score+=50;
            this.score_txt.text = 'score: ' + this.score;
        }

        //idle stage
        if(this.stage == STAGE.ROUND1){
            this.counter++;
            if(this.counter%230 == 0 && !this.get_rocket){
                this.rocket_icon.visible = true;
            }
            else if(this.counter%230 == 179 && !this.get_rocket){
                this.rocket_icon.visible = false;
                this.rocket_icon.x = game.rnd.integer()%300+80;
                this.rocket_icon.y = game.rnd.integer()%300+80;
            }
            if(this.counter >= 18000) this.counter = 0; 
        }
        else if(this.stage == STAGE.IDLE){
            if(this.counter == 0){
                this.level_txt = game.add.text(game.width/2, 240, 'ROUND2', {font: '20px Orbitron', fill: '#ffffff', backgroundColor: 'rgba(230,20,20)'});
                this.level_txt.anchor.setTo(0.5, 0.5);
            }
            if(this.counter == 210) this.level_txt.destroy();
            else if(this.counter == 610){
                this.stage = STAGE.ROUND2;
                this.counter = 0;
                this.boss.alive = true;
            }
            this.counter++;
        }
        else if(this.stage == STAGE.BOSS_DIE){
            this.counter++;
            if(this.counter == 90){
                score = this.score;
                game.state.start('win');
            }
        }
        else if(this.stage == STAGE.PLAYER_DIE){
            this.counter++;
            if(this.counter == 90){
                game.state.start('lose');
            }
        }
    },
    addEnemy: function(){
        if(this.stage == STAGE.ROUND1 || this.stage == STAGE.ROUND2){
            var enemy_;
            for(var i=0;i<ENEMY1_NUM;i++){
                var enemy_temp = this.enemies.children[i];
                if(enemy_temp.alive == false){
                    enemy_ = enemy_temp;
                    break;
                }
            }
            if(!enemy_){return;}
            var pos = game.rnd.pick([0, 1, 2, 3, 4])*game.width/5+10;
            enemy_.reset(pos, 10);
            enemy_.health = 200;
            enemy_.body.move = true;
            enemy_.frame = 0;
        }
    },
    player_get_rocket: function(){
        if(this.rocket_icon.visible){
            this.sound_effect[4].play();
            this.rocket_icon.kill();
            this.get_rocket = true;
        }
    },
    //control
    rocket_control: function(){
        if(this.stage == STAGE.BOSS_DIE) return;
        if(this.rocket.alive == true){
            if(this.rocket_target != -100){
                var idx = this.rocket_target;
                if(this.rocket_target != -1 && this.enemies.children[idx].alive == false) return;
                var target_x = (idx == -1)? this.boss.x : this.enemies.children[idx].x;
                var target_y = (idx == -1)? this.boss.y : this.enemies.children[idx].y;
                var dis_x = target_x-this.rocket.x;
                var dis_y = target_y-this.rocket.y;

                var len = Math.sqrt(Math.pow(dis_x,2) + Math.pow(dis_y,2));
                this.rocket.angle = (dis_x>=0)?(Math.asin(dis_y/len)*180/Math.PI)-270 : ((Math.asin(dis_y/len)*180/Math.PI)-270)*(-1);
                this.rocket.body.velocity.x = (dis_x/len)*200;
                this.rocket.body.velocity.y = (dis_y/len)*200;
            }
            else{
                this.rocket.angle = 0;
                this.rocket.body.velocity.x = 0;
                this.rocket.body.velocity.y = -200;
            }
        }
    },
    boss_control: function(){
        if(this.stage == STAGE.ROUND2){
            this.boss.body.velocity.y = (this.boss.y >= 80)? 0 : 50;

            var ideal_x = this.player.x;
            var actual_x = this.boss.x;
            var ratio_x = ((350-this.player.y)/game.height)*2.5+1;
            var velocity = ((ideal_x - actual_x)/game.width)*100*ratio_x;
            this.boss.body.velocity.x = velocity;
            this.boss_bullet.fire();
        }
    },
    enemy_control: function(){
        if(this.stage == STAGE.ROUND1 || this.stage == STAGE.ROUND2){
            for (var i = 0; i < ENEMY1_NUM; i++) { 
                var enemy_ = this.enemies.children[i];
                if(enemy_.alive == false){continue;}

                // movement
                var ideal_x = this.player.x - i*10;
                var actual_x = enemy_.x;
                var velocity_ori = enemy_.body.velocity.x;
                var velocity = ((ideal_x - actual_x)/game.width)*140;
                if(this.player.y-100 <= enemy_.y || enemy_.y >= 150){
                    this.enemies_state[i] = (velocity_ori <= 0)? STATE.OUT_L : STATE.OUT_R;
                }
                enemy_.body.velocity.y = 20;
                if(this.enemies_state[i] == STATE.CHASE){
                    enemy_.body.velocity.x = velocity;
                    this.enemy_bullet_period[i]++;
                    if(this.enemy_bullet_period[i] >= ENEMY1_ATT_PERIOD){
                        //enemy shoot
                        var bullet = this.enemy_bullet.getFirstExists(false);
                        if (bullet){
                            bullet.reset(enemy_.x, enemy_.y+8);
                            bullet.body.velocity.y = 200;
                        }
                        this.enemy_bullet_period[i] = 0;
                    }
                }
                else if(this.enemies_state[i] == STATE.OUT_L) enemy_.body.velocity.x = -50 - i*20;
                else if(this.enemies_state[i] == STATE.OUT_R) enemy_.body.velocity.x = 50 + i*20;
            }
        }
    },
    player_control: function(){
        if(this.stage == STAGE.BOSS_DIE) return;
        //move
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -100;
            if(this.player_dir !== DIR.LEFT) this.player.animations.play('player_left');
            this.player_dir = DIR.LEFT;
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 100;
            if(this.player_dir !== DIR.RIGHT) this.player.animations.play('player_right');
            this.player_dir = DIR.RIGHT;
        }
        else if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -100;
            if(this.player_dir !== DIR.FORWARD) this.player.animations.play('player_forward');
            this.player_dir = DIR.FORWARD;
        }
        else if (this.cursors.down.isDown) {
            this.player.body.velocity.y = 100;
            this.player_dir = DIR.BACKWARD;
        }
        else {
            //default
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.animations.stop();
            this.player.frame = 0;
            this.player_dir = DIR.STOP;
        }
        //fire
        if (this.fireButton.isDown){
            if(this.cursors.down.isDown && this.player_energy>=50 && this.rocket.alive == false && this.get_rocket == true){
                this.launch_rocket();
                this.player_energy-=50;
                this.sound_effect[2].stop();
                this.sound_effect[2].play();
            }
            else if(this.player_energy>=0.5){
                this.bullet.fire();
                this.sound_effect[0].play();
                this.player_energy-=0.5;
            }
        }
        else if(this.laserButton.isDown && this.player_energy>=40 && this.laser.alive == false){
            this.player_energy-=40;
            this.sound_effect[5].play();
            this.laser.animations.play('run_laser');
            this.laser.x = this.player.x;
            this.laser.y = this.player.y-120;
            this.laser.visible = true;
            this.laser.alive = true;
        }
    },
    launch_rocket: function(){
        //-100 for Non, -1 for boss.
        var min_dis = 10000;
        var min_i = -100;
        for(var i=0;i<ENEMY1_NUM;i++){
            var enemy_ = this.enemies.children[i];
            if(enemy_.alive == false){continue;}
            var dis = Math.abs(enemy_.x-this.player.x) + Math.abs(enemy_.y-this.player.y);
            if(dis < min_dis){
                min_dis = dis;
                min_i = i;
            }
        }
        min_i = (this.stage == STAGE.ROUND2 && this.boss.y >= 40)? -1 : min_i;//boss priority
        this.rocket_target = min_i;
        this.rocket.alive = true;
        this.rocket.visible = true;
        this.rocket.x = this.player.x;
        this.rocket.y = this.player.y;
        this.rocket.body.velocity.x = 0;
        this.rocket.body.velocity.y = -200;
    },

    //attack
    boss_player_ov: function(){
        this.player.health-=0.1;
        this.health_bar_in.width = (this.player.health/PLAYER_HEALTH)*127;
        game.camera.shake(0.01, 300);
        game.camera.flash(0xffffff, 300);
    },
    boss_hit_player: function( player, bullet ){
        this.sound_effect[3].play();
        bullet.kill();
        player.health-=3;
        this.health_bar_in.width = (player.health/PLAYER_HEALTH)*127;
        var explode = game.add.sprite((bullet.x+player.x)/2, (bullet.y+player.y)/2, 'explode2');
        explode.anchor.setTo(0.5, 0.5);
        explode.animations.add('run_explode2', [0, 1, 2, 3, 4, 5, 6], 18, false);
        explode.animations.play('run_explode2', null, false, true);
        
        game.camera.shake(0.01, 300);
        game.camera.flash(0xffffff, 300);
    },
    rocket_hit_boss: function(rocket, boss){
        if(this.stage == STAGE.ROUND2){
            if(rocket.alive == false) return;
            this.sound_effect[1].play();
            boss.animations.play('boss_hurt');
            boss.health-=20;
            this.emitter2.x = this.boss.x;
            this.emitter2.y = this.boss.y;
            this.emitter2.start(true, 1300, null, 120);
            rocket.alive = false;
            rocket.visible = false;
        }
    },
    player_hit_boss: function(bullet, boss){
        if(this.stage == STAGE.ROUND2){
            this.boss.health-=1;
            this.boss.animations.play('boss_hurt');
        }
    },
    rocket_hit_enemy: function(rocket, enemy){
        if(this.rocket.alive == false) return;
        enemy.health-=200;
        if(enemy.health <= 0){
            this.sound_effect[1].play();
            this.score+=5;
            this.score_txt.text = 'score: ' + this.score;
            var explode = game.add.sprite(enemy.x, enemy.y, 'explode1');
            explode.anchor.setTo(0.5, 0.5);
            explode.animations.add('run_explode1', [0, 1, 2, 3, 4, 5, 6], 18, false);
            explode.animations.play('run_explode1', null, false, true);
            enemy.x = -100;
            enemy.body.move = false;
            //energy refill
            this.player_energy=(this.player_energy <= PLAYER_ENERGY-30)? this.player_energy+30 : PLAYER_ENERGY;
            
            if(this.stage == STAGE.ROUND1){
                if(this.score >= NEXT_STAGE){
                    this.counter = 0;
                    this.stage = STAGE.IDLE;
                    ENEMY1_ATT_PERIOD = 70;
                    ENEMY1_NUM = 2;
                }
            }
        }
        this.emitter1.x = this.rocket.x;
        this.emitter1.y = this.rocket.y;
        this.emitter1.start(true, 800, null, 15);
        this.rocket.alive = false;
        this.rocket.visible = false;
    },
    player_hit_enemy1: function(bullet, enemy){
        if(enemy.alive == false) return;
        enemy.animations.play('enemy_hurt');
        enemy.health-=1;
        if(enemy.health <= 0){
            this.sound_effect[1].play();
            this.score+=5;
            this.score_txt.text = 'score: ' + this.score;
                
            var explode = game.add.sprite(enemy.x, enemy.y, 'explode1');
            explode.anchor.setTo(0.5, 0.5);
            explode.animations.add('run_explode1', [0, 1, 2, 3, 4, 5, 6], 18, false);
            explode.animations.play('run_explode1', null, false, true);
            enemy.x = -100;
            enemy.body.move = false;
            //energy refill
            this.player_energy=(this.player_energy <= PLAYER_ENERGY-30)? this.player_energy+30 : PLAYER_ENERGY;
            
            if(this.stage == STAGE.ROUND1){
                if(this.score >= NEXT_STAGE){
                    this.counter = 0;
                    this.stage = STAGE.IDLE;
                    ENEMY1_ATT_PERIOD = 70;
                    ENEMY1_NUM = 2;
                }
            }
        }
    },
    enemy_hit_player:function(player, bullet){
        this.sound_effect[3].play();
        bullet.kill();
        player.health-=3;
        this.health_bar_in.width = (player.health/PLAYER_HEALTH)*127;
        var explode = game.add.sprite((bullet.x+player.x)/2, (bullet.y+player.y)/2, 'explode2');
        explode.anchor.setTo(0.5, 0.5);
        explode.animations.add('run_explode2', [0, 1, 2, 3, 4, 5, 6], 18, false);
        explode.animations.play('run_explode2', null, false, true);
        
        game.camera.shake(0.01, 300);
        game.camera.flash(0xffffff, 300);
    },
    laser_hit_boss: function(){
        if(this.laser.alive == false) return;
        if(this.stage == STAGE.ROUND2){
            this.boss.health-=3;
            this.boss.animations.play('boss_hurt');
        }
    },
    laser_hit_enemy: function(bullet, enemy){
        if(enemy.alive == false || this.laser.alive == false) return;
        enemy.animations.play('enemy_hurt');
        enemy.health-=5;
        if(enemy.health <= 0){
            this.sound_effect[1].play();
            this.score+=5;
            this.score_txt.text = 'score: ' + this.score;
                
            var explode = game.add.sprite(enemy.x, enemy.y, 'explode1');
            explode.anchor.setTo(0.5, 0.5);
            explode.animations.add('run_explode1', [0, 1, 2, 3, 4, 5, 6], 18, false);
            explode.animations.play('run_explode1', null, false, true);
            enemy.x = -100;
            enemy.body.move = false;
            //energy refill
            this.player_energy=(this.player_energy <= PLAYER_ENERGY-30)? this.player_energy+30 : PLAYER_ENERGY;
            
            if(this.stage == STAGE.ROUND1){
                if(this.score >= NEXT_STAGE){
                    this.counter = 0;
                    this.stage = STAGE.IDLE;
                    ENEMY1_ATT_PERIOD = 70;
                    ENEMY1_NUM = 2;
                }
            }
        }
    },
    boundary_handler: function(){
        //handle outside
        //player is out
        if(this.player.x <= 10){
            this.player.x = 10;
        }
        else if(this.player.x >= 390){
            this.player.x = 390;
        }
        if(this.player.y <= 50){
            this.player.y = 50;
        }
        else if(this.player.y >= 490){
            this.player.y = 490;
        }
        //enemy1 is out
        for (var i = 0; i < 5; i++) { 
            var enemy_ = this.enemies.children[i];
            if(!enemy_){break;}
            if(enemy_.x<0 || enemy_.x>game.width ||enemy_.y>game.height){
                var enemy_ = this.enemies.children[i];
                enemy_.kill();
                enemy_.alive = false;
                this.enemies_state[i] = STATE.CHASE;
            }
        }
        if(this.rocket.x<0 || this.rocket.x>game.width || this.rocket.y < 0 || this.rocket.y > game.height){
            this.rocket.alive = false;
            this.rocket.visible = false;
        }
    },
    player_win: function(){
        if(this.counter == 0){
            game.camera.shake(0.03, 300);
            game.camera.flash(0x00ffff, 600);
        }
        else{
            game.camera.flash(0xffffff, 2800);
        }
    },
    player_lose: function(){
        if(this.counter == 0){
            game.camera.shake(0.03, 300);
            game.camera.flash(0xff0000, 600);
        }
        else{
            game.camera.flash(0xffffff, 2800);
        }
    }
}