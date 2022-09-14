import MapObject, { NodeType } from "../object/MapObject";
import MapScene from "../scene/MapScene";
import { Game, Scene } from "./Hex";


/**
 * 맵 관리 컨테이너
 * 
 * @author yhy5847
 * @since 2022-09-12 오후 6:22
 */
export default class MapManager extends Phaser.GameObjects.Container {

    private static _PLAYER_POINT: PlayerPoint;
    static get PLAYER_POINT() {return MapManager._PLAYER_POINT;};
    static set PLAYER_POINT(PLAYER_POINT) {MapManager._PLAYER_POINT = PLAYER_POINT;};

    /** 플레이어 이동 */
    private static playerMove(scene: MapScene, playerImage: MapScene, clickPointX: number, clickPointY: number): void
    {

        for(let i = 0; i < MapObject.EDGE_ARR.length; ++i)
        {
            let useEgde = MapObject.EDGE_ARR[i]

            if( clickPointX-10 < useEgde.endX && useEgde.endX < clickPointX+10
                &&
                clickPointY-10 < useEgde.endY && useEgde.endY < clickPointY+10 )
            {
                scene.tweens.add({
                    targets: playerImage,
                    x: useEgde.endX,
                    y: useEgde.endY,
                    duration: 1000,
                    delay: 500
                });

                MapManager.PLAYER_POINT = {
                    x: useEgde.endX,
                    y: useEgde.endY,
                    nodetype: useEgde.moveNode
                }
            }
        }
    }

    constructor(scene: Scene, x: number, y: number)
    {
        super(scene, x, y);

        scene.add.existing(this);
    }
}

/** 플레이어 위치정보 인터페이스 */
type PlayerPoint = {
    x: number,
    y: number,
    nodetype: NodeType
}