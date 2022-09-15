// import MapObject from "../object/MapObject";
// import { Scene } from "./Hex";


/**
 * 맵 관리 컨테이너
 * 
 * @author yhy5847
 * @since 2022-09-12 오후 6:22
 */
export default class MapManager extends Phaser.GameObjects.Container {

//     /** 플레이어 이동 */
//     static playerMove(scene: Scene, playerImage: Phaser.GameObjects.Image, clickPointX: number, clickPointY: number): void
//     {

//         for(let i = 0; i < MapObject.EDGE_ARR.length; ++i)
//         {
//             let useEgde = MapObject.EDGE_ARR[i]

//             if( clickPointX-10 < useEgde.endX && useEgde.endX < clickPointX+10
//                 &&
//                 clickPointY-10 < useEgde.endY && useEgde.endY < clickPointY+10 )
//             {
//                 scene.tweens.add({
//                     targets: playerImage,
//                     x: useEgde.endX,
//                     y: useEgde.endY,
//                     duration: 1000,
//                     delay: 500
//                 });

//                 MapObject.PLAYER_POINT = {
//                     x: useEgde.endX,
//                     y: useEgde.endY,
//                     nodetype: useEgde.moveNode
//                 }
//             }
//         }
//     }

//     constructor(scene: Scene, x: number = 0, y: number = 0, mapObject: Phaser.GameObjects.Image)
//     {
//         super(scene, x, y);

//         if(scene.input.mousePointer.leftButtonReleased())
//             {
//                 MapManager.playerMove(scene, mapObject, x, y);
//             }
        

//         scene.add.existing(this);
//     }
}