import { Scene } from "../interface/Hex";

export default class CharacterScene extends Scene 
{

    static readonly KEY = {
        NAME: "CharacterScene"
    }
    constructor() 
    {
        super(CharacterScene.KEY.NAME)
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
        this.load.image('SBGI', 'assets/images/characterScene/SBGI.png');
        this.load.image('Particle1', 'assets/images/characterScene/Particle1.png');
        this.load.image('Particle2', 'assets/images/characterScene/Particle2.png');
        this.load.image('Particle3', 'assets/images/characterScene/Particle3.png');


        this.load.image('smugglerSel', 'assets/images/characterScene/smugglerSel.png');
        this.load.image('phantomSel', 'assets/images/characterScene/phantomSel.png');
        this.load.image('WarwickSel', 'assets/images/characterScene/WarwickSel.png');
        this.load.image('question', 'assets/images/characterScene/question.png');
        this.load.image('LeftSel', 'assets/images/characterScene/LeftSel.png');
        this.load.image('RightSel', 'assets/images/characterScene/RightSel.png');

        this.load.image('smugglerBig', 'assets/images/characterScene/smugglerBig2.png')
        this.load.image('warwick', 'assets/images/characterScene/warwolfBig.png')
        this.load.image('phantom', 'assets/images/characterScene/phantomBig.png')
    }
    
    create(): void
    {
    
        this.add.image(300, 400, 'SBGI').setDepth(1).setVisible(true)

        const buttons = [
            this.add.image(220, 600, 'smugglerSel'),
            this.add.image(420, 600, 'phantomSel'),
            this.add.image(620, 600, 'WarwickSel')
        ].map(button => button.setInteractive().setDepth(3));

    
        const imgs = [
            this.add.image(0,0,'smugglerBig').setDepth(2).setOrigin(0).setVisible(false).setInteractive(),
            this.add.image(0,0,'phantom').setDepth(2).setOrigin(0).setVisible(false).setInteractive(),
            this.add.image(0,0,'warwick').setDepth(2).setOrigin(0).setVisible(false).setInteractive()
            
        ];
        
        buttons.map((button, i) => {
            button.on("pointerover", () => {
                button.setTint(0x95dccf);
            }).on("pointerout", () => {
                button.clearTint();
            }).on("pointerdown", ()=> imgs.map((img, j) => i === j ? img.setVisible(true) : img.setVisible(false)))
        })

        imgs.map(img => img.on("pointerdown", function(this:Phaser.GameObjects.Image){this.setVisible(false)}))
        this.registry.set("imgs", imgs);
       

        this.add.image(820, 600, 'question').setDepth(2);
        this.add.image(70, 600, 'LeftSel').setDepth(2);
        this.add.image(970, 600, 'RightSel').setDepth(2);

        const Particle2 = this.physics.add.image(0,0, 'Particle2');
        Particle2.setVelocity(150,150);
        this.registry.set('Particle2',Particle2);
        
    }

    update(): void {
        this.physics.world.wrap('Particle2',48);

    }
}
