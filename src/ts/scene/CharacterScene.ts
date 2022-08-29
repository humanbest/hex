import Phaser from "phaser";
import { CONFIG } from "../config";


export default class CharacterScene extends Phaser.Scene 
{
    constructor() 
    {
        super({
            key: CONFIG.SCENES.CHRACTER_SELECT 
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
        this.load.image('MSC3', '/images/MSC3.png');
        this.load.image('smugglerSel', '/images/smugglerSel.png');
        this.load.image('phantomSel', '/images/phantomSel.png');
        this.load.image('WarwickSel', '/images/WarwickSel.png');
        this.load.image('question', '/images/question.png');
        this.load.image('LeftSel', '/images/LeftSel.png');
        this.load.image('RightSel', '/images/RightSel.png');

        this.load.image('smuggler', '/images/smuggler.png')
        this.load.image('warwick', '/images/warwick.png')
        this.load.image('phantom', '/images/phantom.png')
    }
    

    create(): void
    {
        this.add.image(300, 400, 'MSC3').setDepth(1);
        
        var sprite = this.add.sprite(220, 400, 'smugglerSel').setInteractive().setDepth(2);
        sprite.on('pointerdown', function (this: Phaser.GameObjects.Sprite){
            this.setTint(0xff0000);
        });
        sprite.on('pointerout', function (this: Phaser.GameObjects.Sprite){
            this.clearTint();
        });

        this.add.image(420, 400, 'phantomSel').setDepth(2);
        this.add.image(620, 400, 'WarwickSel').setDepth(2);
        this.add.image(820, 400, 'question').setDepth(2);
        this.add.image(70, 400, 'LeftSel').setDepth(2);
        this.add.image(970, 400, 'RightSel').setDepth(2);
        
    }
}
 // const ex = this.add.text(this.game.canvas.width/2, this.game.canvas.height/2, "예제", {
        //     fontSize: "20px",
        //     color: "red"
        // }).setOrigin(0.5);
