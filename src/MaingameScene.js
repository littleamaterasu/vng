var MaingameLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        var size = cc.winSize;

        // Tạo hai sprite background
        this.backgroundSprite1 = new cc.Sprite(res.background_png);
        this.backgroundSprite1.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 1.0
        });
        this.addChild(this.backgroundSprite1, 0);

        this.backgroundSprite2 = new cc.Sprite(res.background_png);
        this.backgroundSprite2.attr({
            x: size.width / 2 + this.backgroundSprite1.width,
            y: size.height / 2,
            scale: 1.0
        });
        this.addChild(this.backgroundSprite2, 0);

        var pauseItem = new cc.MenuItemFont("Pause", this.pauseGame, this);
        pauseItem.attr({
            x: size.width - 50,
            y: size.height - 30
        });

        var menu = new cc.Menu(pauseItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        cc.audioEngine.playMusic(res.marios_way_mp3, true);

        this.schedule(this.moveBackground, 0.01);

        return true;
    },

    moveBackground: function(dt) {
        var speed = 2;

        this.backgroundSprite1.x -= speed;
        this.backgroundSprite2.x -= speed;

        if (this.backgroundSprite1.x <= -this.backgroundSprite1.width / 2) {
            this.backgroundSprite1.x = this.backgroundSprite2.x + this.backgroundSprite2.width;
        }

        if (this.backgroundSprite2.x <= -this.backgroundSprite2.width / 2) {
            this.backgroundSprite2.x = this.backgroundSprite1.x + this.backgroundSprite1.width;
        }
    },

    pauseGame: function() {
        cc.audioEngine.pauseMusic();
        cc.director.pause();

        var pauseLayer = new PauseLayer();
        this.addChild(pauseLayer, 2);
    }
});

var MaingameScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new MaingameLayer();
        this.addChild(layer);
    }
});

var PauseLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        var size = cc.winSize;

        var label = new cc.LabelTTF("Paused", "Arial", 38);
        label.setPosition(size.width / 2, size.height / 2);
        this.addChild(label);

        var resumeButton = new cc.MenuItemFont("Resume", this.resumeGame, this);
        resumeButton.setPosition(size.width / 2, size.height / 2 - 50);

        var mainMenuButton = new cc.MenuItemFont("Main Menu", this.mainMenu, this);
        mainMenuButton.setPosition(size.width / 2, size.height / 2 - 50);

        var menu = new cc.Menu(resumeButton);
        var menu2 = new cc.Menu(mainMenuButton);
        menu2.setPosition(0, -50);
        menu.setPosition(0, 0);
        this.addChild(menu);
        this.addChild(menu2);

        return true;
    },

    resumeGame: function() {

        cc.audioEngine.resumeMusic();
        cc.director.resume();

        this.removeFromParent();
    },

    mainMenu: function() {
         cc.director.resume();
         cc.director.runScene(new MenuScene());
    }
});
