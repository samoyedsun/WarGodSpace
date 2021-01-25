// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        playerSpriteFrameList: {
            default: [],
            type: [cc.SpriteFrame]
        },
    },

    onTouchStart (event) {
        this.nodePos = this.node.getPosition();
    },

    onTouchMove (event) {
        var self = this;
        var touches = event.getTouches();
        //触摸刚开始的位置
        var oldPos = self.node.parent.convertToNodeSpaceAR(touches[0].getStartLocation());
        //触摸时不断变更的位置
        var newPos = self.node.parent.convertToNodeSpaceAR(touches[0].getLocation());
        
        var subPos = oldPos.sub(newPos);
 
        self.node.x = self.nodePos.x - subPos.x;
        self.node.y = self.nodePos.y - subPos.y;
        
        // 控制节点移不出屏幕; 
        var minX = -self.node.parent.width/2 + self.node.width/2; //最小X坐标；
        var maxX = Math.abs(minX);
        var minY = -self.node.parent.height/2 + self.node.height/2; //最小Y坐标；
        var maxY = Math.abs(minY);
        var nPos = self.node.getPosition(); //节点实时坐标；
 
        if (nPos.x < minX) {
            nPos.x = minX;
        };
        if (nPos.x > maxX) {
            nPos.x = maxX;
        };
        if (nPos.y < minY) {
            nPos.y = minY;
        };
        if (nPos.y > maxY) {
            nPos.y = maxY;
        };
        self.node.setPosition(nPos);
    },

    onTouchEnd () {
        this.nodePos = this.node.getPosition();
    },
    
    onLoad () {
        cc.director.getCollisionManager().enabled = true;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    onDestroy () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    start () {
        this.playerIndex = this.playerSpriteFrameList.length - 1;
        this.schedule(function(){
            if (this.playerIndex < 0) {
                this.playerIndex = this.playerSpriteFrameList.length - 1;           
            }
            this.getComponent(cc.Sprite).spriteFrame = this.playerSpriteFrameList[this.playerIndex];
            -- this.playerIndex;
        }, 0.5);
    },

    getNewBulletPosition (offset) {
        let bulletPos = this.node.getPosition();
        return cc.v2(bulletPos.x + offset, bulletPos.y)
    },

    update (dt) {
    },

    onCollisionEnter (other, self) {
        // this.node.getChildByName('LifeProgressBar').getComponent(cc.ProgressBar).progress -= 0.01;
        if (other.name.search('bullet') != -1 && other.node.getComponent('Bullet').kind == 'enemy') {
            this.node.parent.getComponent('SceneRoom').subScore();
        }
        if (other.name.search('enemy') != -1) {
            this.node.parent.getComponent('SceneRoom').gameOver();
        }
    }
});
