import TopMenu from "../interface/TopMenu";
import Shopproduct from "../interface/Shopproduct";
import Card from "../object/Card";
import {Scene} from "../interface/Hex";

export class ShopCard extends Card {

    private readonly _price: number = 0;

    constructor(scene: Scene, price: number, cardName?: string, isFront?: boolean) {
        super(scene, cardName, isFront);
        this._price = price;
    }

    get price(): number {
        return this._price;
    }
}

export default class ShopScene extends Scene
{
    constructor()
    {
        super(ShopScene.name)
    }

    preload(): void
    {
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
        new TopMenu(this, 0, 0);


        const shopproduct = new Shopproduct(this, 0,10);

        this.add.image(this.cameras.main.width,TopMenu.HEIGHT + 10,"ShopOwner").setOrigin(1, 0).setScale(0.5);

        this.add.image(5,40,"ShopPaper").setOrigin(0,0);

        this.add.image(this.cameras.main.width+70,600,"MYDEC").setOrigin(1,0.5).setScale(0.27);
        this.add.image(this.cameras.main.width+70,700,"EXIT").setOrigin(1,0.5).setScale(0.27);

        const card1 = new ShopCard(this, 0, shopproduct.getBuyableCards().pop(), true).setScale(0.9);
        const card2 = new ShopCard(this, 0, shopproduct.getBuyableCards().pop(), true).setScale(0.9);
        const card3 = new ShopCard(this, 0, shopproduct.getBuyableCards().pop(), true).setScale(0.9);

        this.add.existing(card1);
        this.add.existing(card2);
        this.add.existing(card3);

        Phaser.Actions.GridAlign([card1, card2, card3], {
            width: (Card.WIDTH + 20) * 3,
            height: Card.HEIGHT,
            cellWidth: Card.WIDTH + 20,
            cellHeight: Card.HEIGHT,
            x: Card.WIDTH + 70,
            y: TopMenu.HEIGHT + Card.HEIGHT * 2 + 100
        });
    }
}