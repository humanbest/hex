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
        this.load.image(CONFIG.IMAGE.BATTLE_SCENE_BACKGROUND, "assets/images/battleScene/background.png");
        this.load.animation('middle_boss_data', 'assets/animations/middle_boss.json');
        this.load.atlas("middle_boss", "assets/atlas/middle_boss.png", "assets/atlas/middle_boss.json");

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
        new TopMenu(this, 0, 0).setDepth(10);
        

        /** 카드 관리 컨테이너 */
        const cardManager = new CardManager(this, 0, 0).setDepth(9).setName(CONFIG.CONTAINER.CARD_MANAGER.NAME);

        for(let i = 0; i < CardManager.initCardCount; i++) cardManager.addCard();

        const middleBoss = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, "middle_boss");
        const skills = middleBoss.anims.animationManager["anims"].keys();

        let c = 0;
        this.input.keyboard.on('keydown-A', () => {
            if(++c === skills.length) c = 0;
            middleBoss.play(skills[c]);
        })

        middleBoss.play("idle").setScale(3);
    }
}