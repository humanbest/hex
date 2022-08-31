import { Scene } from "../interface/Hex";
// import BattleScene from "./BattleScene";
import ShopScene from "./ShopScene";
// import BattleScene from "./BattleScene";


/**
 * Hex 게임의 로딩씬 입니다.
 *
 * @author Rubisco
 * @since 2022-08-25 오후 7:41
 */
export default class LoadScene extends Scene
{
    static readonly KEY = {
        ATLAS: {
            TOP: "top",
            CARD_BASE: "cardBase",
            CARD_IMAGE: "cardImage",
        },
        IMAGE: {
            CARD_BACK: "cardBack"
        },
        DATA: {
            CARD: "cardData",
            ADJUST: "cardAdjust"
        }
    }

    constructor()
    {
        super(LoadScene.name)
    }

    init(): void
    {
        const element = document.createElement('style');
        document.head.appendChild(element);
        const sheet = element.sheet;
        let styles = '@font-face { font-family: "neodgm"; src: url("fonts/neodgm.woff") format("woff"); }\n';
        sheet!.insertRule(styles, 0);
    }

    preload(): void
    {


        this.load.atlas(LoadScene.KEY.ATLAS.TOP, "assets/atlas/top.png", "assets/atlas/top.json");
        this.load.atlas(LoadScene.KEY.ATLAS.CARD_BASE, "assets/atlas/card_base.png", "assets/atlas/card_base.json");
        this.load.atlas(LoadScene.KEY.ATLAS.CARD_IMAGE, "assets/atlas/card_image.png", "assets/atlas/card_image.json");
        this.load.image(LoadScene.KEY.IMAGE.CARD_BACK, "assets/images/card_back.png");
        this.load.json(LoadScene.KEY.DATA.CARD, "assets/data/cardData.json");
        this.load.json(LoadScene.KEY.DATA.ADJUST, "assets/data/cardAdjust.json");

        this.load.image("ShopOwner","assets/images/shopscene/ShopOwner.png");
        this.load.image("ShopPaper","assets/images/shopscene/paper-plain.png");
        this.load.image("EXIT","assets/images/shopscene/EXIT.png");
        this.load.image("MYDEC","assets/images/shopscene/MYDEC.png");

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        });

        this.load.on("progress", (percent: integer) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
        })

        this.load.on("complete", () => {

        })
    }

    create(): void
    {
        if(this.game.player) this.game.player.dec.push(...Object.keys(this.game.cache.json.get(LoadScene.KEY.DATA.CARD)));
        this.scene.start(ShopScene.name);
    }
}