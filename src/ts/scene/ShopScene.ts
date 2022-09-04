import TopMenu from "../interface/TopMenu";
import Card from "../object/Card";
import {Scene} from "../interface/Hex";
import LoadScene from "./LoadScene";
import Shuffle = Phaser.Utils.Array.Shuffle;
// import Shopproduct from "../interface/Shopproduct";

export class ShopCard extends Card {

    private readonly _price: number = 0;


    constructor(scene: Scene, price: number, cardName?: string, isFront?: boolean) {
        super(scene, cardName, isFront);
        this._price = price;
        this.setInteractive();
        this.on("pointerDown",()=>this.setSize(50,50));
    }

    get price(): number {
        return this._price;
    }

    // private pointerDown (card:Shopcard):void{
    //     this.destroy()
    // }

}

export default class ShopScene extends Scene
{
    static readonly KEY = {
        NAME: "ShopScene",
        IMAGE:{
            ShopOwner:"ShopOwner",
            ShopPaper:"ShopPaper",
            ShopMyDec:"ShopMyDec",
            ShopExit:"ShopExit",
            ShopPotion:"ShopPotion"
        }
    }

    constructor()
    {
        super(ShopScene.KEY.NAME)
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

        this.load.image(ShopScene.KEY.IMAGE.ShopOwner,"assets/images/shopScene/ShopOwner.png");
        this.load.image(ShopScene.KEY.IMAGE.ShopPaper,"assets/images/shopScene/paper-plain.png");
        this.load.image(ShopScene.KEY.IMAGE.ShopMyDec,"assets/images/shopScene/MYDEC.png");
        this.load.image(ShopScene.KEY.IMAGE.ShopExit,"assets/images/shopScene/EXIT.png");

        /** 더미 카드 이미지 */
        this.load.image(ShopScene.KEY.IMAGE.ShopPotion,"assets/iamges/shopScene/potion.png");
    }

    create(): void
    {
        new TopMenu(this, 0, 0);

        const dec : Array<string> = this.shuffledDec();

        this.add.image(this.cameras.main.width,TopMenu.HEIGHT + 10,ShopScene.KEY.IMAGE.ShopOwner).setOrigin(1, 0).setScale(0.5);

        this.add.image(5,40,ShopScene.KEY.IMAGE.ShopPaper).setOrigin(0,0);

        this.add.image(this.cameras.main.width+70,600,ShopScene.KEY.IMAGE.ShopMyDec).setOrigin(1,0.5).setScale(0.27);
        this.add.image(this.cameras.main.width+70,700,ShopScene.KEY.IMAGE.ShopExit).setOrigin(1,0.5).setScale(0.27);

        const card1 = new ShopCard(this, 0, dec.pop(), true).setScale(0.9);
        const card2 = new ShopCard(this, 0, dec.pop(), true).setScale(0.9);
        const card3 = new ShopCard(this, 0, dec.pop(), true).setScale(0.9);

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

    private shuffledDec (){

        const dec : Array<string> = [];

        dec.push(...Object.keys(this.game.cache.json.get(LoadScene.KEY.DATA.CARD)));

        return Shuffle(dec);
    }



    // private temporarypotion (){
    //
    //
    // }

}