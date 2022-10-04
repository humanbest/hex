import {defaultPlayer, Scene} from "../interface/Hex";
import ShopScene, {ShopCard} from "../scene/ShopScene";
import Shopproduct from "../interface/Shopproduct";

export default class DecViewer extends Phaser.GameObjects.Container {

    private sellButton: CardSellButton | undefined;

    constructor(scene: Scene, isShop: boolean) {
        super(scene, 0, 0)


        let declength = defaultPlayer.dec.length;

        let counter = 0;

        console.log(declength);

        let background = scene.add.tileSprite(20, 60, 980, 700, ShopScene.KEY.IMAGE.woodtexture).setOrigin(0, 0).setInteractive();
        this.add(background);

        for (let y = 0; y < declength / 5 + 1; y++) {
            for (let x = 0; x < 7; x++) {

                console.log(counter);

                let card = new ShopCard(scene, defaultPlayer.dec[counter], true, false);

                let viewcard = scene.add.container(135 * x + 100, 200 * y + 180, card)
                    .setScale(0.7)
                    .on("pointerover", () => this.scene.add.tween({
                        targets: card,
                        duration: 70,
                        scale: 0.76
                    }))
                    .on("pointerout", () => this.scene.add.tween({
                        targets: card,
                        duration: 70,
                        scale: 0.7
                    }));

                if (isShop) {
                    card.on("pointerdown", () => this.scene.add.tween({
                        targets: Exit,
                        duration: 70,
                        scale: 0.8
                    }))
                        .on("pointerup", () => this.createSellButton(scene,card,isShop, this))
                }

                this.add(viewcard);

                counter += 1;

                if (counter == declength) {
                    break;
                }
            }
            if (counter == declength) {
                break;
            }
        }

        let Exit = scene.add.image(scene.game.canvas.width / 2, scene.game.canvas.height - 50, ShopScene.KEY.IMAGE.ExitButton)
            .setScale(0.8)
            .setInteractive()
            .on("pointerover", () => this.scene.add.tween({
                targets: Exit,
                duration: 70,
                scale: 0.83
            }))
            .on("pointerout", () => this.scene.add.tween({
                targets: Exit,
                duration: 70,
                scale: 0.8
            }))
            .on("pointerdown", () => this.scene.add.tween({
                targets: Exit,
                duration: 70,
                scale: 0.85
            }))
            .on("pointerup", () => this.destroy());

        this.add(Exit);

        scene.add.existing(this);
    }

    createSellButton (scene : Scene, card : ShopCard, isShop : boolean, thisviewer : DecViewer) : void {
        if(isShop){
            if(this.sellButton == undefined){
                this.sellButton = new CardSellButton(scene,card,thisviewer);
            }
            else{
                this.sellButton.destroy();
                this.sellButton = new CardSellButton(scene,card,thisviewer);
            }
        }
    }
}

export class CardSellButton extends Phaser.GameObjects.Container{

    constructor(scene: Scene, card : ShopCard, thisviewer : DecViewer) {
        super(scene, 0, 0)

        let sellBox = scene.add.image(scene.game.canvas.width / 2, scene.game.canvas.height / 2, ShopScene.KEY.IMAGE.sellBox).setScale(2).setInteractive();

        let sellYes = scene.add.image(scene.game.canvas.width / 2 - 80, scene.game.canvas.height / 2 + 60, ShopScene.KEY.IMAGE.sellYes)
            .setScale(2)
            .setInteractive()
            .on("pointerover", () => this.scene.add.tween({
                targets: sellYes,
                duration: 70,
                scale: 2.1
            }))
            .on("pointerout", () => this.scene.add.tween({
                targets: sellYes,
                duration: 70,
                scale: 2
            }))
            .on("pointerdown", () => this.scene.add.tween({
                targets: sellYes,
                duration: 70,
                scale: 2.2
            }))
            .on("pointerup", () => this.sellbuttonaction(scene,card,thisviewer));


        let sellNo = scene.add.image(scene.game.canvas.width / 2 + 90, scene.game.canvas.height / 2 + 60, ShopScene.KEY.IMAGE.sellNo)
            .setScale(2)
            .setInteractive()
            .on("pointerover", () => this.scene.add.tween({
                targets: sellNo,
                duration: 70,
                scale: 2.1
            }))
            .on("pointerout", () => this.scene.add.tween({
                targets: sellNo,
                duration: 70,
                scale: 2
            }))
            .on("pointerdown", () => this.scene.add.tween({
                targets: sellNo,
                duration: 70,
                scale: 2.2
            }))
            .on("pointerup", () => this.destroy());

        let sellText = scene.add.text(scene.game.canvas.width / 2, scene.game.canvas.height / 2-50,card.name+" 을(를) \n"+card.price*0.8+"코인에 판매 하시겠습니까?",
        {
            align: "center",
            fontFamily: 'neodgm',
            fontSize: "25px",
            color: "black",
            stroke: "black",
            strokeThickness: 1
        })
            .setOrigin(0.5)

        this.add([sellBox,sellYes,sellText]);
        this.add(sellNo);

        scene.add.existing(this);
    }

    sellbuttonaction (scene : Scene, card : ShopCard, thisviewer : DecViewer) : void {

        let shopproduct = new Shopproduct(scene);

        defaultPlayer.inventory.coin += card.price*0.8;

        shopproduct.sellShopCard(scene,card.name);
        thisviewer.destroy();
        new DecViewer(scene,true);
        this.destroy();
    }
}