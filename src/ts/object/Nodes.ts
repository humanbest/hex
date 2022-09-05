import MapScene from "../scene/MapScene";

export default class Nodes extends Phaser.GameObjects.Container {

    /** 노드 깊이 설정 */
    private static readonly DEPTH = 7;
    
    /** 노드 배열 */
    private static NODE_ARR: Array<Node>;

    /** 노드 배열 설정 */
    private static setNodeData(scene: Phaser.Scene): void 
    {
        const start: number = 1300;
        const step: number = 100;

        Nodes.NODE_ARR = [];
        Nodes.NODE_ARR.push({type: NodeType.START, depth: 0, x: scene.game.canvas.width/4 + 300, y: start});
        for(let i = 1; i < Nodes.DEPTH; i++) {
            const n = (Math.random() * 3 + 3)|0;
            console.log(n);
            for(let j = 0; j < n; j++) {
                Nodes.NODE_ARR.push({type: Math.random() < 0.8 ? NodeType.BATTLE : NodeType.SHOP, depth: i, x: scene.game.canvas.width/4 + (j * 100) + 600/n, y: start - (i * step)});
            }
        }
        Nodes.NODE_ARR.push({type: NodeType.BOSS, depth: Nodes.DEPTH, x: scene.game.canvas.width/4 + 300, y: start - (Nodes.DEPTH * 100)});
    }

    constructor(scene: MapScene, x: number = 0, y: number = 0) {

        super(scene, x, y);

        // 노드 정보가 없으면 노드 배열 생성
        if(Nodes.NODE_ARR === undefined) Nodes.setNodeData(scene);
        
        // 지도 이미지 추가
        this.add(scene.add.image(-100, scene.game.canvas.height/2, MapScene.KEY.IMAGE.MAIN_MAP).setScale(0.6).setOrigin(0).setDepth(1))

        // 노드 이미지 추가
        Nodes.NODE_ARR.forEach(node => this.add(scene.add.image(node.x, node.y, node.type)).setDepth(3));

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