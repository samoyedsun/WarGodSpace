// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
        // let randPos = Math.floor(Math.random() * this.room.bulletSpriteFrameList.length);  
        let index = 0;
        if (this.kind == 'Player') {
            index = 60;
        }
        let frame = this.room.bulletSpriteFrameList[index];
        this.getComponent(cc.Sprite).spriteFrame = frame;
    },

    update (dt) {
        let bulletPos = this.node.getPosition();
        if (this.kind == 'Player') {
            bulletPos.y = bulletPos.y + dt * 800;
        } else {
            bulletPos.y = bulletPos.y - dt * 800;
        }
        this.node.setPosition(bulletPos);

        let minY = -this.node.parent.height/2 + this.node.height/2;
        let maxY = Math.abs(minY);
        if (bulletPos.y > maxY || bulletPos.y < minY) {
            this.node.destroy();
        };
    },

    onCollisionEnter (other, self) {
        if (other.name.search(this.kind) == -1) {
            let bulletPos = this.node.getPosition();
            this.room.spawnNewBlastEffect(bulletPos, this.kind);
            this.node.destroy();
        }
    }
});
