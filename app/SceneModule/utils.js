// キーコンフィグ
class KeyConfig{
    static get ARROW(){
        return {
            'ArrowUp':      'UP',
            'ArrowDown':    'DOWN',
            'ArrowRight':   'RIGHT',
            'ArrowLeft':    'LEFT',
        };
    }
    static get ASDW(){
        return {
            'w':      'UP',
            's':    'DOWN',
            'd':   'RIGHT',
            'a':    'LEFT',
        };
    }
}

class Sprite{
    constructor(filename, width, height, row, column){
        this.image = new Image(width, height);
        this.image.src = filename;
        this.row = row;
        this.column = column;
        this.size = new Vector2(width/column, height/row);
        this.pivot = this.size.clone().times(0.5);
    }
    drawSprite(context, index, position, scale){
        context.drawImage(
            this.image,
            this.size.x * (index % this.column),
            this.size.y * Math.floor(index/this.column),
            this.size.x,
            this.size.y,
            position.x - this.pivot.x * scale.x,
            position.y - this.pivot.y * scale.y,
            this.size.x * scale.x,
            this.size.y * scale.y,
        );
    }
}

// 時間経過によるアニメーション制御
class Animation{
    constructor(stateList, timeList){
        this.stateList = stateList;
        this.timeList = timeList;
        while(this.timeList.length < this.stateList.length){
            this.timeList.push(this.timeList[this.timeList.length-1])
        }
        this.index = 0;
        this.state = 0;
    }
    init(){
        this.index = 0;
        this.state = this.stateList[this.index];
    }
    update(t){
        var time = t;
        if(time >= this.timeList[this.index]){
            time -= this.timeList[this.index];
            this.index = (this.index + 1) % this.stateList.length;
            this.state = this.stateList[this.index];
        }
        return time;
    }
}

// 二次元ベクトル
class Vector2{
    constructor(x=0, y=0){
        this.x = x;
        this.y = y;
    }
    clone(){
        return new Vector2(this.x, this.y);
    }
    set(v){
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    add(v){
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v){
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    times(v){
        this.x *= v;
        this.y *= v;
        return this;
    }
    timesVector2(v){
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }
    normalize(){
        var length = this.magnitude;
        this.x /= length;
        this.y /= length;
        return this;
    }
    rotate(r){
        var x = this.x;
        var y = this.y;
        this.x = x * Math.cos(r) - y * Math.sin(r);
        this.y = x * Math.sin(r) + y * Math.cos(r);
        return this;
    }
    dot(v){return this.x*v.x+this.y*v.y;}
    cross(v){return this.x*v.y-this.y*v.x;}
    get sqMagnitude(){return this.x**2+this.y**2;}
    get magnitude(){return this.sqMagnitude**0.5;}
    get normalized(){return this.clone().normalize;}
    get eulerAngle(){
        var angle = Math.atan2(this.y, this.x)/Math.PI*180;
        if(angle < 0){
            angle += 360;
        }
        return angle;
    }
    static get zero(){return new Vector2(0,0);}
    static get one(){return new Vector2(1,1);}
    static get up(){return new Vector2(0,1);}
    static get down(){return new Vector2(0,-1);}
    static get right(){return new Vector2(1,0);}
    static get left(){return new Vector2(-1,0);}
    static direction(r){return new Vector2(Math.cos(r), Math.sin(r));}
}  