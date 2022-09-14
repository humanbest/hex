import { Scene } from "../interface/Hex";
import TopMenu from "../interface/TopMenu";

export default class InnScene extends Scene{

    static readonly KEY = {
        NAME: "InnScene",
        IMAGE: {
            Inn:"Inn",
            rest:"rest"
        }
    }

    constructor() {
        super(InnScene.KEY.NAME)
    }


    preload(): void {

        this.input.keyboard.on('keydown-F', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        })

        this.load.image(InnScene.KEY.IMAGE.Inn, "assets/images/innScene/Inn.png");
        this.load.image(InnScene.KEY.IMAGE.rest, "assets/images/innScene/rest.png");

    }

    create(): void {

        const background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, InnScene.KEY.IMAGE.Inn);
        background.setScale(this.cameras.main.width / background.width, this.cameras.main.height / background.height).setScrollFactor(0);

        new TopMenu(this, 0, 0);

        const restbutton = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2-30,InnScene.KEY.IMAGE.rest);
        restbutton.setScale(0.45)
            .setInteractive()
            .on("pointerover", () => this.add.tween({
                targets: restbutton,
                duration: 70,
                scale: 0.47
            }))
            .on("pointerout", () => this.add.tween({
                targets: restbutton,
                duration: 70,
                scale: 0.45
            }));


    }



}