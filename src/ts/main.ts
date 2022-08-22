import Phaser from 'phaser';
import { CONFIG } from "./config"
import { HexGame } from "./interface/Interface";
import { LoadScene } from "./scene/LoadScene";
import { BattleScene } from "./scene/BattleScene";

(function() {
    const wf = document.createElement('script');
    wf.src = `${document.location.protocol === 'https:' ? 'https' : 'http'}://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
    wf.type = 'text/javascript';
    wf.async = true;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode?.insertBefore(wf, s);
}());

//@ts-ignore
window.WebFontConfig = {
    google: {
        families: ['Noto Sans KR'],
    },
    active() {
        const game = new Phaser.Game({
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
            scene: [LoadScene, BattleScene],
        }) as HexGame;
        game.player = {
            nickName: CONFIG.PLAYER.NICK_NAME,
            champion: {
                owner: CONFIG.PLAYER.CHAMP.OWNER,
                name: CONFIG.PLAYER.CHAMP.NAME,
                hp: CONFIG.PLAYER.CHAMP.HP,
                maxHp: CONFIG.PLAYER.CHAMP.MAX_HP,
                defense: CONFIG.PLAYER.CHAMP.DEFENSE,
                cost: CONFIG.PLAYER.CHAMP.COST
            },
            dec: [],
            inventory: {
                coin: CONFIG.PLAYER.INVENTORY.COIN,
                item: CONFIG.PLAYER.INVENTORY.ITEM
            },
            time: '00:21'
        }
    }
};