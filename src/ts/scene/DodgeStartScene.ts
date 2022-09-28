import {Scene} from "../interface/Hex";
import DodgeScene from "./DodgeScene";

export default class DodgeStartScene extends Scene {

    static readonly KEY = {
        NAME: "DodgeStartScene",
        IMAGE: {
            dodgemain: "dodgemain",
            dodgestart: "dodgestart",
            dodgemission: "dodgemission",
            dodgebacktoshop:"dodgebacktoshop",
            background:"background"
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
        this.load.image(DodgeStartScene.KEY.IMAGE.dodgebacktoshop, "assets/images/dodgeScene/dodgebacktoshop.png");
        this.load.image(DodgeStartScene.KEY.IMAGE.background, "assets/images/dodgeScene/background.png");

    }

    create(): void {

        this.add.image(this.cameras.main.width / 2,this.cameras.main.height / 2,DodgeStartScene.KEY.IMAGE.background);

        this.add.image(this.cameras.main.width / 2, 100, DodgeStartScene.KEY.IMAGE.dodgemain);
        this.add.image(this.cameras.main.width / 2, 300, DodgeStartScene.KEY.IMAGE.dodgemission).setScale(0.6);
        let startbutton = this.add.image(this.cameras.main.width / 2, 500, DodgeStartScene.KEY.IMAGE.dodgestart)
            .setScale(1)
            .setInteractive()
            .on("pointerover", () => this.add.tween({
                targets: startbutton,
                duration: 70,
                scale: 1.05
            }))
            .on("pointerout", () => this.add.tween({
                targets: startbutton,
                duration: 70,
                scale: 1
            }))
            .on("pointerdown", () => startbutton.setScale(1.1))
            .on("pointerup", () => this.scene.start(DodgeScene.KEY.NAME));

        let backtoshop = this.add.image(this.cameras.main.width / 2, 630, DodgeStartScene.KEY.IMAGE.dodgebacktoshop)
            .setScale(0.7)
            .setInteractive()
            .on("pointerover", () => this.add.tween({
                targets: backtoshop,
                duration: 70,
                scale: 0.75
            }))
            .on("pointerout", () => this.add.tween({
                targets: backtoshop,
                duration: 70,
                scale: 0.7
            }))
            .on("pointerdown", () => backtoshop.setScale(0.78))
            .on("pointerup", () => this.scene.stop(this));

    }
}