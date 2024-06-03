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
        this.currentIndex = 0;
        this.middleGap = MIDDLE_GAP;

        this.scheduleUpdate();
        this.addPipe();
    },
    addPipe: function () {
        const size = cc.winSize;
        var pipeTmp = new Pipe();
        const interval = (size.width - pipeTmp.width * 4) / 4 + pipeTmp.width;
        const gap = HEIGHT_GAP;
        const maxHeight = size.height / 3;

        for(var i = 0; i < MAX_PIPES / 2; ++i){
            var pipe = new Pipe();
            var reversePipe = new ReversePipe();
            var yPos;

            if(i == 0){
                yPos = Math.random() * maxHeight;
            }
            else{
                // Ống tiếp theo có hai cách sinh ra 1 là đi lên 0 là đi xuống
                var type;

                // Nếu gap trên đã vượt quá giới hạn (> màn hình / 3) thì chỉ có thể sinh ra ở dưới
                if(maxHeight - (this.pipes[i * 2 - 2].y + this.middleGap) < 0) type = 0;

                // Nếu gap dưới đã vượt quá giới hạn (< 0) thì chỉ có thể sinh ra ở trên
                else if(this.pipes[i * 2 - 2].y - this.middleGap < 0) type = 1;

                // Nếu cả hai gap đều trong giới hạn thì random
                else type = Math.floor(Math.random() * 2);

                // 1 là ở trên ống cũ và ngoài gap
                if(type === 1){
                    // độ tăng của cột tiếp theo là random trong khoảng (độ cao tối đa - độ cao của cột hiện tại - gap)
                    // độ cao cột tiếp theo là độ tăng + độ cao của cột hiện tại + gap
                    yPos = Math.random() * (maxHeight - (this.pipes[i * 2 - 2].y + this.middleGap)) + (this.pipes[i * 2 - 2].y + this.middleGap);
                }
                // 0 là ở dưới ông cũ và ngoài gap
                else{
                    // cột tiếp theo sinh ra trong khoảng 0 đến (độ cao cột trước - gap)
                    yPos = Math.random() * (this.pipes[i * 2 - 2].y - this.middleGap);
                }
            }

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
        const gap = HEIGHT_GAP;
        const maxHeight = size.height / 3;

        for (var i = 0; i < MAX_PIPES; i += 2) {

            var pipe = this.pipes[i];
            var reversePipe = this.pipes[i + 1];

            // Di chuyen voi toc do la speed
            pipe.x -= this.pipeSpeed * dt;
            reversePipe.x -= this.pipeSpeed * dt;

            if (pipe.x < size.width / 2 + 17 + pipe.width / 2) {
                this.currentIndex = i;
            }

            if (pipe.x < -pipe.width / 2) {

            // Khoang cach giua 2 cap ong
                const interval = (size.width - pipe.width * 4) / 4 + pipe.width;

            //
                var type;
                const index = i - 2 >= 0 ? i - 2 : MAX_PIPES - 2;

                // Nếu gap trên đã vượt quá giới hạn (> màn hình / 3) thì chỉ có thể sinh ra ở dưới
                if(maxHeight - (this.pipes[index].y + this.middleGap) < 0) type = 0;

                // Nếu gap dưới đã vượt quá giới hạn (< 0) thì chỉ có thể sinh ra ở trên
                else if(this.pipes[index].y - this.middleGap < 0) type = 1;

                // Nếu cả hai gap đều trong giới hạn thì random
                else type = Math.floor(Math.random() * 2);

                // 1 là ở trên ống cũ và ngoài gap
                if(type === 1){
                    // độ tăng của cột tiếp theo là random trong khoảng (độ cao tối đa - độ cao của cột hiện tại - gap)
                    // độ cao cột tiếp theo là độ tăng + độ cao của cột hiện tại + gap
                    yPos = Math.random() * (maxHeight - (this.pipes[index].y + this.middleGap)) + (this.pipes[index].y + this.middleGap);
                }
                // 0 là ở dưới ông cũ và ngoài gap
                else{
                    // cột tiếp theo sinh ra trong khoảng 0 đến (độ cao cột trước - gap)
                    yPos = Math.random() * (this.pipes[index].y - this.middleGap);
                }
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
