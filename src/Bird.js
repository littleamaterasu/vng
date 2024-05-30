var Bird = cc.Sprite.extend({
    ctor: function() {
        this._super(res.bird_png);
        this.ySpeed = 0;
        this.gravity = GRAVITY;
        this.jumpStrength = JUMP_STRENGTH;
        this.state = "FLYING_STRAIGHT";
        this.angle = 0;
        this.radius = this.height / 2;
        this.cooldown1 = 0;
        this.cooldown2 = 0;

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
                this.ySpeed = this.jumpStrength;
                this.angle = MAX_UP_ANGLE;
                this.setRotation(this.angle);
                this.state = "FALLING";
                break;
            case "FALLING":

                this.ySpeed += this.gravity * dt;
                this.angle = Math.min(MAX_DOWN_ANGLE, this.angle + TURN_RATE * dt);
                this.setRotation(this.angle)
                break;
            case "DEAD":
                this.ySpeed = 0;
                break;
            case "SKILL1":
                this.ySpeed = 0;
                break;
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

    skill1: function () {
        this.state = "SKILL1";
        this.cooldown1 = COOLDOWN_SKILL_1;
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
