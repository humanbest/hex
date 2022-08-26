import { Scene } from "phaser";
import { CONFIG } from "../config";
import Card from "../ui/CardUI";
import { CardConfig, HexGame } from "./Interface";

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
        this.setSize(this.scene.game.canvas.width * CardManager.maxScale, this.scene.game.canvas.height - CONFIG.CONTAINER.TOP.HEIGHT)
        .setPosition(0, CONFIG.CONTAINER.TOP.HEIGHT);

        for(let i = 0; i < CardManager.initCardCount; i++) this.addCard();
    }

    public addCard(doTween?: boolean): this 
    {
        if(doTween == undefined) doTween = true;

        this.shuffle(this.remainCards);

        const cardName = this.remainCards.pop() as string;
        
        const card = new Card(this.scene, cardName, true)
                .setSize(Card.width, Card.height)
                .setPosition(-Card.width, this.height / 2)
                .setScale(Card.scale)
                .setInteractive()
                .on("pointerover", () => this.pointerOver(card))
                .on("pointerout", () => this.pointerOut(card))
                .on("pointerdown", () => this.pointerDown(card))
                .on("pointermove", (pointer: Phaser.Input.Pointer) => this.pointerMove(card, pointer));

        this.add(card)
            .arangeCard(doTween)
            .selectedCards.push(cardName);

        return this;
    }

    public shuffle(arr?: Array<string>): this 
    {
        if(!arr?.length) arr = (this.scene.game as HexGame).player.dec.slice();
        this.remainCards = Phaser.Utils.Array.Shuffle(arr);
        
        return this;
    }

    private arangeCard(doTween?: boolean): this 
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
            })
            
            this.scene.add.tween({
                targets: card,
                x: xPos,
                y: yPos,
                angle: angle,
                duration: 300,
                delay: doTween ? count * 300 : 0
            });
        });

        return this;
    }

<<<<<<< Updated upstream
    private getCardData(cardName: string): CardConfig | undefined 
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
=======
    private pointerOver(card: Card): void
    {
        if(!card.isSelected)
        {
            this.bringToTop(card);
            this.scene.add.tween({
                targets: card,
                y: this.height - Card.height / 2,
                angle: 0,
                duration: 100,
                scale: 1,
                ease: 'Quad.easeInOut'
            });
>>>>>>> Stashed changes
        }
    }

    private pointerOut(card: Card): void 
    {   
        card.isSelected = false;
        this.moveTo(card, card.data.values.originIndex);
        this.scene.add.tween({
            targets: card,
            x: card.data.values.originPosition.x,
            y: card.data.values.originPosition.y,
            angle: card.data.values.originAngle,
            duration: 100,
            delay: 0,
            scaleX: card.data.values.originScale.x,
            scaleY: card.data.values.originScale.y,
            ease: 'Quad.easeInOut'
        });
    }

    private pointerDown(card: Card): void 
    {
        if(!card.isSelected) card.isSelected = true;
        else {
            this.pointerOut(card);
        }
    }

    private pointerMove(card: Card, pointer: Phaser.Input.Pointer): void 
    {
        if(card.isSelected) card.setPosition(pointer.x, pointer.y);
    }
}