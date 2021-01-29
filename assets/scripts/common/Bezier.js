// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var STOP_VALUE = 0.00001;

cc.Class({
    extends: cc.Component,

    properties: {
        a: 0,
        b: 0,
        c: 0,
        points: null,
        timeLen: 0,
        totalLength: 0,
    },



    ctor () {
    },

    initData (points, timeLen) {
        this.points = points;
        this.timeLen = timeLen;
        
        if (points[0].x == points[1].x && points[1].x == points[2].x) {
		    points[1].x = points[1].x + 1;
        }

        if (points[0].y == points[1].y && points[1].y == points[2].y) {
            points[2].y = points[2].y + 1;
        }

        let ax = points[0].x - 2 * points[1].x + points[2].x;
        let ay = points[0].y - 2 * points[1].y + points[2].y;
        let bx = 2 * points[1].x - 2 * points[2].x;
        let by = 2 * points[1].y - 2 * points[2].y;
        this.a = 4 * (ax * ax + ay * ay);
        this.b = 4 * (ax * bx + ay * by);
        this.c = bx * bx + by * by;


        // 曲线总长度
        this.totalLength = this.curveLength(1);
        
        return this;
    },

    getTimeLen () {
        return this.timeLen;
    },

    /*
        速度函数
        s(t_) = Sqrt[A*t*t+B*t+C]
    */
    speed (t) {
        return Math.sqrt(this.a * t * t + this.b * t + this.c);
    },

    /*
        长度函数反函数，使用牛顿切线法求解
        X(n+1) = Xn - F(Xn)/F'(Xn)
    */
    invertL (t, l) {
        let t1 = t;
        let t2 = null;
        
        while (true) {
            t2 = t1 - (this.curveLength(t1) - l) / this.speed(t1);
            if (Math.abs(t1 - t2) < STOP_VALUE) { 
                break;
            }
            t1 = t2;
        }
    
        return t2
    },

    /*
        长度函数
        L(t) = Integrate[s[t], t]
        
        L(t_) = ((2*Sqrt[A]*(2*A*t*Sqrt[C + t*(B + A*t)] + B*(-Sqrt[C] + Sqrt[C + t*(B + A*t)])) + 
                    (B^2 - 4*A*C) (Log[B + 2*Sqrt[A]*Sqrt[C] ] - Log[B + 2*A*t + 2 Sqrt[A]*Sqrt[C + t*(B + A*t)] ]))
                        /(8* A^(3/2)));
        
    */
    curveLength (t) {
        let temp1 = Math.sqrt(this.c + t * (this.b + this.a * t));
        let temp2 = (2 * this.a * t * temp1 + this.b * (temp1 - Math.sqrt(this.c)));
        let temp3 = Math.log(this.b + 2 * Math.sqrt(this.a) * Math.sqrt(this.c));
        let temp4 = Math.log(this.b + 2 * this.a * t + 2 * Math.sqrt(this.a) * temp1);
        let temp5 = 2 * Math.sqrt(this.a) * temp2;
        let temp6 = (this.b * this.b - 4 * this.a * this.c) * (temp3 - temp4);
    
        return (temp5 + temp6)/(8 * Math.pow(this.a, 1.5));
    },

    /*
        返回【匀速运动】情况下指定时间点坐标
        @param t 范围0~1
        @result 对应时间点的坐标
    */
    getPoint (t) {
        t = t / this.timeLen;
        // 如果按照线性增长,此时对应的曲线长度
        let l = t * this.totalLength;
        // 根据L函数的反函数，求得l对应的t值

        t = this.invertL(t, l);
    
        // 根据贝塞尔曲线函数，求得取得此时的x,y坐标
        let p01 = {
            x: (1 - t) * this.points[0].x + t * this.points[1].x,
            y: (1 - t) * this.points[0].y + t * this.points[1].y
        };
        let p11 = {
            x: (1 - t) * this.points[1].x + t * this.points[2].x,
            y: (1 - t) * this.points[1].y + t * this.points[2].y
        };
        let p02 = {
            x: (1 - t) * p01.x + t * p11.x,
            y: (1 - t) * p01.y + t * p11.y
        };
        return {p01:p01, p02:p02}
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },

    // update (dt) {},
});
