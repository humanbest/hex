import {defaultPlayer, Scene} from "./Hex";
import ShopScene, {ShopCard} from "../scene/ShopScene";

export default class Shopproduct extends Phaser.GameObjects.Container {

    public notEnough: Phaser.GameObjects.Image;
    private buycomplete: Phaser.GameObjects.Image;
    private maximumdec: Phaser.GameObjects.Image;

    /** 덱 상한치 */
    private maxDeclength: number = 18;

    constructor(shopScene: Scene) {

        super(shopScene);
        this.scene = shopScene;
        this.notEnough = shopScene.add.image(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, ShopScene.KEY.IMAGE.notenough).setDepth(100).setVisible(false);
        this.buycomplete = shopScene.add.image(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, ShopScene.KEY.IMAGE.buycomplete).setDepth(100).setVisible(false);
        this.maximumdec = shopScene.add.image(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, ShopScene.KEY.IMAGE.maximumdec).setDepth(100).setVisible(false);
    }

    buyShopCard(shopcard: ShopCard): void {

        if (defaultPlayer.dec.length > this.maxDeclength) {
            this.notification(this.maximumdec);
        } else {
            if (defaultPlayer.inventory.coin > shopcard.price) {
               defaultPlayer.dec.push(shopcard.name);
               defaultPlayer.inventory.coin -= shopcard.price;
               this.notification(this.buycomplete);
               shopcard.destroy();
            } else {
                this.notification(this.notEnough);
            }
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