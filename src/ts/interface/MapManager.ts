import { Scene } from "./Hex";

/**
 * 노드 관리
 * 
 * @author yhy5847
 * @since 2022-09-01 오전 10:21
 */
export default class MapManager
{
    static readonly KEY = {
        NAME: "Nodes",
        IMAGE: {
            START_NODE: "start_node",
            BATTLE_NODE: "battle_node",
            SHOP_NODE: "shop_node",
            BOSS_NODE: "boss_node",
            MAP_PLAYER: "map_player"
        }
    }

    scene: Scene;

    // 노드 종류
    readonly nodes: string[] = ["StartNode", "BattleNode", "ShopNode", "BossNode"];

    //노드 세로 길이
    readonly nodesHeight: number = 7;

    //노드 가로 길이 설정
    nodesWidth(): number {
       return Math.floor(Math.random() * (7-3) + 3)
    }

    getNodes(): string[] {
        return this.nodes;
    }

    constructor(scene: Scene) {
        this.scene = scene;
    }

    //노드 랜덤 배치
    randomNode(nodes: Array<string>): Array<Array<number>> {

        let nodeArr: Array<Array<number>> = [[]];

        for(let i = 0; i < this.nodesHeight; i++) {
            nodeArr[i] = [];
        }
        
        for(let i = 0; i < this.nodesHeight; ++i) {
            for(let j = 0; j < this.nodesWidth(); ++j) {
                if(0 < i && i < this.nodesHeight - 1) {
                    let nodeRandom = Math.floor(Math.random()*10)
                    if(nodeRandom < 8) {
                        nodeArr[i][j] = nodes.indexOf("BattleNode");
                    }else {
                        nodeArr[i][j] = nodes.indexOf("ShopNode");
                    }
                } else if(i == 0 && j == 0){
                    nodeArr[i][j] = nodes.indexOf("StartNode");
                } else if(i == this.nodesHeight - 1 && j == 0) {
                    nodeArr[i][j] = nodes.indexOf("BossNode");
                }
            }
        }

        return nodeArr;
    }

}