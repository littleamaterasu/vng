var MenuLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        var size = cc.winSize;

        var playMenuItem = new cc.MenuItemFont("Play game", this.switchToBackground, this);
        playMenuItem.attr({
            x: size.width / 2,
            y: size.height / 2 + 50
        });

        var scoreMenuItem = new cc.MenuItemFont("View Scores", this.showScores, this);
        scoreMenuItem.attr({
            x: size.width / 2,
            y: size.height / 2 - 50
        });

        var menu = new cc.Menu(playMenuItem, scoreMenuItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        return true;
    },

    switchToBackground: function() {
        cc.LoaderScene.preload(g_maingame, function () {
            cc.director.runScene(new MaingameScene());
        }, this);
    },

    showScores: function() {
        var self = this;

        cc.loader.loadJson("res/scores.json", function(err, data) {
            if (!err) {
                self.showScoresDialog(data);
            } else {
                cc.log("Error loading scores:", err);
            }
        });
    },

    showScoresDialog: function(scores) {
        var dialog = new cc.LayerColor(cc.color(0, 0, 0, 500));
        dialog.setTag(2)
        this.addChild(dialog, 2);

        var size = cc.winSize;

        var titleLabel = new cc.LabelTTF("High Scores", "Arial", 32);
        titleLabel.setPosition(size.width / 2, size.height - 50);
        dialog.addChild(titleLabel);

        scores.sort(function(a, b) {
            return b.score - a.score;
        });

        for (var i = 0; i < scores.length; i++) {
            var scoreLabel = new cc.LabelTTF(scores[i].name + ": " + scores[i].score, "Arial", 24);
            scoreLabel.setPosition(size.width / 2, size.height - 100 - i * 30);
            dialog.addChild(scoreLabel);
        }

        var closeButton = new cc.MenuItemFont("Close", this.closeScoresDialog, this);
        closeButton.setPosition(size.width / 2, 50);

        var closeMenu = new cc.Menu(closeButton);
        closeMenu.setPosition(0, 0);
        dialog.addChild(closeMenu);
    },

    closeScoresDialog: function() {
        this.removeChildByTag(2);
    }
});

var MenuScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
    }
});