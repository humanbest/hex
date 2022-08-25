import { Vector } from "matter";
import { Game } from "phaser"

export enum CardAttribute {
    ATTACK, DEFENSE, AT_BUFF, DF_BUFF, DEBUFF
}

export interface CardEffect {
    type: CardAttribute;
    value: number;
}

export interface CardConfig {
    name: string;
    effect: Array<CardEffect> | CardEffect;
    ownership: number;
    cost: number;
}

export interface cardAdjust {
    position: Vector,
    scale: Vector
}

export enum ItemAttribute {
    HP_RECOVERY
}

export interface ItemEffect {
    type: ItemAttribute;
    value: number;
}

export interface Item {
    name: string;
    effect: Array<ItemEffect> | ItemEffect;
}

export enum Owner {
    COMMON, SMUGGLER, PHANTOM
}

export interface Champion {
    owner: Owner;
    name: string;
    hp: number;
    maxHp: number;
    defense: number;
    cost: number;
}

export interface Inventory {
    coin: number;
    item: Array<Item>
}

export interface Player {
    nickName: string;
    champion: Champion;
    inventory: Inventory;
    dec: Array<string>;
    time?: string;
}

export interface HexGame extends Game {
    player: Player;
}