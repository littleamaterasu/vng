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
        this.scheduleUpdate();
        this.addPipe();
    },
    addPipe: function () {
        var size = cc.winSize;
        var pipeTmp = new Pipe();
        var reversePipeTmp = new ReversePipe();
        var interval = (size.width - pipeTmp.width * 4) / 4 + pipeTmp.width;
        var gap = size.height / 4;
        console.log(interval)
        for(var i = 0; i < 5; ++i){
            var pipe = new Pipe();
            var reversePipe = new ReversePipe();
            var yPos = Math.random() * size.height / 3;

            pipe.attr({
                x: size.width + 1080 + pipe.width / 2 + interval * i,
                y: yPos
            });

            reversePipe.attr({
                x: size.width + 1080 + reversePipe.width / 2 + interval * i,
                y: yPos + pipe.height + gap
            });

            this.addChild(pipe);
            this.addChild(reversePipe);
            this.pipes.push(pipe);
            this.pipes.push(reversePipe);
        }

        this.pipes.forEach(pipe => {
            console.log(pipe.getPosition())
        })
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
        var size = cc.winSize;
        var gap = size.height / 4;

        for (var i = 0; i < 10; i += 2) {
            var pipe = this.pipes[i];
            var reversePipe = this.pipes[i + 1];
            pipe.x -= speed * dt;
            reversePipe.x -= speed * dt;
            if (pipe.x < -pipe.width / 2) {
                var interval = (size.width - pipe.width * 4) / 4 + pipe.width;
                var yPos = Math.random() * size.height / 3;
                pipe.attr({
                    x: size.width + interval - pipe.width / 2,
                    y: yPos
                })

                reversePipe.attr({
                    x: size.width + interval - pipe.width / 2,
                    y: yPos + pipe.height + gap
                })
            }
        }
    }
});
