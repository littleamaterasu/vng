var Bird = cc.Sprite.extend({
    ctor: function() {
        this._super(res.bird_png);
        this.initProperties();
        this.setInitialPosition();

        this.birdAnimation = new cc.Animation();
                this.birdAnimation.addSpriteFrameWithFile(res.bird_png);

                this.birdAnimation.addSpriteFrameWithFile(res.bird2_png);
                this.birdAnimation.setDelayPerUnit(0.25);
                this.runAction(cc.animate(this.birdAnimation).repeatForever());

        this.scheduleUpdate();
    },

    initProperties: function() {
        this.ySpeed = 0;
        this.gravity = GRAVITY;
        this.jumpStrength = JUMP_STRENGTH;
        this.state = state.FLYING_STRAIGHT;
        this.angle = 0;
        this.radius = this.height / 2;
        // Thể hiện cooldown hiện tại của các skill
        this.cooldownSkill1 = 0;
        this.cooldownSkill2 = 0;
        // Thể hiện đang dùng skill nào
        this.onSkill1 = false;
        this.onSkill2 = false;
    },
    // Khởi tạo vị trí
    setInitialPosition: function() {
        var size = cc.winSize;
        this.attr({
            x: BIRD_START_X,
            y: size.height / 2
        });
    },
    // Trong 1 frame sẽ kiểm tra trạng thái
    // cập nhật vị trí
    // kiểm tra vị trí trong màn hình
    update: function(dt) {
        this.handleState(dt);
        this.updatePosition();
        this.checkBoundaries();
    },

    // kiểm tra trạng thái có các trạng thái cơ bản là bay thẳng khi mới vào game
    // nhảy -> rơi
    // dead
    handleState: function(dt) {
        switch (this.state) {
            case state.FLYING_STRAIGHT:
                // No specific action needed
                break;
            case state.JUMPING:
                this.state = state.FALLING;
                break;
            case state.FALLING:
            case state.DEAD:
                this.applyGravity(dt);
                this.updateAngle(dt, MAX_DOWN_ANGLE);
                break;
            default:
                this.ySpeed = 0;
                break;
        }
    },

    // áp dụng trọng lực vào chum
    // vận tốc theo chiều y giảm theo thời gian
    applyGravity: function(dt) {
        this.ySpeed += this.gravity * dt;
    },

    // Thay đổi góc quay giới hạn ở max Angle
    updateAngle: function(dt, maxAngle) {
        this.angle = Math.min(maxAngle, this.angle + TURN_RATE * dt);
        this.setRotation(this.angle);
    },

    // cập nhật vị trí
    // do chim đứng yên nên chỉ cập nhật y
    updatePosition: function() {
        this.y += this.ySpeed;
    },

    // kiểm tra các boundaries trên và dưới của màn hình
    checkBoundaries: function() {
        // dưới
        if (this.y < 0) {
            this.y = 0;
        }
        // trên
        if (this.y > cc.winSize.height) {
            this.state = state.FALLING;
            this.y = cc.winSize.height;
        }
    },

    // nhảy sẽ đặt lại vận tốc theo trục y rồi sau đó chuyển trạng thái sang jump -> rơi
    jump: function() {
        if (this.state !== state.DEAD) {
            this.playJumpSound();
            this.ySpeed = this.jumpStrength;
            this.angle = MAX_UP_ANGLE;
            this.runAction(cc.rotateTo(0.5, this.angle));
            this.state = state.JUMPING;
        }
    },

    playJumpSound: function() {
        cc.audioEngine.playEffect(res.jump_wav, false);
    },

    // khi chết cho rơi nhanh gấp đôi
    die: function() {
        this.gravity *= 2;
        this.jump();
        this.state = state.DEAD;
        this.playHurtSound();
    },

    playHurtSound: function() {
        cc.audioEngine.playEffect(res.hurt_wav, false);
    },

    skill1: function() {
        if (this.state === state.DEAD) return;

        this.playExplosionSound();
        this.onSkill1 = true;
        this.state = state.OTHERS;
        this.runAction(cc.rotateTo(DASH_DURATION / 2, 0));
        //dđặt trạng thái skill 1 kết thúc
        this.scheduleSkill1End(DASH_DURATION);
        // đặt cooldown cho skill 1
        this.cooldownSkill1 = COOLDOWN_SKILL_1;
    },

    playExplosionSound: function() {
        cc.audioEngine.playEffect(res.explosion_wav, false);
    },

    // sau khi hết skill 1 thì bắt đầu rơi và rời khỏi skill 1
    scheduleSkill1End: function(duration) {
        setTimeout(() => {
            // rời skill 1
            this.onSkill1 = false;
            // thay trạng thái
            this.state = state.FALLING;
        }, duration);
    },

    skill2: function() {
        if (this.onSkill2) return;
        // kích hoạt và đặt lịch kết thúc
        this.activateSkill2();
        this.scheduleSkill2End();
    },

    activateSkill2: function() {
        // đặt cool down
        this.cooldownSkill2 = COOLDOWN_SKILL_2;
        // tăng bán kính chim
        this.radius *= GROW_FACTOR;
        // vào trạng thái skill 2
        this.onSkill2 = true;
        // phóng to
        this.runAction(cc.scaleTo(0.5, GROW_FACTOR));
    },

    // skill 2 độ dài tổng 5s
    // 3.5 s đầu là phóng to, tăng khả năng nhảy và giữ nguyên trạng thái
    // 1.5 s sau là thu nhỏ và giảm sức nhảy 2 lần

    scheduleSkill2End: function() {
        // 3.5s giữ nguyên trạng thái phóng to
        setTimeout(() => {
            // giảm độ to dần trong 1.5s
            this.runAction(cc.scaleTo(1.5, 1.0));
            // reset các tính chất trong 1.5s tiếp theo
            this.resetSkill2Properties(1500);
        }, 3500);
    },

    resetSkill2Properties: function(delay) {
        // bán kính giảm 4 ngay lập tức
        this.radius /= 4;
        setTimeout(() => {
            this.onSkill2 = false;
        }, delay);
    },
});
