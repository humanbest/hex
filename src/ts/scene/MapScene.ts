import { Scene } from "../interface/Hex";
import MapObject, { NodeType } from "../object/MapObject";
import TopMenu from "../interface/TopMenu";
import MapManager from "../interface/MapManager";


/**
 * 맵 씬
 * 
 * @author yhy5847
 * @since 2022-08-30 오전 11:33
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
            MAP_PLAYER: "map_player"
        }
    }

    constructor() 
    {
        super(MapScene.KEY.NAME)
    }

    
    preload(): void 
    {
        this.load.image(MapScene.KEY.IMAGE.MAIN_MAP, "assets/images/mapScene/MainMap.png");
        this.load.image(MapScene.KEY.IMAGE.MAP_BACKGROUND, "assets/images/mapScene/MapBackground.png");
        this.load.image(MapScene.KEY.IMAGE.EX_TEXT, "assets/images/mapScene/ExText.png");
        this.load.image(NodeType.START, "assets/images/mapScene/StartNode.png");
        this.load.image(NodeType.BATTLE, "assets/images/mapScene/BattleNode.png");
        this.load.image(NodeType.SHOP, "assets/images/mapScene/ShopNode.png");
        this.load.image(NodeType.REST, "assets/images/mapScene/RestNode.png");
        this.load.image(NodeType.HIDDEN, "assets/images/mapScene/HiddenNode.png");
        this.load.image(NodeType.BOSS, "assets/images/mapScene/BossNode.png");
        this.load.image(MapScene.KEY.IMAGE.MAP_PLAYER, "assets/images/mapScene/MapPlayer.png");
    }

    create(): void
    {
        /** 배경화면 */
        const mapBackground = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, "map_background").setScale(0.52).setDepth(0);

        /** 맵 오브젝트(지도, 노드, 엣지) */
        const mapObject: MapObject = new MapObject(this)

        /** 상단 매뉴 */
        const topMenu = new TopMenu(this, 0, 0).setDepth(2);

        /** 설명 텍스트 */
        const exText = this.add.image(100, this.game.canvas.height - 100, "ex_text").setDepth(2);
        
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

        this.registry.set("controls", new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig));
        
        this.cameras.main.ignore([mapObject, exText]);
        
        mapCam.ignore([topMenu, mapBackground, exText]).setBounds(-115, 200, 1300, 1500);
        
        textCam.ignore([topMenu, mapBackground, mapObject]);

    }

    update (_time: number, delta: number) 
    {
        const controls: Phaser.Cameras.Controls.SmoothedKeyControl = this.registry.get("controls");
        controls.update(delta);

    }
}