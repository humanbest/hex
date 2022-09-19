// import MapManager from "../interface/MapManager";
import { Scene } from "../interface/Hex";
import MapScene from "../scene/MapScene";

/**
 * 맵 오브젝트
 * 
 * @author yhy5847
 * @since 2022-09-06 오전 11:09
 */
export default class MapObject extends Phaser.GameObjects.Container {

    /** 노드 배열 */
    private static _NODE_ARR: Array<Node>;
    static get NODE_ARR() {return MapObject._NODE_ARR;};
    static set NODE_ARR(NODE_ARR) {MapObject._NODE_ARR = NODE_ARR;};

    /** 노드 층 설정(Start, Boss node 제외한 깊이(1부터 시작)) */
    private static readonly DEPTH = 7;
    
    /** 층 별 노드 개수 Min, Max 값 설정 */
    private static readonly MIN_SPACE = 2;
    private static readonly MAX_SPACE = 4;

    /**노드 등장 확률 설정 */
    private static readonly BATTLE_NODES_PROBABILITY = 0.55;
    private static readonly SHOP_NODES_PROBABILITY = 0.15;
    private static readonly REST_NODES_PROBABILITY = 0.15;
    private static readonly HIDDEN_NODES_PROBABILITY = 0.15;

    /** 특수 노드(shop, rest, hidden) 출현 시작 뎁스 */
    private static readonly SPECIAL_NODES_START = 2;
    
    /** 특정 노드 개수 제한 */
    private static SHOP_NODES_LIMIT     = 2;
    private static REST_NODES_LIMIT     = 2;
    private static HIDDEN_NODES_LIMIT   = 2;

    /** 노드 배열 설정 */
    private static setNodeData(scene: Scene): void 
    {
        const start: number = 1400;
        const step: number = 100;

        //노드 출현 확률
        let battleProbability = MapObject.BATTLE_NODES_PROBABILITY;
        let shopProbability = MapObject.BATTLE_NODES_PROBABILITY + MapObject.SHOP_NODES_PROBABILITY;
        let restProbability = MapObject.BATTLE_NODES_PROBABILITY + MapObject.SHOP_NODES_PROBABILITY + MapObject.REST_NODES_PROBABILITY;
        let hiddenProbability = MapObject.BATTLE_NODES_PROBABILITY + MapObject.SHOP_NODES_PROBABILITY + MapObject.REST_NODES_PROBABILITY + MapObject.HIDDEN_NODES_PROBABILITY;

        /** 노드 중앙 배치 기준좌표 */
        const centerPoint = scene.game.canvas.width/2 + 50;

        MapObject.NODE_ARR = [];

        //start 노드 푸쉬
        MapObject.NODE_ARR.push(scene.game.player!.currentNode = {
            x: centerPoint,
            y: start,
            type: NodeType.START,
            depth: 0,
            space: 0,
            nextNode: []
        });

        //노드 랜덤 생성 알고리즘 (start, boss 노드 제외한 노드 푸쉬)
        for(let i = 1; i <= MapObject.DEPTH; i++) {
            
            let randomNodeSpace = ((Math.random() * (MapObject.MAX_SPACE - 1)) + MapObject.MIN_SPACE)|0;

            if(MapObject.DEPTH/2 + MapObject.DEPTH%2 < i)
            {
                let p = (1 - shopProbability)/(MapObject.DEPTH/2);
                battleProbability -= p;
                shopProbability -= p;
                restProbability -= p;
                hiddenProbability -= p;
            }

            for(let j = 0; j < randomNodeSpace; j++) {

                let k: number = Math.random();
                let randomNode: NodeType;
                        
                if(i < MapObject.SPECIAL_NODES_START || k < battleProbability)
                {
                    randomNode = NodeType.BATTLE;
                }
                else if(k < shopProbability && MapObject.SHOP_NODES_LIMIT !== 0) 
                {                   
                    randomNode = NodeType.SHOP;
                    MapObject.SHOP_NODES_LIMIT -= 1;
                }
                else if(k < restProbability && MapObject.REST_NODES_LIMIT !== 0) 
                {                   
                    randomNode = NodeType.REST;
                    MapObject.REST_NODES_LIMIT -= 1;
                }
                else if(1 - hiddenProbability <= k && MapObject.HIDDEN_NODES_LIMIT !== 0) 
                {
                    randomNode = NodeType.HIDDEN;
                    MapObject.HIDDEN_NODES_LIMIT -= 1;
                }
                else
                {
                    randomNode = NodeType.BATTLE;
                }

                MapObject.NODE_ARR.push({
                    x: (centerPoint + 50) + (j - (randomNodeSpace/2)) * 100,
                    y: start - (i * step),
                    type: randomNode,
                    depth: i,
                    space: j,
                    nextNode: []
                })
            }
        }

        //boss 노드 푸쉬
        MapObject.NODE_ARR.push({
            x: centerPoint,
            y: start - ((MapObject.DEPTH + 1) * step),
            type: NodeType.BOSS,
            depth: (MapObject.DEPTH + 1),
            space: 0,
            nextNode: []
        });  
    }

    /** 엣지 데이터 설정 */
    private static setEdgeData() :void
    {
        // 노드 뎁스끼리 분류한 이차원 배열
        const nodeByDepth: Array<Array<Node>> = Array.from({length: MapObject.DEPTH + 2}, ()=>[]);
        
        // 노드 데이터 가공(뎁스 기준)
        MapObject.NODE_ARR.forEach( node => {
            nodeByDepth[node.depth].push(node)
        })

        //엣지 알고리즘
        let gap: number;
        let arrCount: number = 0;
        for(let i = 0; i < nodeByDepth.length-1; ++i)
        {
            gap = nodeByDepth[i].length - nodeByDepth[i+1].length;

            for(let j = 0; j < nodeByDepth[i].length; ++j)
            {
                if( gap < 0 && j === nodeByDepth[i].length-1 )
                {
                    for(let k = nodeByDepth[i].length-1; k < nodeByDepth[i+1].length; ++k)
                    {
                        MapObject.NODE_ARR[arrCount].nextNode.push(nodeByDepth[i+1][k]);
                    }
                }
                else if( gap > 0 && j > nodeByDepth[i+1].length-1)
                {
                    MapObject.NODE_ARR[arrCount].nextNode.push(nodeByDepth[i+1][nodeByDepth[i+1].length-1]);
                }
                else
                {
                    MapObject.NODE_ARR[arrCount].nextNode.push(nodeByDepth[i+1][j]);
                }
                arrCount++
            }
        }
    }

    /** 노드 이미지 배열 */
    private _nodeImageArr: Array<NodeImage>;
    get nodeImageArr() {return this._nodeImageArr}
    private set nodeImageArr(nodeImageArr: Array<NodeImage>) {this._nodeImageArr = nodeImageArr}

    /** 플레이어 이미지 */
    private _playerImage: Phaser.GameObjects.Image;
    get playerImage() {return this._playerImage}
    private set playerImage(playerImage: Phaser.GameObjects.Image) {this._playerImage = playerImage}

    constructor(scene: MapScene, x: number = 0, y: number = 0) {

        super(scene, x, y);

        // 노드 정보가 없으면 노드 배열 생성
        if(MapObject.NODE_ARR === undefined)
        {
            MapObject.setNodeData(scene);
            MapObject.setEdgeData();
        }

        // 지도 이미지 추가
        this.add(scene.add.image(-100, scene.game.canvas.height/2, MapScene.KEY.IMAGE.MAIN_MAP).setScale(0.6).setOrigin(0).setDepth(1));

        //엣지 이미지 추가
        let graphics = scene.add.graphics({lineStyle: {width: 3, color: 0x000000}})
        
        this.add(graphics)

        for(let i = 0; i < MapObject.NODE_ARR.length-1; ++i)
        {
            for(let j = 0; j < MapObject.NODE_ARR[i].nextNode.length; ++j)
            {
                let line = new Phaser.Geom.Line(MapObject.NODE_ARR[i].x , MapObject.NODE_ARR[i].y, MapObject.NODE_ARR[i].nextNode[j].x, MapObject.NODE_ARR[i].nextNode[j].y);
            
                this.add(graphics.strokeLineShape(line));
            }
        }

        // 노드 인터렉션
        this.add(this.nodeImageArr = MapObject.NODE_ARR.map(node => new NodeImage(scene, node).setDepth(3)));

        //플레이어 이미지 추가
        const currentNode = scene.game.player!.currentNode!;
        this.add(this.playerImage = scene.add.image(currentNode.x, currentNode.y, MapScene.KEY.IMAGE.MAP_PLAYER).setScale(0.5).setDepth(4));

        // 씬에 맵 컨테이너 추가
        scene.add.existing(this);
    }  
}

/** 노드 타입 */
export enum NodeType {
    START = "start_node",
    BATTLE = "battle_node",
    SHOP = "shop_node",
    REST = "rest_node",
    HIDDEN = "hidden_node",
    BOSS = "boss_node"
}

/** 노드 인터페이스 */
export type Node = {
    x: number;
    y: number;
    type: NodeType;
    depth: number;
    space: number;
    nextNode: Array<Node>;
}

/** 노드 이미지 */
export class NodeImage extends Phaser.GameObjects.Image {

    nodeData: Node

    constructor(scene: Scene, nodeData: Node) {
        super(scene, nodeData.x, nodeData.y, nodeData.type);
        this.nodeData = nodeData;
    }
}

/** 플레이어 인터페이스 */
export type PlayerPoint = {
    stayNode: Node
}
