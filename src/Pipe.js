var Pipe = cc.Sprite.extend({

    ctor: function (){
        this._super(res.pipe_png)
        this.broken = false;
    }

})

var PipeLayer = cc.Layer.extend({

    ctor: function (){
        this._super();
        this.pipes = [];
        this.schedule(this.addPipe, 2);
        this.scheduleUpdate()
    },
    addPipe: function (pipes){
        var pipe = new Pipe();



        this.pipes.push(pipe)
    },
    update: function (dt){
        for(var i = 0; i < this.pipes.length; ++i){
            var pipe = this.pipes[i];

            pipe.x -= 2;

            if(pipe.x < -pipe.width/2){
                this.removeChild(pipe);
                this.pipes.slice(i,1);
            }
        }
    }
})