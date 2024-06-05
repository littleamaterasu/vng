var MenuLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
        cc.sys.localStorage.setItem("bestScore", 15);
        var size = cc.winSize;

        var playLabel = new ccui.Text("Play game", res.font_ttf, 32);
        playLabel.setPosition(size.width / 2, size.height / 2 + 50);
        this.addChild(playLabel);
        playLabel.setTouchEnabled(true);
        playLabel.addClickEventListener(() => this.switchToBackground());

        var scoreLabel = new ccui.Text("View Scores", res.font_ttf, 32);
        scoreLabel.setPosition(size.width / 2, size.height / 2 - 50);
        this.addChild(scoreLabel);
        scoreLabel.setTouchEnabled(true);
        scoreLabel.addClickEventListener(() => this.showScores());

        var resetLabel = new ccui.Text("Reset Best Score", res.font_ttf, 32);
        resetLabel.setPosition(size.width / 2, size.height / 2 - 150);
        this.addChild(resetLabel);
        resetLabel.setTouchEnabled(true);
        resetLabel.addClickEventListener(() => this.resetBestScore());

        return true;
    },

    switchToBackground: function() {
        cc.LoaderScene.preload(g_maingame, function() {
            cc.director.runScene(new MaingameScene());
        }, this);
    },

    showScores: function() {
        const bestScore = cc.sys.localStorage.getItem("bestScore") ? cc.sys.localStorage.getItem("bestScore") : 0;
        this.showScoresDialog(bestScore);
    },

    showScoresDialog: function(scores) {
        var dialog = new cc.LayerColor(cc.color(0, 0, 0, 180));
        dialog.setTag(2);
        this.addChild(dialog, 2);

        var size = cc.winSize;

        var titleLabel = new ccui.Text("High Scores", res.font_ttf, 64);
        titleLabel.setPosition(size.width / 2, size.height - 50);
        dialog.addChild(titleLabel);

        var scoreLabel = new ccui.Text(scores, res.font_ttf, 48);
        scoreLabel.setPosition(size.width / 2, size.height - 200);
        dialog.addChild(scoreLabel);

        var medal;
        if (scores >= BRONZE_GAP[0] && scores <= BRONZE_GAP[1]) {
            medal = new cc.Sprite(res.bronze_png);
        } else if (scores >= SILVER_GAP[0] && scores <= SILVER_GAP[1]) {
            medal = new cc.Sprite(res.silver_png);
        } else if (scores >= GOLD_GAP[0]) {
            medal = new cc.Sprite(res.gold_png);
        }

        medal.setScale(MEDAL_SCALE);

        if (medal) {
            medal.setPosition(size.width / 2 + 50, size.height - 200);
            dialog.addChild(medal);
        }

        var closeButton = new ccui.Text("Close", res.font_ttf, 32);
        closeButton.setPosition(size.width / 2, 50);
        dialog.addChild(closeButton);
        closeButton.setTouchEnabled(true);
        closeButton.addClickEventListener(() => this.closeScoresDialog());
    },

    closeScoresDialog: function() {
        this.removeChildByTag(2);
    },

    resetBestScore: function() {
        cc.sys.localStorage.setItem("bestScore", 0);
    }
});

var MenuScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
    }
});
