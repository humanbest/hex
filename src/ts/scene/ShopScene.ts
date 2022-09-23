import TopMenu from "../object/TopMenu";
import Card from "../object/Card";
import {Scene} from "../interface/Hex";
import LoadScene from "./LoadScene";

// import Shopproduct from "../interface/Shopproduct";

export class ShopCard extends Card {

    private readonly _price: number = 0;
    private static readonly ORIGIN_SCALE: number = 0.9;
    private static readonly HOVER_SCALE: number = 0.95;
    private static readonly CLICK_SCALE: number = 1;

    constructor(scene: Scene, price: number, cardName?: string, isFront?: boolean) {
        super(scene, cardName, isFront);
        this._price = price;
        this.setSize(Card.WIDTH, Card.HEIGHT)
            .setScale(ShopCard.ORIGIN_SCALE)
            .setInteractive()
            .on("pointerover", () => this.scene.add.tween({
                targets: this,
                duration: 70,
                scale: ShopCard.HOVER_SCALE
            }))
            .on("pointerout", () => this.scene.add.tween({
                targets: this,
                duration: 70,
                scale: ShopCard.ORIGIN_SCALE
            }))
            .on("pointerdown", () => this.setScale(ShopCard.CLICK_SCALE))
            .on("pointerup", () => this.destroy());
        scene.add.existing(this);
    }

    get price(): number {
        return this._price;
    }
}

export default class ShopScene extends Scene {

    static readonly KEY = {
        NAME: "ShopScene",
        IMAGE: {
            ShopOwner: "ShopOwner",
            ShopPaper: "ShopPaper",
            ShopMyDec: "ShopMyDec",
            ShopExit: "ShopExit",
            ShopPotion: "ShopPotion"
        }
    }

    constructor() {
        super(ShopScene.KEY.NAME)
    }

    preload(): void {
        this.input.keyboard.on('keydown-F', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        })

        this.load.image(ShopScene.KEY.IMAGE.ShopOwner, "assets/images/shopScene/ShopOwner.png");
        this.load.image(ShopScene.KEY.IMAGE.ShopPaper, "assets/images/shopScene/paper-plain.png");
        this.load.image(ShopScene.KEY.IMAGE.ShopMyDec, "assets/images/shopScene/MYDEC.png");
        this.load.image(ShopScene.KEY.IMAGE.ShopExit, "assets/images/shopScene/EXIT.png");

        /** 더미 카드 이미지 */
        this.load.image(ShopScene.KEY.IMAGE.ShopPotion, "assets/iamges/shopScene/potion.png");
    }

    create(): void {

        const Shuffle: (array: string[]) => string[] = Phaser.Utils.Array.Shuffle;

        new TopMenu(this, 0, 0);

        this.add.image(this.cameras.main.width, TopMenu.HEIGHT + 10, ShopScene.KEY.IMAGE.ShopOwner).setOrigin(1, 0).setScale(0.5);

        this.add.image(5, 40, ShopScene.KEY.IMAGE.ShopPaper).setOrigin(0, 0);

        [
            this.add.image(this.cameras.main.width - 150, 650, ShopScene.KEY.IMAGE.ShopExit),
            this.add.image(this.cameras.main.width - 150, 550, ShopScene.KEY.IMAGE.ShopMyDec)
        ].forEach((image: Phaser.GameObjects.Image)=>image
            .setScale(0.27)
            .setInteractive()
            .on("pointerover", () => this.add.tween({
                targets: image,
                duration: 70,
                scale: 0.28
            }))
            .on("pointerout", () => this.add.tween({
                targets: image,
                duration: 70,
                scale: 0.27
            })))



        const cardNameArr: Array<string> = Object.keys(this.game.cache.json.get(LoadScene.KEY.DATA.CARD));
        const cardArr: Array<ShopCard> = Shuffle(cardNameArr).slice(0, 3).map(cardName => new ShopCard(this, 0, cardName, true));

        Phaser.Actions.GridAlign([cardArr[0], cardArr[1], cardArr[2]], {
            width: (Card.WIDTH + 20) * 3,
            height: Card.HEIGHT,
            cellWidth: Card.WIDTH + 20,
            cellHeight: Card.HEIGHT,
            x: this.cameras.main.width / 6,
            y: this.cameras.main.height - (Card.HEIGHT / 1.5)
        });
    }

}