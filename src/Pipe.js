var Pipe = cc.Sprite.extend({

    ctor: function () {
        this._super(res.pipe_png);
        this.broken = false;
        this.scored = false;
    }
});

var ReversePipe = Pipe.extend({
    ctor: function () {
        this._super();
        this.setRotation(180);
    }
});

var PipeLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.pipes = [];
        this.schedule(this.addPipe, speed / 210);
        this.scheduleUpdate();
    },
    addPipe: function () {
        var size = cc.winSize;
        var pipe = new Pipe();
        var reversePipe = new ReversePipe();

        var yPos = Math.random() * size.height / 3;
        var gap = size.height / 4;

        pipe.attr({
            x: size.width + 720 + pipe.width / 2,
            y: yPos
        });

        reversePipe.attr({
            x: size.width + 720 + reversePipe.width / 2,
            y: yPos + pipe.height + gap
        });

        this.addChild(pipe);
        this.addChild(reversePipe);
        this.pipes.push(pipe);
        this.pipes.push(reversePipe);
    },

    getBoundingBox: function() {
        var rect = this._super();

        rect.width -= 2;
        rect.height -= 2;

        rect.x += 1;
        rect.y += 1;

        return rect;
    },

    update: function (dt) {
        for (var i = this.pipes.length - 1; i >= 0; --i) {
            var pipe = this.pipes[i];

            pipe.x -= speed * dt;

            if (pipe.x < -pipe.width / 2) {
                this.removeChild(pipe);
                this.pipes.splice(i, 1);
            }
        }
    }
});
