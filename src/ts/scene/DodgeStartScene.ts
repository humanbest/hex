import {Scene} from "../interface/Hex";
import DodgeScene from "./DodgeScene";

export default class DodgeStartScene extends Scene {

    static readonly KEY = {
        NAME: "DodgeStartScene",
        IMAGE: {
            dodgemain: "dodgemain",
            dodgestart: "dodgestart",
            dodgemission: "dodgemission"
        }
    }

    constructor() {
        super(DodgeStartScene.KEY.NAME)
    }

    preload(): void {

        this.input.keyboard.on('keydown-F', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        })

        this.load.image(DodgeStartScene.KEY.IMAGE.dodgemain, "assets/images/dodgeScene/dodgemain.png");
        this.load.image(DodgeStartScene.KEY.IMAGE.dodgestart, "assets/images/dodgeScene/dodgestart.png");
        this.load.image(DodgeStartScene.KEY.IMAGE.dodgemission, "assets/images/dodgeScene/dodgemission.png");

    }

    create(): void {

        this.add.image(this.cameras.main.width / 2, 100, DodgeStartScene.KEY.IMAGE.dodgemain);
        this.add.image(this.cameras.main.width / 2, 300, DodgeStartScene.KEY.IMAGE.dodgemission).setScale(0.6);
        let startbutton = this.add.image(this.cameras.main.width / 2, 500, DodgeStartScene.KEY.IMAGE.dodgestart)
            .setScale(1)
            .setInteractive()
            .on("pointerover", () => this.add.tween({
                targets: startbutton,
                duration: 70,
                scale: 1.1
            }))
            .on("pointerout", () => this.add.tween({
                targets: startbutton,
                duration: 70,
                scale: 1
            }))
            .on("pointerdown", () => startbutton.setScale(1.2))
            .on("pointerup", () => this.scene.start(DodgeScene.KEY.NAME));

    }

}