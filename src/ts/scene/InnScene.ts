import { Scene } from "../interface/Hex";
import TopMenu from "../interface/TopMenu";

export default class InnScene extends Scene{

    static readonly KEY = {
        NAME: "InnScene",
        IMAGE: {
            Inn:"Inn"
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

    }

    create(): void {

        new TopMenu(this, 0, 0);

        console.log("dd");

        this.add.image(300,300, InnScene.KEY.IMAGE.Inn);

    }



}