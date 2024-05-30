var Bird = cc.Sprite.extend({
    ctor: function() {
        this._super(res.bird_png);
        this.ySpeed = 0;
        this.gravity = gravity;
        this.jumpStrength = 4;
        this.state = "FLYING_STRAIGHT";
        this.t = 0;
        this.drawNode = new cc.DrawNode();
        this.addChild(this.drawNode);
        var size = cc.winSize;
        this.attr({
            x: size.width / 2,
            y: size.height / 2
        });

        this.scheduleUpdate();
    },

    update: function(dt) {

        switch (this.state) {
            case "FLYING_STRAIGHT":
                break;
            case "JUMPING":
                this.ySpeed = 2 * this.jumpStrength;
                this.state = "FALLING";
                break;
            case "FALLING":
                this.ySpeed += 2 * this.gravity * dt;
                break;
            case "DEAD":
                this.ySpeed = 0;
                break;
            /*
            case "SKILL1":
                break;
            case "SKILL2":
                break;
            */
        }

        this.y += this.ySpeed;

        if (this.y < 0) {
            this.y = 0;
        }

        if (this.y > cc.winSize.height) {
            this.y = cc.winSize.height;
        }

        this.drawBoundingBox();
    },

    jump: function() {
        if (this.state !== "DEAD") {
            this.state = "JUMPING";
        }
    },

    die: function() {
        this.state = "DEAD";
    },

    getBoundingBox: function() {
        var rect = this._super();

        rect.width -= 5;
        rect.height -= 5;

        rect.x += 10;
        return rect;
    },

    drawBoundingBox: function() {
        var boundingBox = this.getBoundingBox();
        this.drawNode.clear();
        this.drawNode.drawRect(cc.p(boundingBox.x, 0), cc.p(boundingBox.width, boundingBox.height), null, 1, cc.color(255, 0, 0, 255));
    },
});
