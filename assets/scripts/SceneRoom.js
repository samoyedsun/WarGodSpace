// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },

        currency_bullet: {
            default: null,
            type: cc.Label
        },

        currency_ticket: {
            default: null,
            type: cc.Label
        },

        backGroundList: {
            default: [],
            type: [cc.Node]    
        },

        bulletSpriteFrameList: {
            visible: false,
            default: [],
            type: [cc.SpriteFrame]
        },

        enemySpriteFrameList: {
            visible: false,
            default: [],
            type: [cc.SpriteFrame]
        },

        bgmSpaceAudio: {
            visible: false,
            default: null,
            type: cc.AudioClip
        },

        addScoreAudio: {
            visible: false,
            default: null,
            type: cc.AudioClip
        },

        hitBoomAudio: {
            visible: false,
            default: null,
            type: cc.AudioClip
        },

        biuAudio: {
            visible: false,
            default: null,
            type: cc.AudioClip
        },

        enemyPrefab: {
            visible: false,
            default: null,
            type: cc.Prefab
        },

        bulletPrefab: {
            visible: false,
            default: null,
            type: cc.Prefab
        },
    
        blastEffectPrefab: {
            visible: false,
            default: null,
            type: cc.Prefab
        },
    },

    onLoad () {
        this.score = 0;
        
        
        let self = this;
        cc.assetManager.loadBundle('plist', (err, bundle) => {
            bundle.load('plane', cc.SpriteAtlas, function (err, atlas) {
                for (let i = 0; i < 86; ++ i) {
                    let index = i + 1;
                    let name = index.toString().padStart(14, 'qpzj_zd_img_01');
                    self.bulletSpriteFrameList[i] = atlas.getSpriteFrame(name);
                }
                for (let i = 0; i < 23; ++ i) {
                    let index = i + 1;
                    let name = index.toString().padStart(9, 'plane1001') + '_01';
                    self.enemySpriteFrameList[i] = atlas.getSpriteFrame(name);
                }
            });

            //bundle.load('p_menu_pl', cc.SpriteAtlas, function (err, atlas) {
                // let frame = atlas.getSpriteFrame('plane_yxjm_img_kzt');
                // self.node.getChildByName('plane_yxjm_img_kzt').getComponent(cc.Sprite).spriteFrame = frame;
            //});
        });
    
        cc.assetManager.loadBundle('audio', (err, bundle) => {
            bundle.load('bgm_space', cc.AudioClip, function (err, audioClip) {
                self.bgmSpaceAudio = audioClip;
                cc.audioEngine.play(self.bgmSpaceAudio, true, 1);
            });
            bundle.load('score', cc.AudioClip, function (err, audioClip) {
                self.addScoreAudio = audioClip;
            });

            bundle.load('boom', cc.AudioClip, function (err, audioClip) {
                self.hitBoomAudio = audioClip;
            });

            bundle.load('hurt', cc.AudioClip, function (err, audioClip) {
                self.hurtBoomAudio = audioClip;
            });

            bundle.load('biu', cc.AudioClip, function (err, audioClip) {
                self.biuAudio = audioClip;
            });
        });

        cc.assetManager.loadBundle('prefab', (err, bundle) => {
            bundle.load('enemy', cc.Prefab, function (err, prefab) {
                self.enemyPrefab = prefab;
            });
            bundle.load('bullet', cc.Prefab, function (err, prefab) {
                self.bulletPrefab = prefab;
            });
            bundle.load('blast_effect', cc.Prefab, function (err, prefab) {
                self.blastEffectPrefab = prefab;
            });
        });
    },

    onDestroy () {
        cc.assetManager.getBundle("plist").releaseAll();
        cc.assetManager.getBundle("audio").releaseAll();
        cc.assetManager.getBundle("prefab").releaseAll();
    },

    start () {
        this.schedule(function(){
            if (this.bulletSpriteFrameList.length == 86) {
                this.spawnNewEnemy(this.getNewEnemyPosition());
            }
        }, 0.5);
        this.schedule(function(){
            if (this.enemySpriteFrameList.length == 23) {
                this.spawnNewBullet(this.player.getComponent('Player').getNewBulletPosition(-50), 'Player');
                this.spawnNewBullet(this.player.getComponent('Player').getNewBulletPosition(50), 'Player');
                if (this.biuAudio) {
                    cc.audioEngine.play(this.biuAudio, false, 0.5);
                }
            }
        }, 0.1); // player应该也是enemy

        this.backGroundList[0].y = 0;
        this.backGroundList[1].y = - (this.backGroundList[0].height / 2 + this.backGroundList[1].height / 2);
    },

    spawnNewEnemy (spawnPos) {
        let newEnemy = cc.instantiate(this.enemyPrefab);
        this.node.addChild(newEnemy);
        newEnemy.setPosition(spawnPos);
        newEnemy.getComponent('Enemy').room = this;
    },

    getNewEnemyPosition () {
        let randY = this.node.height / 2
        let randX = (Math.random() - 0.5) * this.node.width;
        return cc.v2(randX, randY);
    },

    spawnNewBullet (spawnPos, kind) {
        let newBullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(newBullet);
        newBullet.setPosition(spawnPos);
        newBullet.getComponent('Bullet').room = this;
        newBullet.getComponent('Bullet').kind = kind;
    },

    spawnNewBlastEffect (spawnPos, kind) {
        if (this.blastEffectPrefab) {
            let newBlastEffect = cc.instantiate(this.blastEffectPrefab);
            this.node.addChild(newBlastEffect);
            newBlastEffect.setPosition(spawnPos);
            newBlastEffect.getComponent('BlastEffect').room = this;
        }
        if (this.hitBoomAudio && kind == 'Player') {
            cc.audioEngine.play(this.hitBoomAudio, false, 0.05);
        }
        if (this.hurtBoomAudio && kind == 'enemy') {
            cc.audioEngine.play(this.hurtBoomAudio, false, 0.1);
        }
    },

    update (dt) {
        let parentHeight = this.node.height;
        this.backGroundList[0].y -= 3;
        this.backGroundList[1].y -= 3;
        if(this.backGroundList[0].y <= -parentHeight) {
            let backGround2Height = this.backGroundList[1].y;
            this.backGroundList[0].y = parentHeight + backGround2Height;
        }
        if(this.backGroundList[1].y <= -parentHeight) {
            var backGround1Height = this.backGroundList[0].y;
            this.backGroundList[1].y = parentHeight + backGround1Height;
        }
        
        // let lifeProgress = this.player.getChildByName('LifeProgressBar').getComponent(cc.ProgressBar).progress;
        // if (lifeProgress <= 0) {
        //    this.gameOver();
        // }
    },

    gainScore (score) {
        this.score += typeof(score) != 'undefined' ? score : 1;
        this.currency_bullet.string = this.score.toString();

        if (this.addScoreAudio) {
            cc.audioEngine.playEffect(this.addScoreAudio, false);
        }
    },

    subScore () {
        this.score -= 1;
        this.currency_bullet.string = this.score.toString();

        //cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver () {
        this.player.stopAllActions();
        cc.audioEngine.stopAll();
        cc.director.loadScene('Loading');
    }
});
