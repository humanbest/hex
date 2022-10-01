import BattleManager from "../interface/BattleManager";
import { Scene } from "../interface/Hex";
import TopMenu from "../object/TopMenu";
import { CostContainer, RemainCardContainer, UsedCardContainer } from "../object/BattleObject";

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
            SWORD: "sword"
        }
    }

    constructor()
    {
        super(BattleScene.KEY.NAME)
    }

    preload(): void
    {
        super.preload();
        this.load.image(BattleScene.KEY.IMAGE.BACKGROUND, "assets/images/battleScene/background.png");
        this.load.image(BattleScene.KEY.IMAGE.SWORD, "assets/images/battleScene/battle_start.png");
        this.load.animation('middle_boss_data', 'assets/animations/middle_boss.json');
        this.load.atlas("middle_boss", "assets/atlas/middle_boss.png", "assets/atlas/middle_boss.json");
    }

    create(): void
    {
        /** 배틀씬 배경 */
        const background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, BattleScene.KEY.IMAGE.BACKGROUND);
        background.setScale(this.cameras.main.width / background.width, this.cameras.main.height / background.height).setScrollFactor(0);

        /** 상단 메뉴 */
        new TopMenu(this, 0, 0).setDepth(10);

        /** 배틀 관리 객체 */
        const battleManager = new BattleManager(this).addMonster();
        battleManager.cardManager.setDepth(1);

        /** 남은 카드 목록 UI 컨테이너 */
        new RemainCardContainer(battleManager);

        /** 사용한 카드 목록 UI 컨테이너 */
        new UsedCardContainer(battleManager);
        
        /** COST 표시 UI 컨테이너 */
        new CostContainer(battleManager);
        
        /** 배틀 시작 */
        battleManager.start();
    }
}