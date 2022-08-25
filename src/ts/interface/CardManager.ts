import { Scene } from "phaser";
import { CONFIG } from "../config";
import Card from "../ui/CardUI";
import { CardData, HexGame } from "./Interface";

export default class CardManager extends Phaser.GameObjects.Container 
{
    private static initCardCount: number = 5;
    private static maxScale: number = 0.6;

    private remainCards: Array<string> = [];
    private selectedCards: Array<string> = [];
    
    // private usedCards: Array<string> = [];

    constructor(scene: Scene, x: number, y: number)
    {
        super(scene, x, y);
        scene.add.existing(this);
        this.init();
    }

    private init(): void 
    {
        this.setSize(this.scene.game.canvas.width * CardManager.maxScale, this.scene.game.canvas.height - CONFIG.CONTAINER.TOP_MENU.HEIGHT)
        .setPosition(0, CONFIG.CONTAINER.TOP_MENU.HEIGHT);

        for(let i = 0; i < CardManager.initCardCount; i++) this.addCard();
    }

    public addCard(doTween?: boolean): this 
    {
        if(doTween == undefined) doTween = true;

        this.shuffle(this.remainCards);

        const cardName = this.remainCards.pop() as string;
        const cardData = this.getCardData(cardName);
        
        if(cardData)
        {
            this.add(new Card(this, cardName, cardData, true))
                .arrangeCard(doTween)
                .selectedCards.push(cardName);
        }

        return this;
    }

    public shuffle(arr?: Array<string>): this 
    {
        if(!arr?.length) arr = (this.scene.game as HexGame).player.dec.slice();
        this.remainCards = Phaser.Utils.Array.Shuffle(arr);
        
        return this;
    }

    private arrangeCard(doTween?: boolean): this 
    {
        if(doTween == undefined) doTween = true;

        const lerps: Array<number> = [];
        const count: number = this.length;

        switch (count) {
            case 0: return this;
            case 1: lerps.push(0.5); break;
            case 2: lerps.push(0, 1); break;
            default:
                const interval = 1 / (count - 1);
                for(let i = 0; i < count; i++) lerps.push(i * interval);
                break;
        }

        let startPos: number;

        if (this.width * CardManager.maxScale < (Card.width * Card.scale - 50) * count) startPos = (this.scene.game.canvas.width - this.width + Card.width * Card.scale) / 2;
        else startPos = (this.scene.game.canvas.width - (Card.width * Card.scale - 20) * count + Card.width * Card.scale) / 2;
        
        const endPos: number = this.scene.game.canvas.width - startPos;
        const radius: number = (endPos - startPos) / 8;
        
        this.getAll().forEach( (_card, idx) => {

            const card: Card = _card as Card;

            const xPos: number = Phaser.Math.Linear(startPos, endPos, lerps[idx]);
            let yPos: number = this.height - 50;
            let angle: number = 0;
            
            if(count > 3) 
            {   
                yPos -= radius * Math.sqrt(Math.pow(0.5, 2) - Math.pow(lerps[idx] - 0.5, 2)) - 10;
                angle = Phaser.Math.Linear(-15, 15, lerps[idx]);
            }

            card.setData({
                originIndex: idx,
                originPosition: new Phaser.Math.Vector2(xPos, yPos),
                originScale: new Phaser.Math.Vector2(card.scaleX, card.scaleY),
                originAngle: angle
            }).arrange({x: xPos, y: yPos}, angle, doTween);

        });

        return this;
    }

    private getCardData(cardName: string): CardData | undefined 
    {
        const cardData: any = this.scene.game.cache.json.get(CONFIG.DATA.CARD_DATA);

        if(cardData.hasOwnProperty(cardName)) {
            return {
                name: cardData[cardName].name,
                effect: {
                    type: cardData[cardName].effect,
                    value: 0
                },
                ownership: cardData[cardName].ownership,
                cost: cardData[cardName].cost
            }
        }

        return undefined;
    }
}