
import {defaultPlayer, Scene} from "../interface/Hex";
import {ShopCard} from "../scene/ShopScene";

export default class DecViewer extends Phaser.GameObjects.Container {

    constructor(scene: Scene) {
        super(scene, 0, 0)

        let declength = defaultPlayer.dec.length;

        let counter = 0;

        console.log(declength);

        console.log(defaultPlayer.dec[17]);
        console.log(defaultPlayer.dec[16]);

        for(let y=0; y<declength/5+1; y++){
            for(let x=0; x<6; x++){

                console.log(counter);

                let card = new ShopCard(scene,defaultPlayer.dec[counter],true,false);

                scene.add.container( 130 * x + 100 , 200 * y + 180 ,card)
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

                counter += 1;

                if(counter == declength){
                    break;
                }
            }
            if(counter == declength){
                break;
            }
        }



    }


}