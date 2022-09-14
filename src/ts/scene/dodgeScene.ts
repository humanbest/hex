import { Scene } from "../interface/Hex";


export default class DodgeScene extends Scene{

    static readonly KEY = {
        NAME: "DodgeScene",
        IMAGE: {
            mushroom:"mushroom",
            dodgeDot:"dodgeDot"
        }
    }


    constructor() {
        super(DodgeScene.KEY.NAME)
    }

    private count : number = 0;
    private timedEvent : any;
    private cursor : any;
    private player : any;

    preload(): void {

        this.input.keyboard.on('keydown-F', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        })

        this.load.image(DodgeScene.KEY.IMAGE.mushroom, "assets/images/dodgeScene/mushroom.png");
        this.load.image(DodgeScene.KEY.IMAGE.dodgeDot, "assets/images/dodgeScene/dodgeDot.png");

    }

    create(): void {

        this.cursor = this.input.keyboard.createCursorKeys();

        this.player = this.physics.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, DodgeScene.KEY.IMAGE.mushroom).setScale(1.2);

        this.player.setCollideWorldBounds(true);

        this.timedEvent =  this.time.addEvent({ delay: 30, callback: this.dotcreater, callbackScope: this, loop: true });


    }

    dotcreater() : void {

        this.count += 1;

        if(this.count === 120){
            this.timedEvent.remove(false)
        }

        // @ts-ignore
        let pos = Phaser.Geom.Rectangle.Random(this.physics.world.bounds);

        let block = this.physics.add.image(pos.x, 0, 'dodgeDot');

        this.physics.add.collider(this.player,block);

        block.setBounce(1).setCollideWorldBounds(true);

        Phaser.Math.RandomXY(block.body.velocity, 180);

        }

    update() : void{

        this.player.setVelocity(0);

        if (this.cursor.left.isDown)
        {
            this.player.setVelocityX(-300);
        }
        else if (this.cursor.right.isDown)
        {
            this.player.setVelocityX(300);
        }

        if (this.cursor.up.isDown)
        {
            this.player.setVelocityY(-300);
        }
        else if (this.cursor.down.isDown)
        {
            this.player.setVelocityY(300);
        }

    }


}
