import MapScene from "../scene/MapScene";


/**
 * 맵 오브젝트
 * 
 * @author yhy5847
 * @since 2022-09-06 오전 11:09
 */
export default class MapObject extends Phaser.GameObjects.Container {

    // /** 플레이어 위치 */
    // private static PLAYER_POINT: PlayerPoint;

    /** 노드 배열 */
    private static NODE_ARR: Array<Node>;

    /** 노드 층 설정(Start, Boss node 제외한 깊이.length) */
    private static readonly DEPTH = 7;
    
    /** 층 별 노드 개수 Min, Max 값 설정 */
    private static readonly MIN_SPACE = 2;
    private static readonly MAX_SPACE = 4;

    /**노드 등장 확률 설정 */
    private static readonly BATTLE_NODES_PROBABILITY = 0.4;
    private static readonly SHOP_NODES_PROBABILITY = 0.2;
    private static readonly REST_NODES_PROBABILITY = 0.2;
    private static readonly HIDDEN_NODES_PROBABILITY = 0.2;

    /** 특정 노드 개수 제한 */
    private static SHOP_NODES_LIMIT     = 2;
    private static REST_NODES_LIMIT     = 2;
    private static HIDDEN_NODES_LIMIT   = 2;

    /** 엣지 배열 */
    private static EDGE_ARR: Array<Edge>;

    /** 노드 배열 설정 */
    private static setNodeData(scene: Phaser.Scene): void 
    {
        const start: number = 1400;
        const step: number = 100;

        /** 노드 중앙 배치 기준좌표 */
        const centerPoint = scene.game.canvas.width/2 + 50;

        MapObject.NODE_ARR = [];

        //start 노드 푸쉬
        MapObject.NODE_ARR.push({
            type: NodeType.START, 
            depth: 0, 
            space: 0,
            x: centerPoint, 
            y: start
        });

        //노드 랜덤 생성 알고리즘 (start, boss 노드 제외한 노드 푸쉬)
        for(let i = 1; i <= MapObject.DEPTH; i++) {
            
            let randomNodeSpace = ((Math.random() * (MapObject.MAX_SPACE - 1)) + MapObject.MIN_SPACE)|0;

            for(let j = 0; j < randomNodeSpace; j++) {

                let k: number = Math.random();
                let randomNode: NodeType;
                

                if(i <= 1 || k < MapObject.BATTLE_NODES_PROBABILITY)
                {
                    randomNode = NodeType.BATTLE;
                }
                else if(MapObject.BATTLE_NODES_PROBABILITY <= k && k < MapObject.BATTLE_NODES_PROBABILITY + MapObject.SHOP_NODES_PROBABILITY && MapObject.SHOP_NODES_LIMIT !== 0) 
                {                   
                    randomNode = NodeType.SHOP;
                    MapObject.SHOP_NODES_LIMIT -= 1;
                }
                else if(MapObject.BATTLE_NODES_PROBABILITY + MapObject.SHOP_NODES_PROBABILITY <= k && k < MapObject.BATTLE_NODES_PROBABILITY + MapObject.SHOP_NODES_PROBABILITY + MapObject.REST_NODES_PROBABILITY && MapObject.REST_NODES_LIMIT !== 0) 
                {                   
                    randomNode = NodeType.REST;
                    MapObject.REST_NODES_LIMIT -= 1;
                }
                else if(1 - MapObject.HIDDEN_NODES_PROBABILITY <= k && MapObject.HIDDEN_NODES_LIMIT !== 0) 
                {
                    randomNode = NodeType.HIDDEN;
                    MapObject.HIDDEN_NODES_LIMIT -= 1;
                }
                else
                {
                    randomNode = NodeType.BATTLE;
                }

                MapObject.NODE_ARR.push({
                    type: randomNode,
                    depth: i,
                    space: j,
                    x: (centerPoint + 50) + (j - (randomNodeSpace/2)) * 100,
                    y: start - (i * step)
                });
            }
        }

        //boss 노드 푸쉬
        MapObject.NODE_ARR.push({
            type: NodeType.BOSS, 
            depth: (MapObject.DEPTH + 1), 
            space: 0,
            x: centerPoint, 
            y: start - ((MapObject.DEPTH + 1) * step)
        });
    }


    /** 엣지 데이터 설정 */
    private static setEdgeData() :void
    {
        // 노드 뎁스끼리 분류한 이차원 배열
        const nodeByDepth: Array<Array<Node>> = Array.from({length: MapObject.DEPTH + 2}, ()=>[]);
        
        //노드 데이터 가공(뎁스 기준)
        MapObject.NODE_ARR.forEach( node => {
            nodeByDepth[node.depth].push(node)
        })


        //엣지 알고리즘
        MapObject.EDGE_ARR = [];
        let gap: number;

        for(let i = 0; i < nodeByDepth.length-1; ++i)
        {
            gap = nodeByDepth[i].length - nodeByDepth[i+1].length;

            for(let j = 0; j < nodeByDepth[i].length; ++j)
            {
                if( gap < 0 && j === nodeByDepth[i].length-1 )
                {
                    for(let k = nodeByDepth[i].length-1; k < nodeByDepth[i+1].length; ++k)
                    {
                        MapObject.EDGE_ARR.push({
                            startX: nodeByDepth[i][j].x,
                            startY: nodeByDepth[i][j].y,
                            endX: nodeByDepth[i+1][k].x,
                            endY: nodeByDepth[i+1][k].y
                        })
                    }
                }
                else if( gap > 0 && j > nodeByDepth[i+1].length-1)
                {
                    MapObject.EDGE_ARR.push({
                        startX: nodeByDepth[i][j].x,
                        startY: nodeByDepth[i][j].y,
                        endX: nodeByDepth[i+1][nodeByDepth[i+1].length-1].x,
                        endY: nodeByDepth[i+1][nodeByDepth[i+1].length-1].y
                    })
                }
                else
                {
                    MapObject.EDGE_ARR.push({
                        startX: nodeByDepth[i][j].x,
                        startY: nodeByDepth[i][j].y,
                        endX: nodeByDepth[i+1][j].x,
                        endY: nodeByDepth[i+1][j].y
                    })
                }
            }
        }
    }


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

        for(let i = 0; i < MapObject.EDGE_ARR.length; ++i)
        {
            let line = new Phaser.Geom.Line(MapObject.EDGE_ARR[i].startX, MapObject.EDGE_ARR[i].startY, MapObject.EDGE_ARR[i].endX, MapObject.EDGE_ARR[i].endY);
            
            this.add(graphics.strokeLineShape(line));
        }

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
    REST = "rest_node",
    HIDDEN = "hidden_node",
    BOSS = "boss_node"
}

/** 노드 인터페이스 */
type Node = {
    type: NodeType;
    depth: number;
    space: number;
    x: number;
    y: number;
}

/** 엣지 인터페이스 */
type Edge = {
    startX: number,
    startY: number,
    endX: number,
    endY: number
}

// /** 플레이어 위치 인터페이스 */
// type PlayerPoint = {
//     x: number,
//     y: number
// }