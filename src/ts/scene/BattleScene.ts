import BattleManager from "../interface/BattleManager";
import { Scene } from "../interface/Hex";
import TopMenu from "../interface/TopMenu";

/**
 * Hex 게임의 배틀씬 입니다.
 * 
 * @author Rubisco
 * @since 2022-08-25 오후 7:41
 */
export default class BattleScene extends Scene 
{

    static readonly KEY = {
        NAME: "BattleScene",
        IMAGE: {
            BACKGROUND: "battleSceneBackground",
        }
    }

    constructor() 
    {
        super(BattleScene.KEY.NAME)
    }

    preload(): void
    {
        this.load.image(BattleScene.KEY.IMAGE.BACKGROUND, "assets/images/battleScene/background.png");
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
        const background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, BattleScene.KEY.IMAGE.BACKGROUND);
        background.setScale(this.cameras.main.width / background.width, this.cameras.main.height / background.height).setScrollFactor(0);

        /** 상단 메뉴 */
        new TopMenu(this, 0, 0).setDepth(10);
        

        /** 카드 관리 컨테이너 */
        const battleManager = new BattleManager(this, 0, 0).setDepth(9).setName(BattleManager.name);

        for(let i = 0; i < BattleManager.initCardCount; i++) battleManager.addCard();

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