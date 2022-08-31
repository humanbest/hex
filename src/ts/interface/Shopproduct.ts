import { Scene } from "phaser";
// import { CONFIG } from "../config";
// import Card from "../object/Card";
// import { HexGame } from "./Interface";


export default class Shopproduct extends Phaser.GameObjects.Container{

    private BuyableCards : Array<string> = [];
    // private CardPrice : Array<string> = [];

    getBuyableCards (){
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
        this.BuyableCards.push("adrenaline");
        this.BuyableCards.push("bamboo_spear");




        // const shopitems = new ShopItems(scene, 0, 0);
        // const shopcards = new ShopCards(scene, 0, 0);

    }

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