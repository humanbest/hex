import { Scene } from "phaser";
import { CONFIG } from "../config";
import Card from "../object/Card";
import { HexGame } from "./Interface";

/**
 * 카드 관리 컨테이너
 * 
 * @author Rubisco
 * @since 2022-08-26 오후 5:02
 */
export default class CardManager extends Phaser.GameObjects.Container 
{
    /** 초기 카드 수 */
    public static initCardCount: number = 5;
    
    /** 컨테이너 최대 배율*/
    private static maxScale: number = 0.6;

    private _remainCards: Array<string> = new Array<string>();

    private _selectedCards: Array<string> = new Array<string>();
    
    // private usedCards: Array<string> = [];

    /**
     * 카드 관리 컨테이너를 생성합니다.
     * 
     * @param scene 씬
     * @param x x좌표
     * @param y y좌표
     */
    constructor(scene: Scene, x: number, y: number)
    {
        super(scene, x, y);

        this.setSize(this.scene.game.canvas.width * CardManager.maxScale, this.scene.game.canvas.height - CONFIG.CONTAINER.TOP_MENU.HEIGHT)
            .setPosition(0, CONFIG.CONTAINER.TOP_MENU.HEIGHT);

        scene.add.existing(this);
    }

    /**
     * 선택된 카드의 이름 목록을 반환합니다.
     * 
     * @return 선택된 카드 이름 목록
     */
    public get selectedCards(): Array<string>
    {
        return this._selectedCards;
    }

    /**
     * 선택된 카드의 이름 목록을 설정합니다.
     * 
     * @param selectedCards 선택된 카드 이름 목록
     */
    private set selectedCards(selectedCards: Array<string>)
    {
        this._selectedCards = selectedCards;
    }

    /**
     * 남아있는 카드의 이름 목록을 반환합니다.
     * 
     * @return 남아있는 카드 이름 목록
     */
     public get remainCards(): Array<string>
     {
         return this._remainCards;
     }
 
     /**
      * 남아있는 카드의 이름 목록을 설정합니다.
      * 
      * @param remainCards 남아있는 카드 이름 목록
      */
     private set remainCards(remainCards: Array<string>)
     {
         this._remainCards = remainCards;
     }

    /**
     * 카드를 한 장 추가합니다.
     * 
     * @param doTween 애니메이션 효과 여부
     * @returns 카드 관리 컨테이너
     */
    public addCard(doTween?: boolean, isFront?: boolean): this 
    {
        if(doTween === undefined) doTween = true;
        if(isFront === undefined) isFront = true;

        this.shuffle(this.remainCards);

        const cardName = this.remainCards.pop() as string;

        const card = new Card(this.scene, cardName, isFront)
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

    /**
     * 카드를 섞습니다.
     * 
     * @param remainCards 남아있는 카드 이름 목록
     * @returns 카드 관리 컨테이너
     */
    public shuffle(remainCards?: Array<string>): this 
    {
        if(!remainCards?.length) remainCards = (this.scene.game as HexGame).player.dec.slice();
        this.remainCards = Phaser.Utils.Array.Shuffle(remainCards);
        
        return this;
    }

    /**
     * 카드를 정렬합니다.
     * 
     * @param doTween 애니메이션 효과 여부
     * @returns 카드 관리 컨테이너
     */
    public arangeCard(doTween?: boolean): this 
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
        
        this.getAll().forEach( (card, idx) => {

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
                originAngle: angle
            })
            
            const tween = this.scene.add.tween({
                targets: card,
                x: xPos,
                y: yPos,
                angle: angle,
                duration: 300,
                delay: doTween ? count * 300 : 0
            });

            if (doTween && count === CardManager.initCardCount) {
                tween.on("complete", () => this.scene.input.keyboard.on('keydown-SPACE', () => this.addCard(false)));
            }
        });

        return this;
    }

    /**
     * 카드에 포인터를 올리면 카드가 커집니다.
     * 
     * @param card 카드
     */
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
        }
    }

    /**
     * 카드에서 포인터가 벗어나면 원래 상태로 돌아갑니다.
     * 
     * @param card 카드
     */
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
            scaleX: Card.scale,
            scaleY: Card.scale,
            ease: 'Quad.easeInOut'
        });
    }

    /**
     * 카드를 클릭하면 isSelected 상태가 토글됩니다.
     * 
     * @param card 카드
     */
    private pointerDown(card: Card): void 
    {
        if(!card.isSelected) card.isSelected = true;
        else {
            this.pointerOut(card);
        }
    }

    /**
     * 카드가 포인터 위치를 따라 움직입니다.
     * 
     * @param card 카드
     * @param pointer 포인터 위치
     */
    private pointerMove(card: Card, pointer: Phaser.Input.Pointer): void 
    {
        if(card.isSelected) card.setPosition(pointer.x, pointer.y);
    }
}