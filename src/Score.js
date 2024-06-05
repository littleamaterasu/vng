var ScoreLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        var size = cc.winSize;

        this.score = 0;

        this.label = new ccui.Text("Score: 0", res.flappy_ttf, 24);
        this.label.setPosition(100, size.height - 30);
        this.label1 = new ccui.Text("Best score: " + (cc.sys.localStorage.getItem("bestScore") ? cc.sys.localStorage.getItem("bestScore") : 0), res.flappy_ttf, 24);
        this.label1.setPosition(100, size.height - 60);
        this.addChild(this.label);
        this.addChild(this.label1);

        return true;
    },

    newPosition :function (x, y){
        this.label.setPosition(x, y);
        this.label1.setPosition(x, y-30);
    },

    incrementScore: function() {
        this.score++;
        this.label.setString("Score: " + this.score);
    }
});
