var PauseLayer = cc.Layer.extend({
    ctor: function(lost) {
        this._super();
        this.lost = lost;

        var size = cc.winSize;

        var resumeButton = new cc.MenuItemFont(this.lost ? "Retry" : "Resume", this.resumeGame, this);
        resumeButton.setPosition(size.width / 2, size.height / 2);

        var menu = new cc.Menu(resumeButton);
        menu.setPosition(0, 0);
        this.addChild(menu);

        // Thêm nút quay lại main menu
        var mainMenuButton = new cc.MenuItemFont("Main Menu", this.gotoMainMenu, this);
        mainMenuButton.setPosition(size.width / 2, size.height / 2 - 50);

        var menu2 = new cc.Menu(mainMenuButton);
        menu2.setPosition(0, 0);
        this.addChild(menu2);

        return true;
    },

    resumeGame: function() {
        cc.director.resume();

        if(this.lost) {
            cc.director.resume();
            cc.LoaderScene.preload(g_maingame, function() {
                cc.director.runScene(new MaingameScene());
            }, this);
            return;
        }

        cc.audioEngine.resumeMusic();
        this.removeFromParent();
    },

    gotoMainMenu: function() {
        cc.director.resume();
        cc.LoaderScene.preload(g_mainmenu, function () {
            cc.director.runScene(new MenuScene());
        }, this);
    }
});
