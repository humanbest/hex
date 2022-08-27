import Phaser from "phaser";
import { CONFIG } from "../config";
import CardManager from "../interface/CardManager";
import TopMenu from "../interface/TopMenu";

/**
 * 배틀씬
 */
export class BattleScene extends Phaser.Scene 
{
    constructor() 
    {
        super({
            key: CONFIG.SCENES.BATTLE 
        })
    }

    preload(): void
    {
        this.load.image(CONFIG.IMAGE.BATTLE_SCENE_BACKGROUND, "images/battleScene/background.png")
        this.load.atlas("enemy01", "sprite/enemy01.png", "sprite/enemy01.json");
        this.load.atlas("middle_boss_idle", "sprite/middle_boss_idle.png", "sprite/middle_boss_idle.json");

        this.input.keyboard.on('keydown-F',  () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        })
    }

    create(): void
    {
        /** 배틀씬 배경 */
        const background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, CONFIG.IMAGE.BATTLE_SCENE_BACKGROUND);
        background.setScale(this.cameras.main.width / background.width, this.cameras.main.height / background.height).setScrollFactor(0);

        /** 상단 메뉴 */
        new TopMenu(this, 0, 0);
        

        /** 카드 관리 컨테이너 */
        const cardManager = new CardManager(this, 0, 0);
        this.input.keyboard.on('keydown-SPACE',  () => cardManager.addCard(false));

        this.anims.create({
            key: "enemy",
            frames: this.anims.generateFrameNames("enemy01", {prefix: 'enemy-001-stay-', end: 3, zeroPad: 2 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "enemy2",
            frames: this.anims.generateFrameNames("enemy01", {prefix: 'enemy-002-stay-', end: 3, zeroPad: 2 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "middle_boss",
            frames: this.anims.generateFrameNames("middle_boss_idle"),
            frameRate: 4,
            repeat: -1
        });
        this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, "middle_boss").play("middle_boss").setScale(3);
        this.add.sprite(this.cameras.main.width - 200, this.cameras.main.height / 2, "enemy").play("enemy2").setScale(2);
    }
}