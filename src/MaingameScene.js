var MaingameLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
        // this.drawNode = new cc.DrawNode();
        // this.addChild(this.drawNode, 10);
        this.speed = BASE_SPEED;
        var size = cc.winSize;

// Thêm background
        this.backgroundSprite1 = new cc.Sprite(res.background_png);
        this.backgroundSprite1.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 2.0
        });
        this.addChild(this.backgroundSprite1, 0);

        this.backgroundSprite2 = new cc.Sprite(res.background_png);
        this.backgroundSprite2.attr({
            x: size.width / 2 + this.backgroundSprite1.width,
            y: size.height / 2,
            scale: 2.0
        });
        this.addChild(this.backgroundSprite2, 0);

        this.ground1 = new cc.Sprite(res.ground_png);
        this.ground1.attr({
             x: size.width / 2,
             y: 5,
             scale: 1.0
        });
        this.addChild(this.ground1, 3);

        this.ground2 = new cc.Sprite(res.ground_png);
        this.ground2.attr({
            x: size.width / 2 + this.ground1.width,
            y: 5,
            scale: 1.0
        })
        this.addChild(this.ground2, 3);

// Pause Button
        var pauseLabel = new ccui.Text("Pause", res.flappy_ttf, 32);
        pauseLabel.setPosition(cc.p(size.width - 50, size.height - 30));
        this.addChild(pauseLabel, 2);

        pauseLabel.setTouchEnabled(true);
        pauseLabel.addClickEventListener(() => {
            this.pauseGame(false);
        });


// Thêm nhạc
        cc.audioEngine.playMusic(res.marios_way_mp3, true);

// Thêm PipeLayer
        this.pipeLayer = new PipeLayer(this.speed);
        this.addChild(this.pipeLayer, 1);

// Thêm chim
        this.bird = new Bird();
        this.addChild(this.bird, 2);

// Thêm ScoreLayer
        this.scoreLayer = new ScoreLayer();
        this.addChild(this.scoreLayer, 2);

// Bắt sự kiện bàn phím
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.onKeyPressed.bind(this)
        }, this);

// Thêm Countdown
        this.countdown = 5;

        this.countdownLabel = new ccui.Text("5", res.flappy_ttf, 48);
        this.countdownLabel.setPosition(size.width / 2, size.height / 4 * 3);
        this.addChild(this.countdownLabel, 10);
        this.schedule(this.updateCountdown, 1, this.countdown, 1);

        this.cooldownLabel = new ccui.Text("Dash (press Q): OK", res.font_ttf, 32);
        this.cooldownLabel.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);
        this.cooldownLabel.setAnchorPoint(1, 0.5); // Anchor point to the right-center
        this.cooldownLabel.setPosition(1040, size.height / 3 * 2);
        this.addChild(this.cooldownLabel, 3);

        this.cooldownLabel2 = new ccui.Text("Power (press E): OK", res.font_ttf, 32);
        this.cooldownLabel2.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);
        this.cooldownLabel2.setAnchorPoint(1, 0.5); // Anchor point to the right-center
        this.cooldownLabel2.setPosition(1040, size.height / 3 * 2 - 50);
        this.addChild(this.cooldownLabel2, 3);



        this.scheduleUpdate();

        return true;
    },

// Hàm cho Listener
    onKeyPressed: function(keyCode, event) {
        switch (keyCode){
            case cc.KEY.space:
                if(this.bird.state === "JUMPING"
                || this.bird.state === "FLYING_STRAIGHT"
                || this.bird.state === "FALLING") this.bird.jump();
                break;
            case cc.KEY.q:
                if(this.bird.cooldown1 <= 0){
                    //Cast skill 1
                    this.bird.skill1();

                    this.cooldownLabel.setString("Dash: 3s");

                    //Tốc độ sẽ được amplify
                    this.setAllSpeed(this.speed * DASH_AMPLIFY);

                    //Sau khi hết thời gian dash thì vận tốc quay lại như cũ
                    setTimeout(() => {
                        this.setAllSpeed(BASE_SPEED);
                        },DASH_DURATION);

                    //Đếm ngược skill 1
                    this.schedule(this.updateCooldown, 1, COOLDOWN_SKILL_1 + 1 , 0);
                }
                break;
            case cc.KEY.e:
                if(this.bird.cooldown2 <= 0){
                    this.bird.skill2();

                    this.cooldownLabel2.setString("Power: 10s");

                    this.schedule(this.updateCooldown2, 1, COOLDOWN_SKILL_2 + 1 , 0);
                }
                break;
        }
    },

    setAllSpeed: function (speed) {
        this.speed = speed;
        this.pipeLayer.setPipeSpeed(this.speed);
    },

// Tìm vị trí gần hình tròn nhất
    checkIndividualCollision: function (c, r, radius){
        var Y = Math.min(Math.max(c.y, r.y), r.y + r.height);
        var X = Math.min(Math.max(c.x, r.x), r.x + r.width);

        var dX = c.x - X;
        var dY = c.y - Y;

        if(dX * dX + dY * dY <= radius * radius) return true;

        return false;
    },

// Collision là các hình chữ nhật
    checkCollisions: function() {

//        if(this.bird.y <= 15){
//                this.endGame();
//                return;
//            }

            var pipe = this.pipeLayer.pipes[this.pipeLayer.currentIndex];
            if (pipe && this.checkIndividualCollision(this.bird.getPosition(), pipe.getBoundingBox(), this.bird.radius)) {
                if(this.bird.onSkill1 || this.bird.onSkill2){
                    pipe.broken = true;
                }
//                else{
//                    this.endGame();
//                    return;
//                }
            }
            pipe = this.pipeLayer.pipes[this.pipeLayer.currentIndex + 1];
            if (pipe && this.checkIndividualCollision(this.bird.getPosition(), pipe.getBoundingBox(), this.bird.radius)) {
                if(this.bird.onSkill1 || this.bird.onSkill2){
                    pipe.broken = true;
                }
//                else{
//                    this.endGame();
//                }
            }
    },

    endGame: function (){
        this.bird.die();

        this.pauseGame(true);
    },

// Kiểm tra điểm
    checkScore: function() {
        for (var i = 0; i < this.pipeLayer.pipes.length; i++) {
            var pipe = this.pipeLayer.pipes[i];

            if (!pipe.scored && pipe.getPositionX() + pipe.width / 2 < this.bird.getPositionX()) {
                pipe.scored = true;
                this.scoreLayer.incrementScore();
                cc.audioEngine.playEffect(res.score_mp3, false);
            }
        }
    },

// Pause
    pauseGame: function(lost) {

        if(this.getChildByTag(1) !== null){
            return;
        }

        if(lost){
            this.unscheduleUpdate();
            this.pipeLayer.unscheduleUpdate();
        }

        setTimeout(() => {
        // khi thua mới đổi vị trí score
        if(lost) {
            var newBestScoreBanner = ccui.Text("New\nBest Score", res.flappy_ttf, 14);
                if(this.scoreLayer.score / 2 > cc.sys.localStorage.getItem("bestScore")){
                    cc.sys.localStorage.setItem("bestScore", this.scoreLayer.score / 2);
                    newBestScoreBanner.setRotation(45);
                    newBestScoreBanner.setPosition(WINDOW_X / 2 + 90, WINDOW_Y / 2 + 90)
                    this.addChild(newBestScoreBanner, 3);
                }
                else{
                    this.removeChild(newBestScoreBanner);
                }
                this.scoreLayer.newPosition(WINDOW_X / 2, WINDOW_Y / 3 * 2)
            }

            // pause thì dừng nhạc, dừng game,
            // và hiện pause menu với giá trị lost thể hiện đã thua hay không
            cc.audioEngine.pauseMusic();
            cc.director.pause();
            var pauseLayer = new PauseLayer(lost);
            pauseLayer.setTag(1);
            this.addChild(pauseLayer, 4);
        }, lost ? 1000 : 0)

    },

// Countdowm
    updateCountdown: function() {
        this.countdown--;
        this.countdownLabel.setString(this.countdown.toString());

        if (this.countdown <= 0 || this.bird.state !== "FLYING_STRAIGHT") {
            if(this.bird.state === "FLYING_STRAIGHT") this.bird.state = "FALLING";
            this.countdownLabel.setString("");
            this.unschedule(this.updateCountdown);
        }
    },

// Cooldown
    updateCooldown: function () {

        this.bird.cooldown1 = Math.max(0, this.bird.cooldown1 - 1);
        this.cooldownLabel.setString("Dash: " + (this.bird.cooldown1).toString() + "s");
        if(this.bird.cooldown1 <= 0){
            this.cooldownLabel.setString("Dash (press Q): OK");
            this.unschedule(this.updateCooldown);
        }
    },

    updateCooldown2: function () {

        this.bird.cooldown2 = Math.max(0, this.bird.cooldown2 - 1);
        this.cooldownLabel2.setString("Power: " + (this.bird.cooldown2).toString() + "s");
        if(this.bird.cooldown2 <= 0){
            this.cooldownLabel2.setString("Power (press E): OK");
            this.unschedule(this.updateCooldown2);
        }
    },

// Vẽ Bounding
   drawBoundingBox: function() {
        this.drawNode.clear();
        this.pipeLayer.pipes.forEach(pipe => {
            this.drawNode.drawRect(
                cc.p(pipe.getBoundingBox().x,
                pipe.getBoundingBox().y),
                cc.p(pipe.width + pipe.getBoundingBox().x,
                    pipe.height + pipe.getBoundingBox().y),
                null,
                1,
                cc.color(255, 0, 0, 255))
        })

       this.drawNode.drawCircle(
           this.bird.getPosition(),
           15.5,
           0,
           50,
           false,
           1,
           cc.color(255, 0, 0, 255))
   },

// Update kiểm tra Điểm và Va chạm, di chuyển background
    update: function(dt) {
       // this.drawBoundingBox();
        if(this.getChildByTag(1) !== null) return;

        this.checkCollisions();
        this.checkScore();

        this.pipeLayer.middleGap = Math.min(this.scoreLayer.score / 10 * 5 + MIDDLE_GAP, 100 );

        this.backgroundSprite1.x -= this.speed / 2 * dt;
        this.backgroundSprite2.x -= this.speed / 2 * dt;

        this.ground1.x -= this.speed * dt;
        this.ground2.x -= this.speed * dt;

        if (this.backgroundSprite1.x <= -this.backgroundSprite1.width / 2) {
            this.backgroundSprite1.x = this.backgroundSprite2.x + this.backgroundSprite2.width;
        }

        if (this.backgroundSprite2.x <= -this.backgroundSprite2.width / 2) {
            this.backgroundSprite2.x = this.backgroundSprite1.x + this.backgroundSprite1.width;
        }

        if (this.ground1.x <= -this.ground1.width / 2) {
            this.ground1.x = this.ground2.x + this.ground2.width;
        }

        if (this.ground2.x <= -this.ground2.width / 2) {
            this.ground2.x = this.ground1.x + this.ground1.width;
        }
    },
});

var MaingameScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new MaingameLayer();
        this.addChild(layer);
    }
});


