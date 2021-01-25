// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        changeAtlas: {
            default: null,
            type: cc.SpriteAtlas
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.animation = this.node.getComponent(cc.Animation);
        this.creatorAnimation(0, 'showAni')
        let state = this.animation.play('showAni');
        this.animation.on('play', this.onAnimPlayListener, this);
        this.animation.on('finished', this.onAnimFinishedListener, this);
    },

    creatorAnimation (WrapMode, name) {
        let showTip = [];
        for(let i = 0; i < 16; i ++){
            let index = i + 1;
            let name = index.toString().padStart(16, 'zpzj_eff_ufohz01');//(=========)
            let frame = this.changeAtlas.getSpriteFrame(name);//获取动画集合下的第一个动画plist文件，并以动画名称依次播放
            if(frame){
                showTip.push(frame); //添加动画帧到数组(=========)
            }
        }
        let clip = cc.AnimationClip.createWithSpriteFrames(showTip, showTip.length);//创建一组动画剪辑
        clip.wrapMode = WrapMode;//设置播放模式
        clip.name = name;//设置名字
        this.animation.addClip(clip);//添加动画帧到动画组件中
    },

    onAnimPlayListener () {
    },

    onAnimFinishedListener () {
        this.node.destroy();
    },

    // update (dt) {},
});
