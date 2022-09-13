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
    private static playerMoveRule(x: number, y: number, nodePoint: MapObject) : boolean
    {
        let minPointerX = x - 15;
        let maxPointerX = x + 15;
        let minPointerY = y - 15;
        let maxPointerY = y + 15;

        for(let i = 0; i < nodePoint.length; ++i)
        {
            for(let j = 0; j < nodePoint[i].length; ++j)
            {
                if(minPointerX <= nodePoint[i][j].x && nodePoint[i][j].x <= maxPointerX && minPointerY <= nodePoint[i][j].y && nodePoint[i][j].y <= maxPointerY)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        return false;
    }
}