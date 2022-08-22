import { Champion } from "./Interface";
import { Inventory } from "./Interface";

export class Player {

    nickName: string;
    champion: Champion;
    inventory: Inventory;
    dec: Array<string> = [];
    time?: string;

    constructor(data: Player) {
        this.nickName = data.nickName;
        this.champion = data.champion;
        this.inventory = data.inventory;
        this.dec = data.dec;
        this.time = data.time !== null ? data.time : "00:00";
    }
}