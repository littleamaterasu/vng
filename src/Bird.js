var Bird = cc.Sprite.extend({
    ctor: function (){
        this._super(res.bird_png);
    }
})

var BirdLayer = cc.Layer.extend({
    ctor: function (){
        this.bird = new Bird();

    }
})