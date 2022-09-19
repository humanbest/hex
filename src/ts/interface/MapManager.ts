import { Node, NodeImage } from "../object/MapObject";
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
    playerMove(nextNode: NodeImage, playerImage: Phaser.GameObjects.Image): void
    {
        this.scene.tweens.add({
            targets: playerImage,
            x: nextNode.x,
            y: nextNode.y,
            duration: 1000,
            delay: 500,
            onComplete: () => {this.scene.game.player!.currentNode = nextNode.nodeData}
        });
    }

    setNodeInteraction(nodeImageArr: Array<NodeImage>, playerImage: Phaser.GameObjects.Image) {
        // 노드 인터렉션
        nodeImageArr.forEach(node =>
            node.setInteractive()
                .on("pointerdown", () => {
                    const currentNode: Node = this.scene.game.player!.currentNode!;
                    if(currentNode.nextNode.includes(node.nodeData))
                    this.playerMove(node, playerImage)
                })
        );
    }
}