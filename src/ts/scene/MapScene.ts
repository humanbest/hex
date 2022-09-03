import { Vector } from "matter";
import { GameObjects } from "phaser";
import { Scene } from "../interface/Hex";
import MapManager from "../interface/MapManager";
import TopMenu from "../interface/TopMenu";

/**
 * 맵 씬
 * 
 * @author yhy5847
 * @since 2022-09-01 오전 10:21
 */
export default class MapScene extends Scene
{
    /**오브젝트 이름에 대한 키 값 */
    static readonly KEY = {
        NAME: "MapScene",
        IMAGE : {
            MAIN_MAP: "main_map",
            MAP_BACKGROUND: "map_background",
            EX_TEXT: "ex_text",
            NODES_VIEW: "nodes_view"
        }
    }

    /** 현재 좌표 */
    static currentPoint: Vector;

    controls?: Phaser.Cameras.Controls.SmoothedKeyControl;

    constructor() 
    {
        super(MapScene.KEY.NAME)
        MapScene.currentPoint = {x: 0, y: 0} 
    }

    //노드 실 배치
    nodeView(nodes: Array<Array<number>>): void 
    {
        let nodeHeight: number = 1300;

        let nodewidth: number = 50;

        
        for(let i = 0; i < nodes.length; i++){
            if(nodes[i].length == 3){
                nodewidth = 200;
            }else if(nodes[i].length == 4){
                nodewidth = 150;
            }else if(nodes[i].length == 5){
                nodewidth = 100;
            }

            for(let j = 0; j < 7; j++){
                if(nodes[i][j] == 1) 
                {
                    this.add.image(this.game.canvas.width/4 + nodewidth, nodeHeight, "battle_node").setDepth(3)
                }
                else if(nodes[i][j] == 2)
                {
                    this.add.image(this.game.canvas.width/4 + nodewidth, nodeHeight, "shop_node").setDepth(3)
                }
                else if(nodes[i][j] == 0)
                {
                    this.add.image(this.game.canvas.width/4 + 300, nodeHeight, "start_node").setDepth(3)
                    break;
                }
                else if(nodes[i][j] == 3)
                {
                    this.add.image(this.game.canvas.width/4 + 300, nodeHeight, "boss_node").setDepth(3)
                    break;
                }
                nodewidth += 100;
            }
            nodewidth = 80;
            nodeHeight -= 100;
        }
    }


    preload(): void 
    {
        console.log("0")
        this.load.image(MapScene.KEY.IMAGE.MAIN_MAP, "assets/images/mapScene/MainMap.png");
        this.load.image(MapScene.KEY.IMAGE.MAP_BACKGROUND, "assets/images/mapScene/MapBackground.png");
        this.load.image(MapScene.KEY.IMAGE.EX_TEXT, "assets/images/mapScene/ExText.png");
        this.load.image(MapManager.KEY.IMAGE.START_NODE, "assets/images/mapScene/StartNode.png");
        this.load.image(MapManager.KEY.IMAGE.BATTLE_NODE, "assets/images/mapScene/BattleNode.png");
        this.load.image(MapManager.KEY.IMAGE.SHOP_NODE, "assets/images/mapScene/ShopNode.png");
        this.load.image(MapManager.KEY.IMAGE.BOSS_NODE, "assets/images/mapScene/BossNode.png");
        this.load.image(MapManager.KEY.IMAGE.MAP_PLAYER, "assets/images/mapScene/MapPlayer.png");
    }

    create(): void
    {
        /** 배경화면 */
        const mapBackground = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, "map_background").setScale(0.52).setDepth(0);

        /** 지도 */
        const mainMap = this.add.image(-100, this.game.canvas.height/2, "main_map").setScale(0.6).setOrigin(0).setDepth(1);

        /** 상단 매뉴 */
        const topMenu = new TopMenu(this, 0, 0).setDepth(2);

        /** 설명 텍스트 */
        const exText = this.add.image(100, this.game.canvas.height - 100, "ex_text").setDepth(2);

        /**노드 배치 */
        const mapNode: MapManager = new MapManager(this);
        const nodes: Array<Array<number>> = mapNode.randomNode(mapNode.getNodes());

        this.nodeView(nodes);
        

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