import { ChampionName } from "./interface/Interface";

export const CONFIG = {
    SCENES: {
        LOAD: "LOAD",
        MAP: "MAP",
        SHOP: "SHOP",
        CHRACTER_SELECT: "CHARCTER_SELECT",
        BATTLE: "BATTLE"
    },
    IMAGE: {
        CLOCK: "clock",
        COIN_BAG: "coin_bag",
        DEC: "dec",
        GEAR: "gear",
        HEART: "heart",
        MAP: "map",
        METAL: "metal_texture",
        CARD_FRONT: "card_front",
        CARD_BACK: "card_back",
        CARD_COLOR: "card_color",
        TITLE_COLOR: "title_color",
        COST_BOX: "cost_box",
        BATTLE_SCENE_BACKGROUND: "battle_scene_background",
        REMAIN_CARDS: "remain_cards"
    },
    AUDIO: {
    },
    ATLAS: {
        TOP: "top",
        CARD_BASE: "card_base",
        CARD_IMAGE: "card_image"
    },
    DATA: {
        CARD_DATA: "cardData",
        CARD_ADJUST: "cardAdjust"
    },
    CONTAINER: {
        TOP_MENU: {
            NAME: "topMenu",
            BACKGROUND: "background",
            HEIGHT: 40,
            LEFT: {
                NAME: "left",
                NICKNAME: "nickName",
                HP_IMAGE: "hpImage",
                HP_VALUE: "hpValue",
                COIN_BAG_IMAGE: "coinBagImage",
                COIN_BAG_VALUE: "coinBagValue"
            },
            RIGHT: {
                NAME: "right",
                CLOCK_IMAGE: "clockImage",
                CLOCK_VALUE: "clockValue",
                MAP_IMAGE: "mapImage",
                DEC_IMAGE: "decImage",
                GEAR_IMAGE: "gearImage",
                CARD_COUNT: "cardCount"
            }
        },
        CARD_MANAGER: {
            NAME: "cardManager"
        }
    },
    PLAYER: {
        NICK_NAME: "루비스코",
        CHAMP: {
            NAME: ChampionName.PHANTOM,
            HP: 80,
            MAX_HP: 80,
            DEFENSE: 0,
            COST: 3
        },
        INVENTORY: {
            COIN: 100,
            ITEM: []
        }
    }
}