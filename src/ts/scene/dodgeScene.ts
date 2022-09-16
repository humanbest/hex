import {Scene} from "../interface/Hex";
import ShopScene from "./ShopScene";


export default class DodgeScene extends Scene {

    static readonly KEY = {
        NAME: "DodgeScene",
        IMAGE: {
            mushroom: "mushroom",
            dodgeDot: "dodgeDot",
            dodgegameover: "dodgegameover",
            dodgeretry: "dodgeretry",
            dodgeexit: "dodgeexit",
            dodgered: "dodgered",
            dodgebarrier:"dodgebarrier",
            dodgegreen:"dodgegreen"
        }
    }


    constructor() {
        super(DodgeScene.KEY.NAME)
    }

    private count: number = 0;
    private timedEvent: any;
    private cursor: any;
    private player: any;
    private second = 0;
    private frontsecond = 0;
    private dodgetime :any;

    private dieable : boolean = true;
    private barriertime = 0;

    private barrierable :any;

    private emitter : any;

    private particles : any;


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
        this.load.image(DodgeScene.KEY.IMAGE.dodgegameover, "assets/images/dodgeScene/dodgegameover.png");
        this.load.image(DodgeScene.KEY.IMAGE.dodgeretry, "assets/images/dodgeScene/dodgeretry.png");
        this.load.image(DodgeScene.KEY.IMAGE.dodgeexit, "assets/images/dodgeScene/dodgeexit.png");
        this.load.image(DodgeScene.KEY.IMAGE.dodgered, "assets/images/dodgeScene/dodgered.png");
        this.load.image(DodgeScene.KEY.IMAGE.dodgebarrier, "assets/images/dodgeScene/dodgebarrier.png");
        this.load.image(DodgeScene.KEY.IMAGE.dodgegreen, "assets/images/dodgeScene/dodgegreen.png");

    }

    create(): void {

        this.frontsecond = 0;
        this.second = 0;

        this.cursor = this.input.keyboard.createCursorKeys();

        this.player = this.physics.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, DodgeScene.KEY.IMAGE.mushroom).setScale(1.2);

        this.player.setCollideWorldBounds(true);

        this.timedEvent = this.time.addEvent({delay: 150, callback: this.dotcreater, callbackScope: this, loop: true});

        this.reddotcreater();
        this.greendotcreater();

        this.timedEvent = this.time.addEvent({callback: this.timer, callbackScope: this, loop: true});

        // @ts-ignore
        this.dodgetime = this.add.text(50, 50);



    }

    hitBomb(): void {

        if(this.dieable){
            this.physics.pause();
            this.add.image(this.cameras.main.width / 2, 100, DodgeScene.KEY.IMAGE.dodgegameover).setScale(0.5);
            this.add.image(this.cameras.main.width / 2 - 30, 180, DodgeScene.KEY.IMAGE.dodgeretry).setOrigin(1, 0).setScale(0.4)
                .setInteractive()
                .on("pointerdown", () => this.scene.restart());
            this.add.image(this.cameras.main.width / 2 + 30, 180, DodgeScene.KEY.IMAGE.dodgeexit).setOrigin(0, 0).setScale(0.4)
                .setInteractive()
                .on("pointerdown", () => this.scene.start(ShopScene.KEY.NAME));

            this.time.removeAllEvents();
            // @ts-ignore
            this.add.text(this.cameras.main.width / 2 - 70, 400).setText('기록 : ' + this.frontsecond+'.'+this.second);
        }
    }

    dotcreater(): void {

        this.count += 1;

        if (this.count === 120) {
            this.timedEvent.remove(false)
        }

        // @ts-ignore
        let pos = Phaser.Geom.Rectangle.Random(this.physics.world.bounds);

        let block = this.physics.add.image(pos.x, 0, 'dodgeDot');

        this.physics.add.collider(this.player, block, this.hitBomb, undefined, this);

        block.setBounce(1).setCollideWorldBounds(true);

        Phaser.Math.RandomXY(block.body.velocity, 180);
    }

    reddotcreater(): void {

        // @ts-ignore
        let pos = Phaser.Geom.Rectangle.Random(this.physics.world.bounds);

        let block = this.physics.add.image(pos.x, 0, 'dodgered');

        this.physics.add.collider(this.player, block, this.hitBomb, undefined, this);

        block.setBounce(1).setCollideWorldBounds(true);

        Phaser.Math.RandomXY(block.body.velocity, 360);
    }

    greendotcreater(): void {

        // @ts-ignore
        let pos = Phaser.Geom.Rectangle.Random(this.physics.world.bounds);

        let greendot = this.physics.add.image(pos.x, 0, 'dodgegreen');

        greendot.setBounce(1).setCollideWorldBounds(true);


        this.physics.add.collider(this.player, greendot,this.bb, undefined, this);

        Phaser.Math.RandomXY(greendot.body.velocity, 200);
    }

    bb () :void {

        if(this.dieable){
            this.particles = this.add.particles('dodgebarrier');
            this.emitter = this.particles.createEmitter({
                speed: 100,
                scale: { start: 0.01, end: 0 },
                blendMode: 'ADD'
            });

            this.emitter.startFollow(this.player);

            this.barrierable = this.time.addEvent({callback: this.barrier, callbackScope: this, loop: true})
        }
    }

    barrier():void {

        this.dieable = false;

        this.barriertime += 1;

        console.log(this.barriertime);

        if(this.barriertime > 200){
            this.dieable = true;
            this.barriertime = 0;
            this.particles = undefined;
            this.emitter.stopFollow();
            this.emitter.remove();
            this.barrierable.remove(false);
        }

    }

    update(): void {

        if(this.second>59){
            this.frontsecond += 1;
            this.second = 0;
        }
        // @ts-ignore
        this.dodgetime.setText('Time : '+this.frontsecond+'.'+this.second);

        this.player.setVelocity(0);

        if (this.cursor.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursor.right.isDown) {
            this.player.setVelocityX(300);
        }

        if (this.cursor.up.isDown) {
            this.player.setVelocityY(-300);
        } else if (this.cursor.down.isDown) {
            this.player.setVelocityY(300);
        }

    }

    timer(): void {
        this.second += 1;
    }


}
