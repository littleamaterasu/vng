var MaingameLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

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
        // background thứ 2 sẽ nối liền với b1
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
        // ground 2 sẽ nối liền ground 1
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
                if(this.bird.state === state.JUMPING
                || this.bird.state === state.FLYING_STRAIGHT
                || this.bird.state === state.FALLING) this.bird.jump();
                break;
            case cc.KEY.q:
                if(this.bird.cooldownSkill1 <= 0){
                    //Cast skill 1
                    this.bird.skill1();

                    // Hiện cooldown
                    this.cooldownLabel.setString("Dash: 3s");

                    //Tốc độ của các vật khác sẽ được amplify
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
                if(this.bird.cooldownSkill2 <= 0){

                    this.bird.skill2();

                    this.cooldownLabel2.setString("Power: 10s");

                    this.schedule(this.updatecooldownSkill2, 1, COOLDOWN_SKILL_2 + 1 , 0);
                }
                break;
        }
    },

    // speed của bg và g, speed của ống
    setAllSpeed: function (speed) {
        this.speed = speed;
        this.pipeLayer.setPipeSpeed(this.speed);
    },

// Tìm vị trí gần hình tròn nhất
    checkIndividualCollision: function (c, r, radius){
        // c là hình tròn, r là hình chữ nhật

        // Tìm điểm gần tâm hình tròn nhất trên hình chữ nhật

        // Chiếu tâm đuòng tròn xuống một cạnh theo Oy
        // Nếu điểm đó
        //              .
        //              |
        // _____________|____________
        // |             (X, Y)     |
        // |                        |
        // |                        |
        // |                        |
        // |                        |
        // |                        |
        // |                        |
        // |                        |
        // |                        |
        // |________________________|
        var Y = Math.min(Math.max(c.y, r.y), r.y + r.height);

        // Chiếu tâm đường tròn xuống một cạnh theo Ox
        // Nếu điểm đó thuộc cạnh đó thì X của của điểm gần nhất sẽ là X của hình chiếu
        // Nếu không X của điểm gần nhất sẽ là một trong 2 điểm của đoạn thẳng
        var X = Math.min(Math.max(c.x, r.x), r.x + r.width);

        var dX = c.x - X;
        var dY = c.y - Y;

        if(dX * dX + dY * dY <= radius * radius) return true;

        return false;
    },

    checkCollisions: function() {

        // Check rơi xuống đất
        if(this.bird.y <= GROUND_DEAD_GAP){
             this.endGame();
             return;
        }

        // check với ống ở vị trí có thể va chạm
        for(var i = 0; i <= 1; i ++){
            var pipe = this.pipeLayer.pipes[this.pipeLayer.currentIndex + i];
            if (pipe && this.checkIndividualCollision(this.bird.getPosition(), pipe.getBoundingBox(), this.bird.radius)) {
                if(this.bird.onSkill2){
                    pipe.broken = true;
                }
                else{
                    this.endGame();
                    return;
                }
            }
        }
    },


    endGame: function (){
        this.bird.die();
        this.pauseGame(true);
    },

    // Pause sẽ có 1 biến để xác nhận dừng khi chết hay dừng khi bấm nút dừng
    pauseGame: function(lost) {
        // nếu đã hiện pause menu thì không hiện nữa
        if(this.getChildByTag(1) !== null){
            return;
        }

        // nếu dừng do thua thì sẽ không dừng game ngay mà cho chim rơi 1 lần
        // dừng ống và bg và ground trước
        if(lost){
            this.unscheduleUpdate();
            this.pipeLayer.unscheduleUpdate();
        }

        setTimeout(() => {
        // khi thua mới đổi vị trí score và có thể hiện một banner new bes score ở góc trên bên phải
            if(lost) {
                var newBestScoreBanner = ccui.Text("New\nBest Score", res.flappy_ttf, 14);
                if(this.scoreLayer.score > cc.sys.localStorage.getItem("bestScore")){
                    cc.sys.localStorage.setItem("bestScore", this.scoreLayer.score);
                    newBestScoreBanner.setRotation(45);
                    newBestScoreBanner.setPosition(WINDOW_X / 2 + 90, WINDOW_Y / 2 + 90)
                    this.addChild(newBestScoreBanner, 3);
                }
                else{
                    this.removeChild(newBestScoreBanner);
                }

                var medal;
                if (this.scoreLayer.score >= BRONZE_GAP[0] && this.scoreLayer.score <= BRONZE_GAP[1]) {
                    medal = new cc.Sprite(res.bronze_png);
                } else if (this.scoreLayer.score >= SILVER_GAP[0] && this.scoreLayer.score <= SILVER_GAP[1]) {
                    medal = new cc.Sprite(res.silver_png);
                } else if (this.scoreLayer.score >= GOLD_GAP[0]) {
                    medal = new cc.Sprite(res.gold_png);
                }

                // Nếu đạt huy chương thì thực hiện đặt huy chương vào
                if (medal) {
                    medal.setScale(MEDAL_SCALE);
                    medal.setPosition(cc.p(WINDOW_X / 2, WINDOW_Y / 3 * 2 + 50))
                    this.scoreLayer.addChild(medal)
                }

                // vị trí mới của score
                this.scoreLayer.newPosition(WINDOW_X / 2, WINDOW_Y / 3 * 2)
            }

            // game thực sự dừng
            cc.audioEngine.pauseMusic();
            cc.director.pause();
            var pauseLayer = new PauseLayer(lost);
            pauseLayer.setTag(1);
            this.addChild(pauseLayer, 4);
        // nếu thua thì khoảng delay 1s trước khi hiện pause menu
        }, lost ? 1000 : 0)

    },

// Kiểm tra điểm
    checkScore: function() {
        var pipe = this.pipeLayer.pipes[this.pipeLayer.currentIndex];
        if (!pipe.scored && pipe.getPositionX() + pipe.width < this.bird.getPositionX()) {
            pipe.scored = true;
            this.scoreLayer.incrementScore();
            cc.audioEngine.playEffect(res.score_mp3, false);
        }
    },

// Countdowm
    updateCountdown: function() {
        this.countdown--;
        this.countdownLabel.setString(this.countdown.toString());

        if (this.countdown <= 0 || this.bird.state !== state.FLYING_STRAIGHT) {
            if(this.bird.state === state.FLYING_STRAIGHT) this.bird.state = state.FALLING;
            this.countdownLabel.setString("");
            this.unschedule(this.updateCountdown);
        }
    },

// Cooldown
    updateCooldown: function () {

        this.bird.cooldownSkill1 = Math.max(0, this.bird.cooldownSkill1 - 1);
        this.cooldownLabel.setString("Dash: " + (this.bird.cooldownSkill1).toString() + "s");
        if(this.bird.cooldownSkill1 <= 0){
            this.cooldownLabel.setString("Dash (press Q): OK");
            this.unschedule(this.updateCooldown);
        }
    },

    updatecooldownSkill2: function () {

        this.bird.cooldownSkill2 = Math.max(0, this.bird.cooldownSkill2 - 1);
        this.cooldownLabel2.setString("Power: " + (this.bird.cooldownSkill2).toString() + "s");
        if(this.bird.cooldownSkill2 <= 0){
            this.cooldownLabel2.setString("Power (press E): OK");
            this.unschedule(this.updatecooldownSkill2);
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

        this.pipeLayer.middleGap = Math.min(this.scoreLayer.score / 10 * 5 + MIDDLE_GAP, 100);
        this.pipeLayer.pipeSpeed = Math.min((this.scoreLayer.score / 100 + 1), 2) * this.speed;

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


