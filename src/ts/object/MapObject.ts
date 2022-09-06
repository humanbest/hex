import MapScene from "../scene/MapScene";

export default class MapObject extends Phaser.GameObjects.Container {

    /** 노드 깊이 설정 */
    private static readonly DEPTH = 7;
    
    /** 노드 배열 */
    private static NODE_ARR: Array<Node>;

    /** 노드 배열 설정 */
    private static setNodeData(scene: Phaser.Scene): void 
    {
        const start: number = 1400;
        const step: number = 100;

        MapObject.NODE_ARR = [];
        MapObject.NODE_ARR.push({type: NodeType.START, depth: 0, x: scene.game.canvas.width/4 + 300, y: start});
        for(let i = 1; i < MapObject.DEPTH; i++) {
            const n = (Math.random() * 3 + 3)|0;
            for(let j = 0; j < n; j++) {
                MapObject.NODE_ARR.push({type: Math.random() < 0.8 ? NodeType.BATTLE : NodeType.SHOP, depth: i, x: scene.game.canvas.width/4 + (j * 100) + 600/n, y: start - (i * step)});
            }
        }
        MapObject.NODE_ARR.push({type: NodeType.BOSS, depth: MapObject.DEPTH, x: scene.game.canvas.width/4 + 300, y: start - (MapObject.DEPTH * step)});
    }

    constructor(scene: MapScene, x: number = 0, y: number = 0) {

        super(scene, x, y);

        // 노드 정보가 없으면 노드 배열 생성
        if(MapObject.NODE_ARR === undefined) MapObject.setNodeData(scene);
        
        // 지도 이미지 추가
        this.add(scene.add.image(-100, scene.game.canvas.height/2, MapScene.KEY.IMAGE.MAIN_MAP).setScale(0.6).setOrigin(0).setDepth(1))

        // 노드 이미지 추가
        MapObject.NODE_ARR.forEach(node => this.add(scene.add.image(node.x, node.y, node.type)).setDepth(3));

        // 씬에 맵 컨테이너 추가
        scene.add.existing(this);
    }  
}

/** 노드 타입 */
export enum NodeType {
    START = "start_node",
    BATTLE = "battle_node",
    SHOP = "shop_node",
    BOSS = "boss_node",
    PLAYER = "map_player"
}

/** 노드 인터페이스 */
type Node = {
    type: NodeType;
    depth: number;
    x: number;
    y: number;
}