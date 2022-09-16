import MapObject, { Node } from "../object/MapObject";
// import MapScene from "../scene/MapScene";
import { Scene } from "./Hex";


/**
 * 맵 관리 컨테이너
 * 
 * @author yhy5847
 * @since 2022-09-12 오후 6:22
 */
export default class MapManager {

    readonly scene: Scene

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /** 플레이어 이동 */
    playerMove(nextNode: Node): void
    {
        this.scene.tweens.add({
            targets: MapObject.PLAYER,
            x: nextNode.x,
            y: nextNode.y,
            duration: 1000,
            delay: 500,
            onComplete: () => {MapObject.PLAYER.setData("current", nextNode)}
        });
    }

    setNodeInteraction() {
        // 노드 인터렉션
        MapObject.NODE_ARR.forEach(node =>
            node.setInteractive()
                .on("pointerdown", () => {
                    
                    const currentNode: Node = MapObject.PLAYER.getData("current");
                    if(currentNode.nextNode.includes(node))
                    this.playerMove(node)
                })
        );
    }
}