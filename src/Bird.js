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
        this.onSkill1 = false;
        this.onSkill2 = false;

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
                this.state = "FALLING";
                break;
            case "FALLING":
                this.ySpeed += this.gravity * dt;
                this.angle = Math.min(MAX_DOWN_ANGLE, this.angle + TURN_RATE * dt);
                this.setRotation(this.angle)
                break;
            case "DEAD":
                this.ySpeed += this.gravity * dt;
                this.angle = Math.min(MAX_DOWN_ANGLE, this.angle + TURN_RATE * dt);
                this.setRotation(this.angle)
                break;
            default:
                this.ySpeed = 0;
                break;
        }

        this.y += this.ySpeed;

        if (this.y < 0) {
            this.y = 0;
        }

        if (this.y > cc.winSize.height) {
            this.state = "FALLING";
            this.y = cc.winSize.height;
        }

    },

    jump: function() {
        if (this.state !== "DEAD") {
            cc.audioEngine.playEffect(res.jump_wav, false);
            this.ySpeed = this.jumpStrength;
            this.angle = MAX_UP_ANGLE;
            this.runAction(cc.rotateTo(0.5, this.angle));
            this.state = "JUMPING";
        }
    },

    die: function() {
        this.gravity *= 2;
        this.jump();
        this.state = "DEAD";
        cc.audioEngine.playEffect(res.hurt_wav, false);
    },

    skill1: function () {
        if(this.state === "DEAD") return;

        cc.audioEngine.playEffect(res.explosion_wav, false);
        this.onSkill1 = true;
        this.state = "OTHERS";
        setTimeout(() => {
            this.onSkill1 = false;
            this.state = "FALLING";
        }, DASH_DURATION);
        this.cooldown1 = COOLDOWN_SKILL_1;
    },

    skill2: function () {
        // Kiểm tra nếu hành động đã chạy thì không chạy lại
        if (this.onSkill2) return;
        this.cooldown2 = COOLDOWN_SKILL_2;

        // Đánh dấu rằng hành động đã bắt đầu
        this.onSkill2 = true;

        // Thay this.node bằng đối tượng bạn muốn thay đổi kích thước
        var target = this;

        // Tăng độ to lên 5.0 trong 0.25 giây
        target.runAction(cc.scaleTo(0.5, 4.0));
        this.jumpStrength *= 3;
        this.gravity *= 3;

        // Giữ nguyên độ to trong 2.75 giây sau khi tăng độ to
        setTimeout(() => {

            // Thu nhỏ độ to xuống 1.0 trong 1.5 giây
            target.runAction(cc.scaleTo(1.5, 1.0));
            this.jumpStrength /= 2;
            this.gravity /= 1.5;


            // Đặt lại onSkill2 = false sau khi hoàn thành việc thu nhỏ
            setTimeout(() => {
                this.onSkill2 = false;
                this.jumpStrength /= 1.5;
                this.gravity /= 2;

                // Thời gian thu nhỏ là 1.5 giây
            }, 1500);

            // 0.25 giây tăng độ to + 2.75 giây giữ nguyên = 3000ms
        }, 3000);
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
