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

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
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


        let progressBarHeight = this.node.getChildByName('enemy_life_progress_bar').height;
        this.node.getChildByName('enemy_life_progress_bar').y = progressBarHeight / 2;

        this.schedule(function(){
            this.room.spawnNewBullet(this.getNewBulletPosition(0), 'enemy');
        }, Math.floor(Math.random() * 10));
    },

    getNewBulletPosition (offset) {
        let bulletPos = this.node.getPosition();
        return cc.v2(bulletPos.x + offset, bulletPos.y - this.node.height / 2)
    },

    update (dt) {
        var enemyPos = this.node.getPosition();
        enemyPos.y = enemyPos.y - 5
        this.node.setPosition(enemyPos);

        var minY = -this.node.parent.height/2 + this.node.height/2;
        if (enemyPos.y < minY) {
            //this.onLost();
        };
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
            let lifeProgress = this.node.getChildByName('enemy_life_progress_bar').getComponent(cc.ProgressBar).progress - 0.1;
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
