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
        this.load.atlas(CONFIG.SPRITE.TOP, "images/top.png", "images/top.json");
        this.load.atlas(CONFIG.SPRITE.CARD_BASE, "images/card_base.png", "images/card_base.json");
        this.load.atlas(CONFIG.SPRITE.CARD_IMAGE, "images/card_image.png", "images/card_image.json");
        this.load.json(CONFIG.DATA.CARD_DATA, "data/cardData.json");
        this.load.json(CONFIG.DATA.CARD_ADJUST, "data/cardAdjust.json");
        
        

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
        this.scene.start(CONFIG.SCENES.CHRACTER_SELECT);
    }
}