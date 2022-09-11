import MapObject from "../object/MapObject";
import MapScene from "../scene/MapScene";
import { Game, Scene } from "./Hex";


/**
 * 맵 관리 컨테이너
 * 
 * @author yhy5847
 * @since 2022-09-12 오후 6:22
 */
export default class MapManager extends Phaser.GameObjects.Container {


    constructor(scene: Scene, x: number, y: number)
    {
        super(scene, x, y);

        scene.add.existing(this);
    }

    /**플레이어 노드 이동 규칙 */
    private static playerMoveRule(movePoint: MapScene) : boolean
    {
        if(movePoint)
        {
            
        }
        return false;
    }
}