
import { Scene } from "../interface/Hex";

export default class Potion extends Phaser.GameObjects.Container {

    static readonly WIDTH: number = 64;

    static readonly HEIGHT: number = 64;


    constructor(scene: Scene) {
        super(scene,0,0)

        const redpotion = scene.add.image(0,0,"assets/images/shopScene/redpotion.png");

        this.setSize(64,64);

        this.add(redpotion);
    }


}