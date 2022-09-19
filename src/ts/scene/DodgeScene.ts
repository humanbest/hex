import {Scene} from "../interface/Hex";
import ShopScene from "./ShopScene";

export default class DodgeScene extends Scene {

    static readonly KEY = {
        NAME: "Dodgegame",
        IMAGE: {
            mushroom: "mushroom",
            dodgeDot: "dodgeDot",
            dodgegameover: "dodgegameover",
            dodgeretry: "dodgeretry",
            dodgeexit: "dodgeexit",
            dodgered: "dodgered",
            dodgebarrier: "dodgebarrier",
            dodgegreen: "dodgegreen"
        }
    }


    constructor() {
        super(DodgeScene.KEY.NAME)
    }

    private count: number = 0;
    private timedEvent: any;
    private cursor: any;
    private player: any;

    private dodgetime: any;

    private dieable: boolean = true;
    private barriertime = 0;

    private barrierable: any;

    private emitter: any;

    private particles: any;

    private greendot: any;

    private start: any;

    private stoptimer = false;

    private playingtime: any;


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

        this.count = 0;

        this.stoptimer = false;

        this.start = this.time.now;

        this.cursor = this.input.keyboard.createCursorKeys();

        this.player = this.physics.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, DodgeScene.KEY.IMAGE.mushroom).setScale(1.2);

        this.player.setCollideWorldBounds(true);

        this.timedEvent = this.time.addEvent({delay: 150, callback: this.dotcreater, callbackScope: this, loop: true});

        this.reddotcreater();
        this.reddotcreater();
        this.reddotcreater();

        this.greendotcreater();

        // @ts-ignore
        this.dodgetime = this.add.text(50, 50);

        this.input.setDefaultCursor('none');

    }

    hitBomb(): void {

        if (this.dieable) {
            this.physics.pause();
            this.add.image(this.cameras.main.width / 2, 100, DodgeScene.KEY.IMAGE.dodgegameover).setScale(0.5);
            let retry = this.add.image(this.cameras.main.width / 2 - 90, 250, DodgeScene.KEY.IMAGE.dodgeretry).setScale(0.4)
                .setInteractive()
                .on("pointerover", () => this.add.tween({
                    targets: retry,
                    duration: 70,
                    scale: 0.5
                }))
                .on("pointerout", () => this.add.tween({
                    targets: retry,
                    duration: 70,
                    scale: 0.4
                }))
                .on("pointerdown", () => retry.setScale(0.6))
                .on("pointerup", () => this.scene.restart(this));

            let exit = this.add.image(this.cameras.main.width / 2 + 90, 250, DodgeScene.KEY.IMAGE.dodgeexit).setScale(0.4)
                .setInteractive()
                .on("pointerover", () => this.add.tween({
                    targets: exit,
                    duration: 70,
                    scale: 0.5
                }))
                .on("pointerout", () => this.add.tween({
                    targets: exit,
                    duration: 70,
                    scale: 0.4
                }))
                .on("pointerdown", () => exit.setScale(0.6))
                .on("pointerup", () => this.scene.start(ShopScene.KEY.NAME));

            this.time.removeAllEvents();

            // @ts-ignore
            this.add.text(this.cameras.main.width / 2 - 70, 400).setText('기록 : ' + this.playingtime);

            this.stoptimer = true;

            this.input.setDefaultCursor('default');
        }
    }

    dotcreater(): void {

        this.count += 1;

        if (this.count >= 100) {
            this.timedEvent.remove(false)
        }

        // @ts-ignore
        let pos = Phaser.Geom.Rectangle.Random(this.physics.world.bounds);

        let block = this.physics.add.image(pos.x, 0, 'dodgeDot');

        this.physics.add.overlap(this.player, block, this.hitBomb, undefined, this);

        block.setBounce(1).setCollideWorldBounds(true);

        Phaser.Math.RandomXY(block.body.velocity, 180);
    }

    reddotcreater(): void {

        // @ts-ignore
        let pos = Phaser.Geom.Rectangle.Random(this.physics.world.bounds);

        let block = this.physics.add.image(pos.x, 0, 'dodgered');

        this.physics.add.overlap(this.player, block, this.hitBomb, undefined, this);

        block.setBounce(1).setCollideWorldBounds(true);

        Phaser.Math.RandomXY(block.body.velocity, 360);
    }

    greendotcreater(): void {

        // @ts-ignore
        let pos = Phaser.Geom.Rectangle.Random(this.physics.world.bounds);

        this.greendot = this.physics.add.image(pos.x, 0, 'dodgegreen');

        this.greendot.setBounce(1).setCollideWorldBounds(true);

        this.physics.add.overlap(this.player, this.greendot, this.barrierstart, undefined, this);

        Phaser.Math.RandomXY(this.greendot.body.velocity, 200);
    }

    barrierstart(): void {

        this.greendot.destroy();
        this.time.delayedCall(4000, this.greendotcreater, [], this);

        if (this.dieable) {
            this.particles = this.add.particles('dodgebarrier');
            this.emitter = this.particles.createEmitter({
                speed: 100,
                scale: {start: 0.01, end: 0},
                blendMode: 'ADD'
            });

            this.emitter.startFollow(this.player);

            this.barrierable = this.time.addEvent({callback: this.barrier, callbackScope: this, loop: true})
        }
    }

    barrier(): void {

        this.dieable = false;

        this.barriertime += 1;

        console.log(this.barriertime);

        if (this.barriertime > 200) {
            this.dieable = true;
            this.barriertime = 0;
            this.particles = undefined;
            this.emitter.stopFollow();
            this.emitter.remove();
            this.barrierable.remove(false);
        }

    }

    update(time: number): void {

        this.playingtime = ((time - this.start) / 1000).toFixed(2);

        if (this.stoptimer) {
            this.dodgetime.setText("기록 종료");
        } else {
            this.dodgetime.setText('Time : ' + this.playingtime);
        }

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


}
