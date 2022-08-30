import Phaser from "phaser";
import { CONFIG } from "../config";
import { HexGame } from "../interface/Interface";

export class LoadScene extends Phaser.Scene 
{
    constructor() 
    {
        super({
            key: CONFIG.SCENES.LOAD 
        })
    }

    init(): void 
    {
        const element = document.createElement('style');
        document.head.appendChild(element);
        const sheet = element.sheet;
        let styles = '@font-face { font-family: "neodgm"; src: url("fonts/neodgm.woff") format("woff"); }\n';
        sheet!.insertRule(styles, 0);
    }

    preload(): void 
    {
        this.load.atlas(CONFIG.ATLAS.TOP, "assets/atlas/top.png", "assets/atlas/top.json");
        this.load.atlas(CONFIG.ATLAS.CARD_BASE, "assets/atlas/card_base.png", "assets/atlas/card_base.json");
        this.load.atlas(CONFIG.ATLAS.CARD_IMAGE, "assets/atlas/card_image.png", "assets/atlas/card_image.json");
        this.load.image(CONFIG.IMAGE.CARD_BACK, "assets/images/card_back.png");
        this.load.json(CONFIG.DATA.CARD_DATA, "assets/data/cardData.json");
        this.load.json(CONFIG.DATA.CARD_ADJUST, "assets/data/cardAdjust.json");

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        });

        this.load.on("progress", (percent: integer) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
        })

        this.load.on("complete", () => {

        })
    }

    create(): void 
    {
        (this.game as HexGame).player.dec.push(...Object.keys(this.game.cache.json.get(CONFIG.DATA.CARD_DATA)));
        this.scene.start(CONFIG.SCENES.MAP);
    }
}