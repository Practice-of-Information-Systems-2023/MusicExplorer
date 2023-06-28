// タグ
const Tag = {
    Player : 1,
    Character : 2,
    MusicObj : 3,
    Profile : 4,
};

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
    static get DOUBLE(){
        return {
            'w':      'UP',
            's':    'DOWN',
            'd':   'RIGHT',
            'a':    'LEFT',
            'ArrowUp':      'UP',
            'ArrowDown':    'DOWN',
            'ArrowRight':   'RIGHT',
            'ArrowLeft':    'LEFT',
        };
    }
}

class Sprite{
    constructor(filename, width, height, row, column, pivot){
        this.image = new Image(width, height);
        this.image.src = filename;
        this.row = row;
        this.column = column;
        this.size = new Vector2(width/column, height/row);
        this.pivot = this.size.clone().timesVector2(pivot);
    }
    drawSprite(context, index, position, scale, alpha=1){
        const alphaPre = context.globalAlpha;
        context.globalAlpha = alpha;
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
        context.globalAlpha = alphaPre;
    }
    within(position, scale, targetPosition){
        const x1 = position.x - this.pivot.x * scale.x;
        const x2 = position.x + (this.size.x - this.pivot.x) * scale.x;
        const y1 = position.y - this.pivot.y * scale.y;
        const y2 = position.y + (this.size.y - this.pivot.y) * scale.y;
        return targetPosition.x >= x1 && targetPosition.x <= x2
            && targetPosition.y >= y1 && targetPosition.y <= y2;
    }
}

class Text{
    static drawText(context, position, pivot, text, font, color){
        const pos = position.clone().add(pivot);
        const lines = text.split("\n");
        const length = lines.length;
        var plus = 0;
        context.fillStyle = color;
        context.font = font;
        var textWidth = 0;
        for(let line of lines){
            const width = context.measureText(line).width;
            textWidth = Math.max(textWidth,width);
            context.fillText(line, pos.x - width/2, pos.y);
            pos.y += 24;
        }
    }
    static getSize(text, font = '24px serif'){
        context.font = font;
        const textWidth = context.measureText(text).width;
        const textHeight = context.measureText(text).height;
        console.log(textWidth, textHeight);
        return [textWidth, textHeight];
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
    setValue(x,y){
        this.x = x;
        this.y = y;
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
    get isZero(){return this.x==0 && this.y==0;}
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

class MathUtils{
    static randomRange(begin,end){
        return Math.random()*(end-begin)+begin;
    }
    static getSecondFromPivot(){
        const pivot = new Date('2023/06/01 00:00:00');
        const now = new Date();
        const diffTime = Math.floor((now.getTime() - pivot.getTime())/1000);
        return diffTime;
    }
}

class Utils{
    static getVideoIdFromURL(url){
        const result = url.substr(url.indexOf('=')+1,url.length);
        return result;
    }
}