var Pipe = cc.Sprite.extend({

    ctor: function () {
        this._super(res.pipe_png);
        this.broken = false;
    }
});

var ReversePipe = Pipe.extend({
    ctor: function () {
        this._super();
        this.setRotation(180); // Rotate the pipe upside down
    }
});

var PipeLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        this.pipes = [];
        this.schedule(this.addPipe, 0.25 * speed);
        this.scheduleUpdate();
    },
    addPipe: function () {
        var size = cc.winSize;
        var pipe = new Pipe();
        var reversePipe = new ReversePipe();

        // Random position for the bottom pipe
        var yPos = Math.random() * size.height / 4;
        var gap = size.height / 4; // Adjust this value for the gap size

        pipe.attr({
            x: size.width + pipe.width / 2,
            y: yPos
        });

        reversePipe.attr({
            x: size.width + reversePipe.width / 2,
            y: yPos + pipe.height + gap
        });

        this.addChild(pipe);
        this.addChild(reversePipe);
        this.pipes.push(pipe);
        this.pipes.push(reversePipe);
    },
    update: function (dt) {
        for (var i = this.pipes.length - 1; i >= 0; --i) {
            var pipe = this.pipes[i];

            pipe.x -= speed;

            if (pipe.x < -pipe.width / 2) {
                this.removeChild(pipe);
                this.pipes.splice(i, 1); // Correctly remove the pipe from the array
            }
        }
    }
});
