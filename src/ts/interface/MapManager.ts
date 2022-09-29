import { Node, NodeImage, NodeType } from "../object/MapObject";
import BattleScene from "../scene/BattleScene";
import ShopScene from "../scene/ShopScene";
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
            delay: 0,
            ease: 'Expo.easeIn',
            onComplete: () => {
                this.scene.game.player!.currentNode = nextNode.nodeData;
                this.nextScene(nextNode.nodeData);
            }
        });
    }

    /** 노드 인터렉션 */
    setNodeInteraction(nodeImageArr: Array<NodeImage>, playerImage: Phaser.GameObjects.Image): void {
        nodeImageArr.forEach(node =>
            node.setInteractive()
                .on("pointerdown", () => {
                    const currentNode: Node = this.scene.game.player!.currentNode!;

                    if(currentNode.nextNode.includes(node.nodeData))
                    {
                        this.playerMove(node, playerImage);
                        this.camMoveToPlayer(node.nodeData);
                    }
                })
        );
    }

    /** 노드 진입 시 씬 전환 */
    nextScene(node: Node): void
    {
        switch(node.type)
        {
            case NodeType.BOSS:
            case NodeType.BATTLE:
            case NodeType.HIDDEN:
                this.scene.scene.start(BattleScene.KEY.NAME); break;

            case NodeType.SHOP:
                this.scene.scene.start(ShopScene.KEY.NAME); break;
                
            default: break;
        }
    }

    /** 맵 카메라 플레이어 위치로 이동 */
    camMoveToPlayer(node: Node):void
    {
        const mapCam = this.scene.cameras.getCamera('mapCam');

        mapCam.pan( node.x, node.y, 1000, 'Expo.easeIn' )
        mapCam.zoomTo(2, 1000, 'Expo.easeIn')
    }

    /** 맵 카메라 이동 */
    mapCamMove(cam: Phaser.Cameras.Scene2D.Camera)
    {
        const controlConfig = {
            camera: cam,
            up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            zoomIn: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            zoomOut: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            acceleration: 0.06,
            drag: 0.001,
            maxSpeed: 1.0,
            minZoom: 1,
            maxZoom: 2
        };

        this.scene.registry.set("controls", new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig));
    }
}