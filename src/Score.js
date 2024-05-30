var ScoreLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        var size = cc.winSize;

        this.score = 0;

        this.label = new cc.LabelTTF("Score: 0", "Arial", 24);
        this.label.setPosition(100, size.height - 30);
        this.addChild(this.label);

        return true;
    },

    incrementScore: function() {
        this.score++;
        this.label.setString("Score: " + this.score / 2);
    }
});
