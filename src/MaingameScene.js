var MaingameLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
        this.drawNode = new cc.DrawNode();
        this.addChild(this.drawNode, 10);
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
        this.pipeLayer = new PipeLayer();
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

        this.countdownLabel = new cc.LabelTTF("5", res.flappy_ttf, 48);
        this.countdownLabel.setPosition(size.width / 2, size.height / 4 * 3);
        this.addChild(this.countdownLabel, 10);
        this.schedule(this.updateCountdown, 1, this.countdown, 1);

        this.scheduleUpdate();

        return true;
    },

// Hàm cho Listener
    onKeyPressed: function(keyCode, event) {
        if (keyCode === cc.KEY.space) {
            this.bird.jump();
        }
    },

// Collision là các hình chữ nhật
    checkCollisions: function() {
//        if(cc.rectIntersectsRect(this.bird.getBoundingBox(), this.ground1.getBoundingBox())
//            || cc.rectIntersectsRect(this.bird.getBoundingBox(), this.ground2.getBoundingBox())){
//                this.bird.die();
//                this.pauseGame(true);
//                this.writeScore();
//                return;
//            }
//
//        for (var i = 0; i < 6; i += 2) {
//            var pipe = this.pipeLayer.pipes[i];
//            if (pipe && cc.rectIntersectsRect(this.bird.getBoundingBox(), pipe.getBoundingBox())) {
//                this.bird.die();
//                this.pauseGame(true);
//                this.writeScore();
//                break;
//            }
//            pipe = this.pipeLayer.pipes[i + 1];
//            if (pipe && cc.rectIntersectsRect(this.bird.getBoundingBox(), pipe.getBoundingBox())) {
//                this.bird.die();
//                this.pauseGame(true);
//                this.writeScore();
//                break;
//            }
//        }
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

        if(this.getChildByTag('paused') !== null){
            return;
        }

        cc.audioEngine.pauseMusic();
        cc.director.pause();
        var pauseLayer = new PauseLayer(lost);
        pauseLayer.setTag('paused');
        this.addChild(pauseLayer, 4);
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
// Vẽ Bounding chim
//    drawBoundingBox: function() {
//        var boundingBox = this.bird.getBoundingBox();
//        this.drawNode.clear();
//        this.drawNode.drawRect(cc.p(boundingBox.x, boundingBox.y), cc.p(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height), null, 1, cc.color(255, 0, 0, 255));
//    },
// Update kiểm tra Điểm và Va chạm, di chuyển background
    update: function(dt) {
//        this.drawBoundingBox();

        if(this.getChildByTag('paused') !== null) return;

        this.checkCollisions();
        this.checkScore();

        this.backgroundSprite1.x -= speed / 2 * dt;
        this.backgroundSprite2.x -= speed / 2 * dt;

        this.ground1.x -= speed * dt;
        this.ground2.x -= speed * dt;

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

cc.game.onStart = function() {
    cc.LoaderScene.preload(g_maingame, function() {
        cc.director.runScene(new MaingameScene());
    }, this);
};
cc.game.run();
