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
    ctor: function (pipeSpeed) {
        this._super();
        this.pipes = [];
        this.pipeSpeed = pipeSpeed;

        this.scheduleUpdate();
        this.addPipe();
    },
    addPipe: function () {
        const size = cc.winSize;
        var pipeTmp = new Pipe();
        const interval = (size.width - pipeTmp.width * 4) / 4 + pipeTmp.width;
        const gap = size.height / 4;

        for(var i = 0; i < MAX_PIPES / 2; ++i){
            var pipe = new Pipe();
            var reversePipe = new ReversePipe();
            const yPos = Math.random() * size.height / 3;

            pipe.attr({
                x: size.width + START_GAP + pipe.width / 2 + interval * i,
                y: yPos
            });

            reversePipe.attr({
                x: size.width + START_GAP + reversePipe.width / 2 + interval * i,
                y: yPos + pipe.height + gap
            });

            this.addChild(pipe);
            this.addChild(reversePipe);
            this.pipes.push(pipe);
            this.pipes.push(reversePipe);
        }
    },

    setPipeSpeed: function (pipeSpeed) {
        this.pipeSpeed = pipeSpeed;
    },

    getBoundingBox: function() {
        var rect = this._super();

        rect.width -= 4;
        rect.height -= 4;

        rect.x += 2;
        rect.y += 2;

        return rect;
    },

    update: function (dt) {
        const size = cc.winSize;
        const gap = size.height / 4;

        for (var i = 0; i < MAX_PIPES; i += 2) {

            var pipe = this.pipes[i];
            var reversePipe = this.pipes[i + 1];

            // Di chuyen voi toc do la speed
            pipe.x -= this.pipeSpeed * dt;
            reversePipe.x -= this.pipeSpeed * dt;

            if (pipe.x < -pipe.width / 2) {

            // Khoang cach giua 2 cap ong
                const interval = (size.width - pipe.width * 4) / 4 + pipe.width;

            //
                const yPos = Math.random() * size.height / 3;
                pipe.attr({
                    x: size.width + interval - pipe.width / 2,
                    y: yPos,
                    scored: false
                })

                reversePipe.attr({
                    x: size.width + interval - pipe.width / 2,
                    y: yPos + pipe.height + gap,
                    scored: false
                })
            }
        }
    }
});
