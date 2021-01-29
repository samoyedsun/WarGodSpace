var Bezier = require("Bezier");
var FishPathConfig = require("FishPathConfig")

var fish_to_path = [
    1, 2, 1, 2, 1,
    1, 2, 1, 2, 1,
    1, 2, 1, 2, 1,
    1, 2, 1, 2, 1,
    2, 2, 2
];

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
    },

    createSwimPath (fishPath) {
        let enemyPos = this.node.getPosition();
        this.startX = enemyPos.x;
        this.startY = enemyPos.y;

        this.swimPaths = [];
        this.pathStartX  = fishPath[0].positions[0];
        this.pathStartY = fishPath[0].positions[1];
        for (let key in fishPath) {
            let positions = fishPath[key].positions;
            let time = fishPath[key].time;
            let bezierPosTb = []
            bezierPosTb.push({x:positions[0], y:positions[1]})
            bezierPosTb.push({x:positions[2], y:positions[3]})
            bezierPosTb.push({x:positions[4], y:positions[5]})
            let bezierObj = new Bezier().initData(bezierPosTb, time);
            this.swimPaths.push(bezierObj);
        }
        this.curPathIndex = 0;
        this.surviveTime = 0;
        this.swimTime = 0;
        this.curX = 0;
        this.curY = 0;
    },

    /*
        转换坐标
    */
    changePos (pos) {
        // 旋转、偏移
        if (this.node.angle != 0) {
            let dx = pos.x - this.pathStartX
            let dy = pos.y - this.pathStartY
            pos.x = this.pathStartX + dx * Math.cos(this.node.angle) + dy * Math.sin(this.node.angle)
            pos.y = this.pathStartY + dy * Math.cos(this.node.angle) - dx * Math.sin(this.node.angle)
        }
    
        pos.x = pos.x + this.startX
        pos.y = pos.y + this.startY
        return pos
    },

    start () {
        let randPos = Math.floor(Math.random() * this.room.enemySpriteFrameList.length);
        let frame = this.room.enemySpriteFrameList[randPos];
        this.node.width = frame.getRect().width;
        this.node.height = frame.getRect().height;
        this.getComponent(cc.BoxCollider).size.width = frame.getRect().width;
        this.getComponent(cc.BoxCollider).size.height = frame.getRect().height;

        this.getComponent(cc.Sprite).spriteFrame = frame;
        let oldWidth = this.node.getChildByName('enemy_life_progress_bar').width;
        this.node.getChildByName('enemy_life_progress_bar').width = this.node.width;
        this.node.getChildByName('enemy_life_progress_bar').getChildByName('bar').width = this.node.width;
        this.node.getChildByName('enemy_life_progress_bar').getComponent(cc.ProgressBar).totalLength = this.node.width;

        let barX = this.node.getChildByName('enemy_life_progress_bar').getChildByName('bar').x;
        this.node.getChildByName('enemy_life_progress_bar').getChildByName('bar').x = barX + (oldWidth - this.node.width) / 2
        
        this.node.getChildByName('enemy_life_progress_bar').y = this.node.width / 2;

        this.schedule(function(){
            this.room.spawnNewBullet(this.getNewBulletPosition(0), 'enemy');
        }, Math.floor(Math.random() * 20) + 1);
        
        this.createSwimPath(FishPathConfig.getPath(randPos));
    },

    getNewBulletPosition (offset) {
        let bulletPos = this.node.getPosition();
        return cc.v2(bulletPos.x + offset, bulletPos.y - this.node.height / 2)
    },

    update (dt) {
	    this.surviveTime = this.surviveTime + dt
        let bezierObj = this.swimPaths[this.curPathIndex];
        
        while (bezierObj) {
            if (this.surviveTime < this.swimTime + bezierObj.getTimeLen()) {
                break;
            }
            this.swimTime = this.swimTime + bezierObj.getTimeLen();
            this.curPathIndex = this.curPathIndex + 1;
            bezierObj = this.swimPaths[this.curPathIndex];
        }
 
        if (! bezierObj) {
            this.onLost();
        } else {
            let res = bezierObj.getPoint(this.surviveTime - this.swimTime);
            // let pos2 = this.changePos(res.p02)
            // let pos1 = this.changePos(res.p01);
            let pos2 = res.p02;
            let pos1 = res.p01;
            this.curX = pos2.x;
            this.curY = pos2.y;
            this.node.setPosition(cc.v2(pos2.x, pos2.y));
            let radian = Math.atan2(pos1.y - pos2.y, pos2.x - pos1.x)
            this.node.angle = -270 - radian * (180/Math.PI);
        }
    },

    onLost () {
        this.room.subScore();
        this.node.destroy();
    },

    onPicked () {
        this.room.gainScore(10);
        this.node.destroy();
    },

    onAccident () {
        this.room.subScore();
        this.node.destroy();
    },

    onCollisionEnter (other, self) {
        if (other.name.search('bullet') != -1 && other.node.getComponent('Bullet').kind == 'Player') {
            let hurtBlood = 100 / (this.node.height + this.node.width + 2000);
            let lifeProgress = this.node.getChildByName('enemy_life_progress_bar').getComponent(cc.ProgressBar).progress - hurtBlood;
            if (lifeProgress <= 0) {
                this.onPicked();
            }
            this.node.getChildByName('enemy_life_progress_bar').getComponent(cc.ProgressBar).progress = lifeProgress
        }
        if (other.name.search('Player') != -1) {
            this.onAccident();
        }
    }
});
