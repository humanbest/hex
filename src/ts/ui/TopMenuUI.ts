import Phaser, { Scene } from "phaser";
import { CONFIG } from "../config";
import { HexGame } from "../interface/Interface";

class Left extends Phaser.GameObjects.Container {

    constructor(scene: Scene, x: number, y: number) {

        super(scene, x, y);

        const game = scene.game as HexGame;

        this.add([
            
            // player nickname
            scene.add.text(0, 0,  game.player!.nickName, {
                fontFamily: 'Noto Sans KR',
                fontSize: "20px",
                color: "white"
            }).setShadow(2, 2, '#000000', 2, true, true).setName(CONFIG.CONTAINER.TOP.LEFT.NICKNAME),

            // player champ name
            scene.add.text(0, 0, game.player!.champion.name, {
                fontFamily: 'Noto Sans KR',
                fontSize: "15px",
                color: "gray"
            }).setShadow(2, 2, '#000000', 2, true, true).setName('champName'),

            // HP image
            scene.add.image(0, 0, CONFIG.SPRITE.TOP, CONFIG.IMAGE.HEART).setScale(0.75).setName(CONFIG.CONTAINER.TOP.LEFT.HP_IMAGE),

            // HP value
            scene.add.text(0, 0, `${game.player!.champion.hp}/${game.player!.champion.maxHp}`, {
                fontSize: "20px",
                color: "#c95134",
                stroke: "#c95134",
                strokeThickness: 1
            }).setShadow(2, 2, "#000000", 2, true, true).setName(CONFIG.CONTAINER.TOP.LEFT.HP_VALUE),

            // coin bag image
            scene.add.image(0, 0, CONFIG.SPRITE.TOP, CONFIG.IMAGE.COIN_BAG).setScale(0.75).setName(CONFIG.CONTAINER.TOP.LEFT.COIN_BAG_IMAGE),

            // coin value
            scene.add.text(0, 0, game.player!.inventory.coin.toString(), {
                fontSize: "20px",
                color: "gold",
                stroke: "gold",
                strokeThickness: 1
            }).setShadow(2, 2, "#000000", 2, true, true).setName(CONFIG.CONTAINER.TOP.LEFT.COIN_BAG_VALUE),

        ]).setName(CONFIG.CONTAINER.TOP.LEFT.NAME);

        scene.add.existing(this);
    }
}

class Right extends Phaser.GameObjects.Container {
    
    constructor(scene: Scene, x: number, y: number) {

        super(scene, x, y);

        const game = scene.game as HexGame;

        this.add([

            // top clock image
            scene.add.image(0, 0, CONFIG.SPRITE.TOP, CONFIG.IMAGE.CLOCK).setScale(0.75).setName(CONFIG.CONTAINER.TOP.RIGHT.CLOCK_IMAGE),

            // top time value
            scene.add.text(0, 0, game.player!.time!, {
                fontSize: "20px",
                color: "gold",
                stroke: "gold",
                strokeThickness: 1
            }).setShadow(2, 2, "#000000", 2, true, true).setName(CONFIG.CONTAINER.TOP.RIGHT.CLOCK_VALUE),

            // top map image
            scene.add.image(0, 0, CONFIG.SPRITE.TOP, CONFIG.IMAGE.MAP).setScale(0.9).setName(CONFIG.CONTAINER.TOP.RIGHT.MAP_IMAGE),

            // top dec image
            scene.add.image(0, 0, CONFIG.SPRITE.TOP, CONFIG.IMAGE.DEC).setScale(1.05).setName(CONFIG.CONTAINER.TOP.RIGHT.DEC_IMAGE),

            // top gear image
            scene.add.image(0, 0, CONFIG.SPRITE.TOP, CONFIG.IMAGE.GEAR).setScale(0.9).setName(CONFIG.CONTAINER.TOP.RIGHT.GEAR_IMAGE),

        ]).setName(CONFIG.CONTAINER.TOP.RIGHT.NAME);

        scene.add.existing(this);
    }
}

export default class TopMenu extends Phaser.GameObjects.Container {
    
    constructor(scene: Scene, x: number, y: number) {

        const game = scene.game as HexGame;

        super(scene, x, y);

        // top background
        const background = scene.add.tileSprite(
            0, 0, 
            game.canvas.width, 
            CONFIG.CONTAINER.TOP.HEIGHT, 
            CONFIG.SPRITE.TOP,
            CONFIG.IMAGE.METAL
        ).setOrigin(0).setName(CONFIG.CONTAINER.TOP.BACKGROUND);

        // Create left container
        const left = new Left(scene, 0, 0);
    
        // Create right container
        const right = new Right(scene, game.canvas.width, 0);

        [CONFIG.CONTAINER.TOP.RIGHT.MAP_IMAGE, CONFIG.CONTAINER.TOP.RIGHT.DEC_IMAGE, CONFIG.CONTAINER.TOP.RIGHT.GEAR_IMAGE].forEach( name => {
            right.getByName(name).setInteractive();
            //@ts-ignore
            right.getByName(name).on("pointerover", function () {this.setBlendMode(Phaser.BlendModes.ADD).setAngle(-15).setScale(name == CONFIG.IMAGE.DEC ? 1.2 : 1.05)});
            //@ts-ignore
            right.getByName(name).on("pointerout", function () {this.setBlendMode(0).setAngle(0).setScale(name == CONFIG.IMAGE.DEC ? 1 : 0.9)});
        });

        const cardCount = scene.add.text(0, 0, game.player!.dec.length.toString(), {
            fontSize: "12px",
            color: "white",
            stroke: "black",
            strokeThickness: 1
        }).setShadow(2, 2, "#000000", 2, true, true).setName(CONFIG.CONTAINER.TOP.RIGHT.CARD_COUNT);

        // Create top container
        this.add([background, left, right, cardCount]).setName(CONFIG.CONTAINER.TOP.NAME);
        
        // Register event
        this.on('align', this.align);
        
        this.align();

        scene.add.existing(this);
    }

    public align(): void {

        const background = this.getByName('background') as Phaser.GameObjects.TileSprite;
        const left = this.getByName('left') as Phaser.GameObjects.Container;
        const right = this.getByName('right') as Phaser.GameObjects.Container;
        const cardCount = this.getByName('cardCount') as Phaser.GameObjects.Text;
        
        // Set background width
        background.width = this.scene.game.canvas.width;
        
        // Align left container element
        //@ts-ignore
        left.getAll().forEach((e, i, a) => e.setOrigin(0.5).setPosition(
            //@ts-ignore
            [0, 20, 30, 5, 30, 5][i] + (i ? a[i - 1].x + (a[i - 1].width * a[i - 1].scale + a[i].width * a[i].scale) / 2 : 0), 
            background.getCenter().y
        ));
        
        //@ts-ignore
        left.x = left.getAt(0).width / 2 + 20;

        // Align right container element
        //@ts-ignore
        right.list.forEach((e, i, a) => e.setOrigin(0.5).setPosition(
            //@ts-ignore
            [0, 5, 30, 20, 20][i] + (i ? a[i - 1].x + (a[i - 1].width * a[i - 1].scale + a[i].width * a[i].scale) / 2 : 0), 
            background.getCenter().y
        ));

        // Set right container position
        //@ts-ignore
        right.x -= right.getAt(right.list.length -1).x + right.getAt(right.list.length -1).width / 2 + 20;
        
        const dec = right.getByName(CONFIG.CONTAINER.TOP.RIGHT.DEC_IMAGE) as Phaser.GameObjects.Image;
        cardCount.setPosition(right.x + dec.x + dec.width / 2, background.height - 3).setOrigin(1);
    }
}
