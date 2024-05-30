var MaingameLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        this.drawNode = new cc.DrawNode();
        this.addChild(this.drawNode, 10);

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
        this.addChild(this.ground1, 2);

        this.ground2 = new cc.Sprite(res.ground_png);
        this.ground2.attr({
            x: size.width / 2 + this.ground1.width,
            y: 5,
            scale: 1.0
        })
        this.addChild(this.ground2, 2);

// Pause Button
        var pauseItem = new cc.MenuItemFont("Pause", () => this.pauseGame(false), this);
        pauseItem.attr({
            x: size.width - 50,
            y: size.height - 30
        });

        var menu = new cc.Menu(pauseItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 2);

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

        this.cooldownLabel = new ccui.Text("Skill 1: OK", res.flappy_ttf, 48);
        this.cooldownLabel.setPosition(size.width / 3, size.height / 7 * 6);
        this.addChild(this.cooldownLabel, 10);

        this.scheduleUpdate();

        return true;
    },

// Hiện cooldown


// Hàm cho Listener
    onKeyPressed: function(keyCode, event) {
        switch (keyCode){
            case cc.KEY.space:
                if(this.bird.state === "JUMPING" || this.bird.state === "FLYING_STRAIGHT" || this.bird.state === "FALLING") this.bird.jump();
                break;
            case cc.KEY.z:
                if(this.bird.cooldown1 <= 0){
                    this.setAllSpeed(this.speed * DASH_AMPLIFY);
                    this.cooldownLabel.setString("Skill 1: " + COOLDOWN_SKILL_1.toString());
                    this.schedule(this.updateCooldown, 1, COOLDOWN_SKILL_1 + 1 , 0);
                    this.bird.skill1();
                    setTimeout(() => this.setAllSpeed(BASE_SPEED),DASH_DURATION);
                }
                break;
        }
    },

    setAllSpeed: function (speed) {
        this.speed = speed;
        this.pipeLayer.setPipeSpeed(this.speed);
        this.bird.state = "FALLING";
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
        if(this.bird.state === "SKILL2" || this.bird.state === "SKILL1") return;

        if(this.checkIndividualCollision(this.bird.getPosition(), this.ground1.getBoundingBox(), this.bird.radius)
           || this.checkIndividualCollision(this.bird.getPosition(), this.ground2.getBoundingBox(), this.bird.radius)){
               this.bird.die();
               this.pauseGame(true);
               this.writeScore();
               return;
           }

        for (var i = 0; i < 10; i += 2) {
           var pipe = this.pipeLayer.pipes[i];
           if (pipe && this.checkIndividualCollision(this.bird.getPosition(), pipe.getBoundingBox(), this.bird.radius)) {
               this.bird.die();
               this.pauseGame(true);
               this.writeScore();
               break;
           }
           pipe = this.pipeLayer.pipes[i + 1];
           if (pipe && this.checkIndividualCollision(this.bird.getPosition(), pipe.getBoundingBox(), this.bird.radius)) {
               this.bird.die();
               this.pauseGame(true);
               this.writeScore();
               break;
           }
       }
    },

// Kiểm tra điểm
    checkScore: function() {
        for (var i = 0; i < this.pipeLayer.pipes.length; i++) {
            var pipe = this.pipeLayer.pipes[i];

            if (!pipe.scored && pipe.getPositionX() + pipe.width / 2 < this.bird.getPositionX()) {
                pipe.scored = true;
                this.scoreLayer.incrementScore();
            }
        }
    },

// Pause
    pauseGame: function(lost) {

        if(this.getChildByTag(1) !== null){
            return;
        }

        cc.audioEngine.pauseMusic();
        cc.director.pause();
        var pauseLayer = new PauseLayer(lost);
        pauseLayer.setTag(1);
        this.addChild(pauseLayer, 4);
    },

// Countdowm
    updateCountdown: function() {
        this.countdown--;
        this.countdownLabel.setString(this.countdown.toString());

        if (this.countdown <= 0) {
            if(this.bird.state === "FLYING_STRAIGHT") this.bird.state = "FALLING";
            this.countdownLabel.setString("");
            this.unschedule(this.updateCountdown);
        }
    },

// Cooldown
    updateCooldown: function () {

        this.bird.cooldown1 = Math.max(0, this.bird.cooldown1 - 1);
        this.cooldownLabel.setString("Skill 1: " + (this.bird.cooldown1).toString());
        if(this.bird.cooldown1 <= 0){
            this.cooldownLabel.setString("Skill 1: OK");
            this.unschedule(this.updateCooldown);
        }
    },

// Write Score
    writeScore: function() {
        var self = this;
        var scores = [];
        cc.loader.loadJson("res/scores.json", function(err, data) {
            if (!err) {
                var scores = data;
                // Thực hiện các thao tác liên quan đến dữ liệu ở đây, ví dụ:
                cc.log("Scores loaded:", scores);
            } else {
                cc.log("Error loading scores:", err);
            }
        });

        scores.push(this.scoreLayer.score);

        scores.sort((a, b) => {
            return a - b;
        });

        if(scores.length > 10){
            scores.shift();
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

        // this.checkCollisions();
        this.checkScore();

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


