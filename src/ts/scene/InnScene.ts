import {Scene} from "../interface/Hex";
import TopMenu from "../interface/TopMenu";

export default class InnScene extends Scene{

    static readonly KEY = {
        NAME: "InnScene",
        IMAGE: {
            Innbackground:"Innbackground"
        }
    }

    constructor() {
        super(InnScene.KEY.NAME)
    }


    preload(): void {

        this.load.image(InnScene.KEY.IMAGE.Innbackground, "assets/images/innScene/Innbackground.png");

    }

    create(): void {

        new TopMenu(this, 0, 0);

        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, InnScene.KEY.IMAGE.Innbackground);

    }



}