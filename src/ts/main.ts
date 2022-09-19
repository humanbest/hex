import { Game, defaultPlayer } from "./interface/Hex";
import LoadScene from "./scene/LoadScene";
import BattleScene from "./scene/BattleScene";
import ShopScene from "./scene/ShopScene";
import CharacterScene from "./scene/CharacterScene";
import MapScene from "./scene/MapScene";
import DodgeScene from "./scene/dodgeScene";

(function() {
    const wf = document.createElement('script');
    wf.src = `${document.location.protocol === 'https:' ? 'https' : 'http'}://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
    wf.type = 'text/javascript';
    wf.async = true;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode?.insertBefore(wf, s);
    const element = document.createElement('style');
    document.head.appendChild(element);
    element.sheet!.insertRule('@font-face { font-family: "neodgm"; src: url("fonts/neodgm.woff") format("woff"); }\n', 0);
}());

//@ts-ignore
window.WebFontConfig = {
    google: {
        families: ['Noto Sans KR'],
    },
    custom: {
        families: [ 'neodgm' ]
    },
    active() {
        
        new Game({
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
                min: {
                    width: 800,
                    height: 600
                }
            },
            pixelArt: true,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
            scene: [LoadScene, CharacterScene, MapScene, BattleScene, ShopScene, DodgeScene],
            player: defaultPlayer
        });
    }
};