import BattleManager from "../interface/BattleManager";
import { Scene } from "../interface/Hex";
import TopMenu from "../interface/TopMenu";
import Card from "../object/Card";
import MapScene from "./MapScene";

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
        },
        CONTAINER: {
            REMAIN_CARDS: "remainCards",
            USED_CARDS: "usedCards"
        },
        TEXT: {
            REMAIN_CARDS_COUNT: "remainCardsCount",
            USED_CARDS_COUNT: "usedCardsCount"
        }
    }

    constructor() 
    {
        super(BattleScene.KEY.NAME)
    }

    preload(): void
    {
        this.load.image(BattleScene.KEY.IMAGE.BACKGROUND, "assets/images/battleScene/background.png");
        this.load.image(BattleScene.KEY.IMAGE.SWORD, "assets/images/battleScene/battle_start.png");
        this.load.animation('middle_boss_data', 'assets/animations/middle_boss.json');
        this.load.atlas("middle_boss", "assets/atlas/middle_boss.png", "assets/atlas/middle_boss.json");

        this.input.keyboard.on('keydown-F',  () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        })

        this.input.keyboard
            .on('keydown-ONE',  () => this.scene.start(MapScene.KEY.NAME))
    }

    create(): void
    {
        /** 배틀씬 배경 */
        const background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, BattleScene.KEY.IMAGE.BACKGROUND);
        background.setScale(this.cameras.main.width / background.width, this.cameras.main.height / background.height).setScrollFactor(0);

        /** 상단 메뉴 */
        new TopMenu(this, 0, 0).setDepth(10);

        /** 배틀 관리 객체 */
        const battleManager = new BattleManager(this);
        battleManager.cardManager.setDepth(1);

        /** 남은 카드 목록 UI */

        this.add.container(Card.WIDTH * 0.25, this.game.canvas.height - Card.WIDTH * 0.25)
            .add(
                Array.from({length: 20}, (_, i) => 
                    new Card(this)
                        .setSize(Card.WIDTH, Card.HEIGHT)
                        .setPosition(2*i, -2*i)
                )
            )
            .add(this.add.circle(Card.WIDTH * 0.6, Card.HEIGHT * 0.4, 60, 0xffa500))
            .add(this.add.text(Card.WIDTH * 0.6, Card.HEIGHT * 0.4, battleManager.cardManager.remainCards.length.toString(), {
                    fontFamily: 'neodgm',
                    fontSize: "80px",
                    color: "white",
                    stroke: "black",
                    align: "center",
                    strokeThickness: 10
                })
                .setAngle(20).setOrigin(0.5).setShadow(2, 2, "black", 2, true, true).setName(BattleScene.KEY.TEXT.REMAIN_CARDS_COUNT)
            )
            .setSize(Card.WIDTH, Card.HEIGHT)
            .setScale(0.2)
            .setAngle(-20)
            .setName(BattleScene.KEY.CONTAINER.REMAIN_CARDS)
            .getAll(undefined, undefined, 0, 20)
            .forEach(card => (card as Card).getAll().forEach(img => (img as Phaser.GameObjects.Image).setTint(0xeeafaf)));

        /** 사용한 카드 목록 UI */
        this.add.container(this.game.canvas.width - Card.WIDTH * 0.25 + 8, this.game.canvas.height - Card.WIDTH * 0.25 - 8)
            .add(
                Array.from({length: 20}, (_, i) => 
                    new Card(this)
                        .setSize(Card.WIDTH, Card.HEIGHT)
                        .setPosition(-2*i, 2*i)
                )
            )
            .add(this.add.circle(-Card.WIDTH * 0.6 - 40, Card.HEIGHT * 0.4 + 40, 60, 0xffa500))
            .add(this.add.text(-Card.WIDTH * 0.6 - 40, Card.HEIGHT * 0.4 + 40, battleManager.cardManager.usedCards.length.toString(), {
                    fontFamily: 'neodgm',
                    fontSize: "80px",
                    color: "white",
                    stroke: "black",
                    align: "center",
                    strokeThickness: 10
                }).setAngle(-20).setOrigin(0.5).setShadow(2, 2, "black", 2, true, true).setName(BattleScene.KEY.TEXT.USED_CARDS_COUNT)
            )
            .setSize(Card.WIDTH, Card.HEIGHT)
            .setScale(0.2)
            .setAngle(20)
            .setName(BattleScene.KEY.CONTAINER.USED_CARDS)
            .getAll(undefined, undefined, 0, 20)
            .forEach(card => (card as Card).getAll().forEach(img => (img as Phaser.GameObjects.Image).setTint(0xaeddef)));

        this.add.container(Card.WIDTH * 0.5, this.game.canvas.height - Card.WIDTH * 0.8)
            .add(this.add.circle(0, 0, 42, 0xd2be97).setStrokeStyle(2, 0xffffff))
            .add(this.add.circle(0, 0, 35, 0xff7f00).setStrokeStyle(5, 0xff5500))
            .add(this.add.text(0, 0, `${battleManager.plyerCharacter.cost}/${battleManager.plyerCharacter.originData.cost}`, {
                fontFamily: 'neodgm',
                fontSize: "30px",
                color: "white",
                stroke: "black",
                align: "center",
                strokeThickness: 2
            }).setOrigin(0.5).setShadow(2, 2, "black", 2, true, true));
            
        battleManager.start();

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