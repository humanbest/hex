
// import { CONFIG } from "../config";
// import Card from "../object/Card";
// import { HexGame } from "./Interface";


import {Scene} from "./Hex";
// import Card from "../object/Card";
// import LoadScene from "../scene/LoadScene";

export default class Shopproduct extends Phaser.GameObjects.Container{

    private BuyableCards : Array<string> = [];
    // private CardPrice : Array<string> = [];

    get BuyableCard (){
        return this.BuyableCards;
    }
    getCardPrice (){
        return this.BuyableCards;
    }

    // private BuyableItems : Array<string> = [];


    constructor(scene: Scene, x: number, y: number, ) {

        super(scene, x, y);


        // const game = scene.game as HexGame;

        this.BuyableCards.push("fireball");
        this.BuyableCards.push("adrenaline");1
        this.BuyableCards.push("bamboo_spear");


        // const shopitems = new ShopItems(scene, 0, 0);
        // const shopcards = new ShopCards(scene, 0, 0);

    }

    // private pointerOver(card: Card): void
    // {
    //     if(!card.isSelected)
    //     {
    //         this.scene.add.tween({
    //             targets: card,
    //             y: this.height - Card.HEIGHT / 2,
    //             angle: 0,
    //             duration: 100,
    //             scale: 1,
    //             ease: 'Quad.easeInOut'
    //         });
    //     }
    // }

    // private shuffledDec (){
    //
    //     const dec : Array<string> = [];
    //
    //     dec.push(...Object.keys(this.game.cache.json.get(LoadScene.KEY.DATA.CARD)));
    //
    //     dec = shuffle(dec);
    //
    //     return dec;
    // }




}

// class ShopItems extends Phaser.GameObjects.Container{
//
//     constructor(scene: Scene, x: number, y: number) {
//
//         super(scene, x, y);
//
//         // const game = scene.game as HexGame;
//
//         this.add()
// }

// }
//
// class ShopCards extends Phaser.GameObjects.Container {
//
//     constructor(scene: Scene, x: number, y: number) {
//
//         super(scene, x, y);
//
//
//         // const game = scene.game as HexGame;
//
//     }
// }