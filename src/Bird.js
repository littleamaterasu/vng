var Bird = cc.Sprite.extend({
    ctor: function() {
        this._super(res.bird_png);
        this.initProperties();
        this.setInitialPosition();
        this.scheduleUpdate();
    },

    initProperties: function() {
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
    },

    setInitialPosition: function() {
        var size = cc.winSize;
        this.attr({
            x: BIRD_START_X,
            y: size.height / 2
        });
    },

    update: function(dt) {
        this.handleState(dt);
        this.updatePosition();
        this.checkBoundaries();
    },

    handleState: function(dt) {
        switch (this.state) {
            case "FLYING_STRAIGHT":
                // No specific action needed
                break;
            case "JUMPING":
                this.state = "FALLING";
                break;
            case "FALLING":
            case "DEAD":
                this.applyGravity(dt);
                this.updateAngle(dt, MAX_DOWN_ANGLE);
                break;
            default:
                this.ySpeed = 0;
                break;
        }
    },

    applyGravity: function(dt) {
        this.ySpeed += this.gravity * dt;
    },

    updateAngle: function(dt, maxAngle) {
        this.angle = Math.min(maxAngle, this.angle + TURN_RATE * dt);
        this.setRotation(this.angle);
    },

    updatePosition: function() {
        this.y += this.ySpeed;
    },

    checkBoundaries: function() {
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
            this.playJumpSound();
            this.ySpeed = this.jumpStrength;
            this.angle = MAX_UP_ANGLE;
            this.runAction(cc.rotateTo(0.5, this.angle));
            this.state = "JUMPING";
        }
    },

    playJumpSound: function() {
        cc.audioEngine.playEffect(res.jump_wav, false);
    },

    die: function() {
        this.gravity *= 2;
        this.jump();
        this.state = "DEAD";
        this.playHurtSound();
    },

    playHurtSound: function() {
        cc.audioEngine.playEffect(res.hurt_wav, false);
    },

    skill1: function() {
        if (this.state === "DEAD") return;

        this.playExplosionSound();
        this.onSkill1 = true;
        this.state = "OTHERS";
        this.runAction(cc.rotateTo(DASH_DURATION / 2, 0));
        this.scheduleSkill1End(DASH_DURATION);
        this.cooldown1 = COOLDOWN_SKILL_1;
    },

    playExplosionSound: function() {
        cc.audioEngine.playEffect(res.explosion_wav, false);
    },

    scheduleSkill1End: function(duration) {
        setTimeout(() => {
            this.onSkill1 = false;
            this.state = "FALLING";
        }, duration);
    },

    skill2: function() {
        if (this.onSkill2) return;

        this.activateSkill2();
        this.scheduleSkill2End();
    },

    activateSkill2: function() {
        this.cooldown2 = COOLDOWN_SKILL_2;
        this.radius *= 4;
        this.onSkill2 = true;
        this.runAction(cc.scaleTo(0.5, 4.0));
        this.jumpStrength *= 3;
        this.gravity *= 3;
    },

    scheduleSkill2End: function() {

        setTimeout(() => {
            this.jumpStrength /= 2;
            this.gravity /= 1.5;
            this.runAction(cc.scaleTo(1.5, 1.0));
            this.resetSkill2Properties(1500);
        }, 50000);
    },

    resetSkill2Properties: function(delay) {
        this.radius /= 4;
        setTimeout(() => {
            this.onSkill2 = false;
            this.jumpStrength /= 1.5;
            this.gravity /= 2;
        }, delay);
    },

    getBoundingBox: function() {
        var rect = this._super();
        rect.width -= 2;
        rect.height -= 2;
        rect.x += 1;
        rect.y += 1;
        return rect;
    }
});
