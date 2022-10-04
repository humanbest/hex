import {defaultPlayer, Scene} from "./Hex";
import ShopScene, {ShopCard} from "../scene/ShopScene";

export default class Shopproduct extends Phaser.GameObjects.Container {

    public notEnough: Phaser.GameObjects.Image;
    private buycomplete: Phaser.GameObjects.Image;
    private maximumdec: Phaser.GameObjects.Image;

    /** 덱 상한치 */
    private maxDeclength: number = 19;

    constructor(shopScene: Scene) {

        super(shopScene);
        this.scene = shopScene;
        this.notEnough = shopScene.add.image(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, ShopScene.KEY.IMAGE.notenough).setDepth(100).setVisible(false);
        this.buycomplete = shopScene.add.image(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, ShopScene.KEY.IMAGE.buycomplete).setDepth(100).setVisible(false);
        this.maximumdec = shopScene.add.image(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, ShopScene.KEY.IMAGE.maximumdec).setDepth(100).setVisible(false);
    }

    buyShopCard(scene : Scene, shopcard: ShopCard, CardList : Array<string>): void {

        let selectedCard : string;

        for(let i = 0; i<CardList.length; i++){
            let card = new ShopCard(scene, CardList[i], true, false);
            if(card.name == shopcard.name){
                selectedCard = CardList[i];
            }
            card.destroy();
        }

        if (defaultPlayer.dec.length > this.maxDeclength) {
            this.notification(this.maximumdec);
        } else {
            if (defaultPlayer.inventory.coin > shopcard.price) {
               // @ts-ignore
                defaultPlayer.dec.push(selectedCard);
               defaultPlayer.inventory.coin -= shopcard.price;
               this.notification(this.buycomplete);
               shopcard.destroy();
            } else {
                this.notification(this.notEnough);
            }
        }
    }

    sellShopCard (scene : Scene, shopcardname: string) : void {
        for(let i=0; i<defaultPlayer.dec.length; i++){
            let card = new ShopCard(scene, defaultPlayer.dec[i], true, false);
            if(card.name == shopcardname){
                defaultPlayer.dec.splice(i,1);
            }
            card.destroy();
        }
    }


    notification(img: Phaser.GameObjects.Image) {

        img.setAlpha(0).setVisible(true);

        this.scene.tweens.createTimeline().add({
            targets: img,
            alpha: 1,
            duration: 300
        }).add({
            targets: img,
            alpha: 0,
            duration: 300,
            delay: 700
        }).on("complete", () => img.setVisible(false)).play();
    }

    buyShopitem(): void {

    }

    delayimage(image: Phaser.GameObjects.Image): void {
        image.destroy();
    }
}