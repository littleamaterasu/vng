var Bird = cc.Sprite.extend({
    ctor: function() {
        this._super(res.bird_png);
        this.ySpeed = 0;
        this.gravity = gravity;
        this.jumpStrength = 4;
        this.state = "FLYING_STRAIGHT";
        this.angle = 0;

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
                this.angle = -45;
                this.setRotation(this.angle);
                this.state = "FALLING";
                break;
            case "FALLING":
                this.ySpeed += 2 * this.gravity * dt;
                this.angle = Math.min(90, this.angle + 135 * dt);
                this.setRotation(this.angle)
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

        rect.width -= 2;
        rect.height -= 2;

        rect.x += 1;
        rect.y += 1;
        return rect;
    },
});
