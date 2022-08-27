import { Vector } from "matter";
import { Game } from "phaser"

/**
 * 카드 속성
 */
export enum CardType {
    /** 공격 */
    ATTACK,
    
    /** 방어 */
    DEFENSE,
    
    /** 공격 버프 */
    AT_BUFF,
    
    /** 방어 버프 */
    DF_BUFF,
    
    /** 디버프 */
    DEBUFF
}

/**
 * 카드 효과 인터페이스
 */
export interface CardEffect {

    /** 카드 타입 */
    type: CardType;

    /** 카드 효과 값 */
    value: number;
}

/**
 * 카드 데이터 인터페이스
 */
export interface CardData {

    /** 카드 이름 */
    name: string;

    /** 카드 타입 */
    type: Array<CardType> | CardType;

    /** 소지가능 챔피언 PK */
    ownership: ChampionPrimaryKey;

    /** 비용 */
    cost: number;
}

/**
 * 카드 세부 조정 인터페이스
 */
export interface CardAdjust {

    /** 카드 위치 오차값 */
    position: Vector,

    /** 카드 크기 오차값 */
    scale: Vector
}

/**
 * 아이템 속성
 */
export enum ItemType {

    /** HP 회복 */
    HP_RECOVERY
}

/**
 * 아이템 효과 인터페이스
 */
export interface ItemEffect {
    (player: Player, opponent: Player): void
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
    PHANTOM = "팬텀",
}

/**
 * 챔피언 PK
 */
enum ChampionPrimaryKey {
    COMMON, SMUGGLER, PHANTOM
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