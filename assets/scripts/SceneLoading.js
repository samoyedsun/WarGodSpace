// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        enterRoomAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
        this.schedule(function(){
            this.node.getChildByName('qpzj_jz_01').angle -= 1;
            this.node.getChildByName('qpzj_jz_02').angle -= 1;
            this.node.getChildByName('qpzj_jz_03').angle += 1;
        }, 0.01);
        this.schedule(function(){
            cc.director.loadScene('Room');
        }, 3);
        if (this.enterRoomAudio) {
            cc.audioEngine.playEffect(this.enterRoomAudio, false);
        }
    },

    // update (dt) {},
});
