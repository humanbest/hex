import Phaser from "phaser";
import { CONFIG } from "../config";
import CardManager from "../interface/CardManager";
import TopMenu from "../ui/TopMenuUI";

export class BattleScene extends Phaser.Scene 
{
    constructor() 
    {
        super({
            key: CONFIG.SCENES.MAIN 
        })
    }

    preload(): void 
    {
        this.input.keyboard.on('keydown-F',  () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        })
        
    }

    create(): void
    {
        new TopMenu(this, 0, 0).setInteractive();
        const cardManager = new CardManager(this, 0, 0);

        this.input.keyboard.on('keydown-SPACE',  () => cardManager.addCard(false));
    }
}