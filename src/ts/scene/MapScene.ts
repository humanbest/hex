import Phaser from "phaser";
import { CONFIG } from "../config";
import TopMenu from "../interface/TopMenu";

export class MapScene extends Phaser.Scene 
{

    controls?: Phaser.Cameras.Controls.SmoothedKeyControl;

    constructor() 
    {
        super({
            key: CONFIG.SCENES.MAP 
        })
    }

    preload(): void 
    {
        this.load.image(CONFIG.IMAGE.MAIN_MAP, "assets/images/mapScene/MainMap.png");
        this.load.image(CONFIG.IMAGE.MAP_BACKGROUND, "assets/images/mapScene/MapBackground.png");
    }

    create(): void
    {
        /** 배경화면 */
        const mapBackground = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, "map_background").setScale(0.52).setDepth(0);

        /** 지도 */
        const mainMap = this.add.image(-100, this.game.canvas.height/2, "main_map").setScale(0.6).setOrigin(0).setDepth(1);

        /** 상단 매뉴 */
        const topMenu = new TopMenu(this, 0, 0).setDepth(2);

        /** 카메라 설정 */
        const cursors = this.input.keyboard.createCursorKeys();

        const UICam = this.cameras.add(0, CONFIG.CONTAINER.TOP_MENU.HEIGHT, this.game.canvas.width, this.game.canvas.height - CONFIG.CONTAINER.TOP_MENU.HEIGHT);

        const controlConfig = {
            camera: UICam,
            left: cursors.right,
            right: cursors.left,
            up: cursors.down,
            down: cursors.up,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
        this.cameras.main.ignore(mainMap);
        UICam.ignore([topMenu, mapBackground]);
        UICam.setBounds(-115, 200, 1300, 1500);
    }

    update (_time: number, delta: number) 
    {
        this.controls!.update(delta);
    }

}