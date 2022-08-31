import { Scene } from "../interface/Hex";

export default class CharacterScene extends Scene 
{
    constructor() 
    {
        super(CharacterScene.name)
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
        this.load.image('SBGI', '/assets/images/characterScene/SBGI.png');
        this.load.image('Particle1', '/assets/images/characterScene/Particle1.png');
        this.load.image('Particle2', '/assets/images/characterScene/Particle2.png');
        this.load.image('Particle3', '/assets/images/characterScene/Particle3.png');


        this.load.image('smugglerSel', '/assets/images/characterScene/smugglerSel.png');
        this.load.image('phantomSel', '/assets/images/characterScene/phantomSel.png');
        this.load.image('WarwickSel', '/assets/images/characterScene/WarwickSel.png');
        this.load.image('question', '/assets/images/characterScene/question.png');
        this.load.image('LeftSel', '/assets/images/characterScene/LeftSel.png');
        this.load.image('RightSel', '/assets/images/characterScene/RightSel.png');

        this.load.image('smugglerBig', '/assets/images/characterScene/smugglerBig2.png')
        this.load.image('warwick', '/assets/images/characterScene/warwolfBig.png')
        this.load.image('phantom', '/assets/images/characterScene/phantomBig.png')
    }
    

    create(): void
    {
        this.add.image(300, 400, 'SBGI').setDepth(0);
        
        var sprite1 = this.add.sprite(220, 600, 'smugglerSel').setInteractive().setDepth(2);
        sprite1.on('pointerover', function (this: Phaser.GameObjects.Sprite){
            this.setTint(0x95dccf);
        });
        sprite1.on('pointerout', function (this: Phaser.GameObjects.Sprite){
            this.clearTint();
        });
        sprite1.on('pointerup', function (this: Phaser.GameObjects.Sprite){
            this.scene.add.image(0,0,'smugglerBig').setDepth(1).setOrigin(0);
            
        });


        var sprite2 = this.add.image(420, 600, 'phantomSel').setInteractive().setDepth(2);
        sprite2.on('pointerover', function (this: Phaser.GameObjects.Sprite){
            this.setTint(0x95dccf);
        });
        sprite2.on('pointerout', function (this: Phaser.GameObjects.Sprite){
            this.clearTint();
        });
        sprite2.on('pointerup', function (this: Phaser.GameObjects.Sprite){
            this.scene.add.image(0,0,'phantom').setDepth(1).setOrigin(0);
        });


        var sprite3 = this.add.image(620, 600, 'WarwickSel').setInteractive().setDepth(2);
        sprite3.on('pointerover', function (this: Phaser.GameObjects.Sprite){
            this.setTint(0x95dccf);
        });
        sprite3.on('pointerout', function (this: Phaser.GameObjects.Sprite){
            this.clearTint();
        });
        sprite3.on('pointerup', function (this: Phaser.GameObjects.Sprite){
            this.scene.add.image(0,0,'warwick').setDepth(1).setOrigin(0);
        });
        

        this.add.image(820, 600, 'question').setDepth(2);
        this.add.image(70, 600, 'LeftSel').setDepth(2);
        this.add.image(970, 600, 'RightSel').setDepth(2);   
    }

    update(): void {
        const group = this.physics.add.group();
        group.createMultiple([
            { key: 'Particle2', repeat: 1 },
        ]);
        group.children.iterate(this.createGem, this);

    }

    createGem (gem:any): void
    {
        Phaser.Geom.Rectangle.Random(this.physics.world.bounds, gem);
        gem.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    }
}
