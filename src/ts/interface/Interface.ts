import { Vector } from "matter";
import { Game } from "phaser"

/**
 * 카드 속성
 */
export enum CardAttribute {
    ATTACK, DEFENSE, AT_BUFF, DF_BUFF, DEBUFF
}

/**
 * 카드 효과 인터페이스
 */
export interface CardEffect {
    type: CardAttribute;
    value: number;
}

/**
 * 카드 데이터 인터페이스
 */
export interface CardData {
    name: string;
    effect: Array<CardEffect> | CardEffect;
    ownership: ChampionName | "공통";
    cost: number;
}

/**
 * 카드 세부 조정 인터페이스
 */
export interface cardAdjust {
    position: Vector,
    scale: Vector
}

/**
 * 아이템 속성
 */
export enum ItemAttribute {
    HP_RECOVERY
}

/**
 * 아이템 효과 인터페이스
 */
export interface ItemEffect {
    type: ItemAttribute;
    value: number;
}

/**
 * 아이템 인터페이스
 */
export interface Item {
    name: string;
    effect: Array<ItemEffect> | ItemEffect;
}

/**
 * 챔피언 이름
 */
export enum ChampionName {
    SMUGGLER = "스머글러",
    PHANTOM = "팬텀"
}

/**
 * 챔피언 인터페이스
 */
export interface Champion {
    name: ChampionName;
    hp: number;
    maxHp: number;
    defense: number;
    cost: number;
}

/**
 * 인벤토리 인터페이스
 */
export interface Inventory {
    coin: number;
    items: Array<Item>
}

/**
 * 플레이어 인터페이스
 */
export interface Player {
    nickName: string;
    champion: Champion;
    inventory: Inventory;
    dec: Array<string>;
}

/**
 * HEX 게임 인터페이스
 */
export interface HexGame extends Game {
    player: Player;
}