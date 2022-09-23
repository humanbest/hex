import BattleManager from "../interface/BattleManager";
import { Scene } from "../interface/Hex";
import TopMenu from "../object/TopMenu";
import Card from "../object/Card";

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

    private battleManager?: BattleManager;
    private remainCardsCountText?: Phaser.GameObjects.Text;
    private usedCardsCountText?: Phaser.GameObjects.Text;
    private costText?: Phaser.GameObjects.Text;

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
        this.battleManager = new BattleManager(this);
        this.battleManager.cardManager.setDepth(1);

        /** 남은 카드 목록 UI 컨테이너 */
        this.add.container(Card.WIDTH * 0.25, this.game.canvas.height - Card.WIDTH * 0.25)
            .add(
                Array.from({length: 20}, (_, i) => 
                    new Card(this)
                        .setSize(Card.WIDTH, Card.HEIGHT)
                        .setPosition(2*i, -2*i)
                )
            )
            .add(this.add.circle(Card.WIDTH * 0.6, Card.HEIGHT * 0.4, 60, 0xffa500))
            .add(this.remainCardsCountText = this.add.text(Card.WIDTH * 0.6, Card.HEIGHT * 0.4, this.battleManager.cardManager.remainCards.length.toString(), {
                    fontFamily: 'neodgm',
                    fontSize: "80px",
                    color: "white",
                    stroke: "black",
                    align: "center",
                    strokeThickness: 10
                })
                .setAngle(20).setOrigin(0.5).setShadow(2, 2, "black", 2, true, true)
            )
            .setSize(Card.WIDTH, Card.HEIGHT)
            .setScale(0.2)
            .setAngle(-20)
            .getAll(undefined, undefined, 0, 20)
            .forEach(card => (card as Card).getAll().forEach(img => (img as Phaser.GameObjects.Image).setTint(0xeeafaf)));

        /** 사용한 카드 목록 UI 컨테이너 */
        this.add.container(this.game.canvas.width - Card.WIDTH * 0.25 + 8, this.game.canvas.height - Card.WIDTH * 0.25 - 8)
            .add(
                Array.from({length: 20}, (_, i) => 
                    new Card(this)
                        .setSize(Card.WIDTH, Card.HEIGHT)
                        .setPosition(-2*i, 2*i)
                )
            )
            .add(this.add.circle(-Card.WIDTH * 0.6 - 40, Card.HEIGHT * 0.4 + 40, 60, 0xffa500))
            .add(this.usedCardsCountText = this.add.text(-Card.WIDTH * 0.6 - 40, Card.HEIGHT * 0.4 + 40, this.battleManager.cardManager.usedCards.length.toString(), {
                    fontFamily: 'neodgm',
                    fontSize: "80px",
                    color: "white",
                    stroke: "black",
                    align: "center",
                    strokeThickness: 10
                }).setAngle(-20).setOrigin(0.5).setShadow(2, 2, "black", 2, true, true)
            )
            .setSize(Card.WIDTH, Card.HEIGHT)
            .setScale(0.2)
            .setAngle(20)
            .getAll(undefined, undefined, 0, 20)
            .forEach(card => (card as Card).getAll().forEach(img => (img as Phaser.GameObjects.Image).setTint(0xaeddef)));
        
        /** COST 표시 UI 컨테이너 */
        this.add.container(Card.WIDTH * 0.5, this.game.canvas.height - Card.WIDTH * 0.8)
            .add(this.add.circle(0, 0, 42, 0xd2be97).setStrokeStyle(2, 0xffffff))
            .add(this.add.circle(0, 0, 35, 0xff7f00).setStrokeStyle(5, 0xff5500))
            .add(this.costText = this.add.text(0, 0, `${this.battleManager.plyerCharacter.cost}/${this.battleManager.plyerCharacter.originData.cost}`, {
                fontFamily: 'neodgm',
                fontSize: "30px",
                color: "white",
                stroke: "black",
                align: "center",
                strokeThickness: 2
            }).setOrigin(0.5).setShadow(2, 2, "black", 2, true, true));

        /** 배틀 시작 */
        this.battleManager.start();
    }

    update(_time: number, _delta: number): void {

        if(!this.battleManager) return;

        if(this.usedCardsCountText) this.usedCardsCountText.setText(this.battleManager.cardManager.usedCards.length.toString());
        if(this.remainCardsCountText) this.remainCardsCountText.setText(this.battleManager.cardManager.remainCards.length.toString());
        if(this.costText) this.costText.setText(`${this.battleManager.plyerCharacter.cost}/${this.battleManager.plyerCharacter.originData.cost}`);
    }
}