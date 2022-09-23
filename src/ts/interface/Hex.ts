import { Vector } from "matter";
import Phaser from "phaser";
import { Node } from "../object/MapObject";

/**
 * HEX 게임의 메인 컨트롤러 입니다.
 * 
 * @author Rubisco
 * @since 2022-08-30 오후 7:41
 */
export class Game extends Phaser.Game {

    readonly player?: Player;

    constructor(GameConfig?: GameConfig) {
        super(GameConfig);
        this.player = GameConfig?.player;
    }
}

/**
 * HEX 게임의 씬 오브젝트 입니다.
 * 
 * @author Rubisco
 * @since 2022-08-30 오후 7:41
 */
export abstract class Scene extends Phaser.Scene {
    
    game: Game;

    constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);
        this.game = super.game;
    };

    preload(): void {
        this.input.keyboard.on('keydown-F',  () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        })
    }
}

export type GameConfig = Phaser.Types.Core.GameConfig & {player?: Player}

/**
 * 카드 속성
 * 
 * 카드의 주기능에 따라 타입을 구분합니다.
 */
export enum CardType {
    /** 공격 */
    ATTACK,
    
    /** 방어 */
    DEFENSE,
    
    /** 보조 */
    ASSISTANCE,
}

/**
 * 카드 효과 열거형
 * 
 * 카드 효과를 전달하기 위한 열거형 타입입니다.
 */
export enum CardEffectPK {
    ADD_DAMAGE, // 0 데미지 추가 효과
    ADD_DEFENSE, // 1 방어력 증가 효과
    ADD_BUFF, // 2 버프 추가 효과
    ADD_DAMAGE_BY_RATIO, // 3 비례 데미지 공격 효과
    ADD_DEFENSE_BY_RATIO, // 4 비례 방어력 증가 효과
    REPLECT_DAMAGE, // 5 공격 반사 효과
    RANDOM_DAMAGE, // 6 랜덤 데미지 효과
    DEFENSE_IGNORE, // 7 방어력 무시 공격 효과
    HP_RECOVERY, // 8 HP 회복 효과
    iNSTANCE_DEATH, // 9 즉사 효과
    COST_MAX_ADD // 10 코스트 증가 효과
}

/**
 * 카드 효과 인터페이스
 * 
 * 카드 효과에 대한 정보를 정의한 인터페이스 입니다.
 * 
 * @param type 카드 효과의 기본키 입니다.
 * @param value 카드 효과에 대한 값 입니다.
 * @param turn 카드 효과가 지속되는 턴의 수를 나타냅니다.
 */
export interface CardEffect {
    type: CardEffectPK;
    value: number;
    turn?: number;
}

/** 
 * 버프 효과 인터페이스
 * 
 * 카드 효과 인터페이스의 별칭입니다. 
 */
export type Buff = CardEffect;

/**
 * 카드 데이터 인터페이스
 */
export interface CardData {

    /** 키값 */
    key: number;

    /** 카드 이름 */
    name: string;

    /** 카드 타입 */
    type: CardType;

    /** 소지가능 챔피언 PK */
    ownership: ChampionPrimaryKey;

    /** 비용 */
    cost: number;

    /** 카드 효과 리스트 */
    effect: Array<CardEffect>;

    /** 카드가 뽑힐 확률 */
    probability: number;
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
    COMMON, SMUGGLER, PHANTOM, WARWOLF
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
    currentNode?: Node
}

export const defaultPlayer: Player = {
    nickName:  "루비스코",
    champion: {
        name: ChampionName.PHANTOM,
        hp: 80,
        maxHp: 80,
        defense: 0,
        cost: 3
    },
    dec: [],
    inventory: {
        coin: 100,
        items: []
    }
}