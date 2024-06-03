var PauseLayer = cc.Layer.extend({
    ctor: function(lost) {
        this._super();
        this.lost = lost;

        var size = cc.winSize;

        var resumeLabel = new ccui.Text(this.lost ? "Retry" : "Resume", res.flappy_ttf, 32);
        resumeLabel.setPosition(size.width / 2, size.height / 2);
        this.addChild(resumeLabel);

        resumeLabel.setTouchEnabled(true);
        resumeLabel.addClickEventListener(() => this.resumeGame());

        // Add main menu button
        var mainMenuLabel = new ccui.Text("Main Menu", res.flappy_ttf, 32);
        mainMenuLabel.setPosition(size.width / 2, size.height / 2 - 50);
        this.addChild(mainMenuLabel);

        mainMenuLabel.setTouchEnabled(true);
        mainMenuLabel.addClickEventListener(() => this.gotoMainMenu());

        return true;
    },

    resumeGame: function() {
        cc.director.resume();

        if(this.lost) {
            cc.director.resume();
            cc.LoaderScene.preload(g_maingame, () => {
                cc.director.runScene(new MaingameScene());
            }, this);
            return;
        }

        cc.audioEngine.resumeMusic();
        this.removeFromParent();
    },

    gotoMainMenu: function() {
        cc.director.resume();
        cc.LoaderScene.preload(g_mainmenu, () => {
            cc.director.runScene(new MenuScene());
        }, this);
    }
});
