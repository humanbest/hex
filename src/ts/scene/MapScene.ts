import { Scene } from "../interface/Hex";
import TopMenu from "../interface/TopMenu";

export default class MapScene extends Scene
{
    static readonly KEY = {
        NAME: "MapScene",
        IMAGE : {
            MAIN_MAP: "main_map",
            MAP_BACKGROUND: "map_background",
            EX_TEXT: "ex_text",
            START_NODE: "start_node",
            BATTLE_NODE: "battle_node",
            SHOP_NODE: "shop_node",
            BOSS_NODE: "boss_node",
            MAP_PLAYER: "map_player"
        }
    }

    controls?: Phaser.Cameras.Controls.SmoothedKeyControl;

    // randomNode(nodes: string[]): string[][] {
    //     let nodeArr: Array<string>[][] = new Array;
    //     for(let i = 0; i < 5; ++i) {
    //         for(let j = 0; j < 4; ++j) {
    //             if(i) {
    //             }else if(i == 0 || j == 0){
    //                 nodeArr[i][j].push(nodes[0])
    //             } else if(i == 4 || j == 0) {
    //             }
    //         }
    //     }
    // }

    constructor() {super(MapScene.KEY.NAME)}

    preload(): void 
    {
        this.load.image(MapScene.KEY.IMAGE.MAIN_MAP, "assets/images/mapScene/MainMap.png");
        this.load.image(MapScene.KEY.IMAGE.MAP_BACKGROUND, "assets/images/mapScene/MapBackground.png");
        this.load.image(MapScene.KEY.IMAGE.EX_TEXT, "assets/images/mapScene/ExText.png");
        this.load.image(MapScene.KEY.IMAGE.START_NODE, "assets/images/mapScene/StartNode.png");
        this.load.image(MapScene.KEY.IMAGE.BATTLE_NODE, "assets/images/mapScene/BattleNode.png");
        this.load.image(MapScene.KEY.IMAGE.SHOP_NODE, "assets/images/mapScene/ShopNode.png");
        this.load.image(MapScene.KEY.IMAGE.BOSS_NODE, "assets/images/mapScene/BossNode.png");
        this.load.image(MapScene.KEY.IMAGE.MAP_PLAYER, "assets/images/mapScene/MapPlayer.png");
    }

    create(): void
    {
        console.log("맵씬")
        /** 배경화면 */
        const mapBackground = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, "map_background").setScale(0.52).setDepth(0);

        /** 지도 */
        const mainMap = this.add.image(-100, this.game.canvas.height/2, "main_map").setScale(0.6).setOrigin(0).setDepth(1);

        /** 상단 매뉴 */
        const topMenu = new TopMenu(this, 0, 0).setDepth(2);

        /** 설명 텍스트 */
        const exText = this.add.image(100, this.game.canvas.height - 100, "ex_text").setDepth(2);

        /** 노드 */
        // const startNode = this.add.image();
        // const battleNode = this.add.image();
        // const shopNode = this.add.image();
        // const bossNode = this.add.image();

        /** 카메라 설정 */
        const cursors = this.input.keyboard.createCursorKeys();

        const mapCam = this.cameras.add(0, TopMenu.HEIGHT, this.game.canvas.width, this.game.canvas.height - TopMenu.HEIGHT);
        
        const textCam = this.cameras.add(0, 0, this.game.canvas.width, this.game.canvas.height);
        
        const controlConfig = {
            camera: mapCam,
            left: cursors.right,
            right: cursors.left,
            up: cursors.down,
            down: cursors.up,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0,
            minZoom: 1,
            maxZoom: 2
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
        
        this.cameras.main.ignore([mainMap, exText]);
        
        mapCam.ignore([topMenu, mapBackground, exText]).setBounds(-115, 200, 1300, 1500);
        
        textCam.ignore([topMenu, mapBackground, mainMap]);
    }

    update (_time: number, delta: number) 
    {
        this.controls!.update(delta);
    }

}