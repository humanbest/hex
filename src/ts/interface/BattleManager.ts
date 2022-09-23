import { BattleCharacter, BattleNotification, TargetPointer } from "../object/BattleObject";
import Card from "../object/Card";
import MapScene from "../scene/MapScene";
import { Scene } from "./Hex";

/**
 * 배틀 매니저
 * 
 * 배틀의 흐름을 제어합니다.
 * 
 * @author Rubisco
 * @since 2022-09-17 오후 3:02
 */
export default class BattleManager
{
    /** 카드 관리 컨테이너 객체 */
    get cardManager() {return this._cardManager}
    private readonly _cardManager: CardManager;

    /** 배틀 알림 컨테이너 객체 */
    get battleNotification() {return this._battleNotification}
    private readonly _battleNotification: BattleNotification;

    /** 턴 매니저 객체 */
    get turnManager() {return this._turnManager}
    private readonly _turnManager: TurnManager;

    /** 플레이어 캐릭터 객체 */
    get plyerCharacter() {return this._plyerCharacter}
    private readonly _plyerCharacter: BattleCharacter;

    /** 상대 몬스터 객체 리스트 */
    get opponents() {return this._opponents}
    private readonly _opponents: BattleCharacter[];

    /** 씬 객체 */
    get scene() {return this._scene}
    private readonly _scene: Scene;

    /** 타겟 포인터 객체 */
    get targetPointer() {return this._targetPointer};
    private readonly _targetPointer: TargetPointer;

    /**
     * 배틀 매니저 객체를 생성합니다.
     * 
     * @param scene 씬 객체
     */
    constructor(scene: Scene)
    {
        this._scene = scene;
        this._battleNotification = new BattleNotification(this);
        this._cardManager = new CardManager(this);
        this._turnManager = new TurnManager(this);
        this._plyerCharacter = new BattleCharacter(this, 0, 0, scene.game.player!.champion);
        this._opponents = new Array<BattleCharacter>();
        this._opponents.push(
            scene.add.existing(
                new BattleCharacter(this, scene.cameras.main.width / 2, scene.cameras.main.height / 2, scene.game.player!.champion, "ninza")
            )
        )
        this._targetPointer = new TargetPointer(this);
    }

    /**
     * 배틀을 시작합니다.
     */
    start(): void
    {
        // 테스트를 위한 치트키 설정
        this.scene.input.keyboard.on('keydown-SPACE', async () => {
            
            if(!this.turnManager.isLoading) {
                
                this.turnManager.isLoading = true;

                this.cardManager.resetPosition();
                this.addCard();

                await this.waitForSeconds(CardManager.TWEEN_SPEED / 1000);

                this.turnManager.isLoading = false;
            }
        }).on('keydown-Q', async () => {     
            if(!this.turnManager.isLoading) {
                this.turnManager.isLoading = true
                this.turnManager.nextTurn();
            }
        }).on('keydown-ONE',  () => this.battleClear());

        // 배틀이 시작함을 알립니다.
        this.battleNotification
            .startNotification(this.scene.tweens.createTimeline())
            .on("complete", () => this.turnManager.nextTurn())
            .play();
    }

    /**
     * 플레이어 턴이 시작되면 지정된 수만큼 카드를 뽑습니다.
     */
    async playerTurn(): Promise<void>
    {
        // 카드를 원래 포지션으로 되돌립니다.
        this.cardManager.resetPosition();

        // 알림창 뛰웁니다.
        this.battleNotification
            .turnNotification(this.scene.tweens.createTimeline())
            .play();

        // 카드를 분배받습니다.
        for(let i = 0; i < CardManager.INIT_CARD_COUNT; i++) await this.addCard();
    }

    /**
     * 상대방의 턴을 시작합니다.
     */
    async opponentTurn(): Promise<void>
    {
        // 카드를 원래 포지션으로 되돌립니다.
        this.cardManager.resetPosition();

        // 플레이어의 모든 선택된 카드를 묘지덱으로 이동시킵니다.
        this.moveAllCardsToUsedCards();

        // 상대턴임을 알리는 알림창을 띄웁니다.
        await new Promise(
            resolve =>
                this.battleNotification
                    .turnNotification(this.scene.tweens.createTimeline())
                    .on("complete", resolve)
                    .play()
        );
    }

    /**
     * 플레이어의 선택된 모든 카드를 묘지덱으로 이동시킵니다.
     */
    moveAllCardsToUsedCards(): void 
    {
        this.cardManager.getAll().forEach(card => this.cardManager.moveToUsedCards(card as Card));
    }

    /**
     * 카드를 한 장 추가합니다.
     */
    async addCard(): Promise<void>
    {
        this.cardManager
            .shuffle()
            .addCard(this.cardManager.remainCards.pop())
            .arangeCard();
        
        await this.waitForSeconds(CardManager.TWEEN_SPEED / 1000);
    }

    /**
     * 배틀에서 승리한 경우 플레이어의 현재 노드의 clear 상태를 true로 전환합니다.
     */
    battleClear(): void { 
        this.scene.game.player!.currentNode!.isClear = true; 
        this.scene.scene.start(MapScene.KEY.NAME);
    }

    /**
     * 지정된 단위 시간 동안 대기합니다.
     * 
     * @param second 초단위
     */
    async waitForSeconds(second: number): Promise<unknown>
    {
        return new Promise(resolve => setTimeout(resolve, second * 1000));
    }
}

/**
 * 카드 관리 컨테이너
 * 
 * 배틀에 필요한 카드 오브젝트를 관리하며, 카드에 동적인 기능을 부여합니다.
 * 
 * @author Rubisco
 * @since 2022-08-26 오후 5:02
 */
export class CardManager extends Phaser.GameObjects.Container
{
    /** 초기 카드 수 */
    static readonly INIT_CARD_COUNT: number = 5;

    /** 카드 배열 최대 각도 */
    static readonly CARD_MAX_ANGLE: number = 15;

    /** 카드 크기 비율 */
    static readonly CARD_SCALE: number = 0.5;
    
    /** 컨테이너 크기 배율*/
    static readonly CONTAINER_SCALE: number = 0.6;

    /** 카드 애니메이션 속도 */
    static readonly TWEEN_SPEED: number = 300;

    /** 남은 카드 목록 */
    get remainCards() { return this._remainCards }
    set remainCards(remainCards) { this._remainCards = remainCards }
    private _remainCards: Array<string> = [];

    /** 사용된 카드 목록 */
    get usedCards() { return this._usedCards }
    set usedCards(usedCards: Array<string>) { this._usedCards = usedCards }
    private _usedCards: Array<string> = [];

    /** 선택된 카드 */
    get selectedCard() { return this._selectedCard }
    set selectedCard(card) { this._selectedCard = card }
    private _selectedCard?: Card;

    /** 씬 객체 인터페이스 재정의 */
    scene: Scene;

    /** 배틀 매니저 객체 */
    get battleManager() {return this._battleManager}
    private readonly _battleManager: BattleManager;

    /**
     * 카드 관리 컨테이너를 생성합니다.
     * 
     * @param battleManager 배틀 매니저
     */
    constructor(battleManager: BattleManager)
    {
        super(battleManager.scene, 0, 0);

        /** 배틀 매니저를 주입합니다. */
        this._battleManager = battleManager;

        /** 씬을 주입합니다. */
        this.scene = battleManager.scene;

        /** 컨테이너 크기와 위치를 정의합니다. */
        this.setSize(battleManager.scene.game.canvas.width * CardManager.CONTAINER_SCALE, CardManager.CARD_SCALE * Card.HEIGHT)
            .setPosition(battleManager.scene.game.canvas.width * (1 - CardManager.CONTAINER_SCALE) / 2 , battleManager.scene.game.canvas.height - this.height / 2);

        /** 남은 카드 목록을 초기화 합니다. */
        this._remainCards = battleManager.scene.game.player!.dec.slice();

        /** 컨테이너를 씬에 추가합니다. */
        battleManager.scene.add.existing(this);
    }

    /**
     * 이름에 해당하는 카드를 한 장 생성하여 컨테이너에 추가합니다.
     * 
     * @param cardName 카드 이름
     * @returns 카드 관리 컨테이너
     */
    addCard(cardName?: string): this 
    {
        let card: Card;

        return cardName ? this.add(card = new Card(this.scene, cardName, true)
            .setSize(Card.WIDTH, Card.HEIGHT)
            .setPosition(-this.x + Card.WIDTH * 0.25, 0)
            .setData({
                originIndex: this.length,
                originPosition: new Phaser.Math.Vector2(0, 0),
                originAngle: 0
            })
            .setScale(0.2)
            .setInteractive()
            .on("pointerover", () => this.pointerOver(card))
            .on("pointerout", () => this.pointerOut(card))
            .on("dragstart", ()=> this.dragStart(card))
            .on("drag", (pointer: Phaser.Input.Pointer) => this.drag(pointer))
            .on("dragend", () => this.dragEnd())
        ).setDraggable(card) : this;
    }

    /**
     * 남은 카드를 섞습니다.
     * 
     * @returns 카드 관리 컨테이너
     */
    shuffle(): this 
    {
        if(!this.remainCards.length) this.remainCards.push(...this.usedCards.splice(0));
        this.remainCards = Phaser.Utils.Array.Shuffle(this.remainCards);
        
        return this;
    }

    /**
     * 카드를 정렬합니다.
     * 
     * @returns 카드 관리 컨테이너
     */
    arangeCard(): this
    {
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

        if (this.width < (Card.WIDTH * CardManager.CARD_SCALE - 20) * count) startPos = Card.WIDTH * CardManager.CARD_SCALE / 2;
        else startPos = (this.width - (Card.WIDTH * CardManager.CARD_SCALE - 20) * count + Card.WIDTH * CardManager.CARD_SCALE) / 2;
        
        const endPos: number = this.width - startPos;
        const radius: number = (endPos - startPos) / 8;
        
        this.getAll().forEach( (card, idx) => {

            const xPos: number = Phaser.Math.Linear(startPos, endPos, lerps[idx]);
            let yPos: number = 25;
            let angle: number = 0;
            
            if(count > 3) 
            {   
                yPos -= radius * Math.sqrt(Math.pow(0.5, 2) - Math.pow(lerps[idx] - 0.5, 2)) - 10;
                angle = Phaser.Math.Linear(-CardManager.CARD_MAX_ANGLE, CardManager.CARD_MAX_ANGLE, lerps[idx]);
            }

            this.scene.add.tween({
                targets: card.setData({
                    originIndex: idx,
                    originPosition: new Phaser.Math.Vector2(xPos, yPos),
                    originAngle: angle
                }),
                x: xPos,
                y: yPos,
                angle: angle,
                duration: CardManager.TWEEN_SPEED,
                scale: CardManager.CARD_SCALE,
            });
        });

        return this;
    }

    /**
     * 카드를 원래 위치로 되돌립니다.
     * 
     * @returns 카드 관리 컨테이너
     */
    resetPosition(): this 
    {
        this.getAll().forEach(card => {
            this.moveTo(card, card.getData("originIndex"));
            this.scene.add.tween({
                targets: card,
                x: card.getData("originPosition").x,
                y:  card.getData("originPosition").y,
                scale: CardManager.CARD_SCALE,
                angle: card.getData("originAngle"),
                duration: CardManager.TWEEN_SPEED,
            })
        })

        return this;
    }

    /**
     * 사용한 카드를 오른쪽의 묘지덱으로 이동시킵니다.
     * 
     * @param card 카드
     */
    moveToUsedCards(card: Card): void
    {
        this.usedCards.push(card.getData("key") as string);
        this.scene.add.tween({
            targets: card,
            x: this.scene.game.canvas.width - this.x - Card.WIDTH * 0.25,
            angle: 0,
            duration: CardManager.TWEEN_SPEED,
            scale: 0.2,
            ease: 'Quad.easeInOut',
            onComplete: () => card.destroy()
        })
    }

    /**
     * 카드에 포인터를 올리면 카드가 커집니다.
     * 
     * @param card 카드
     */
    private pointerOver(card: Card): void
    {
        if(this.battleManager.turnManager.isLoading || this._selectedCard) return;

        this.bringToTop(card);
        this.scene.add.tween({
            targets: card,
            y: (CardManager.CARD_SCALE - 1) * Card.HEIGHT / 2,
            angle: 0,
            duration: 100,
            scale: 1,
            ease: 'Quad.easeInOut'
        });
    }

    /**
     * 카드에서 포인터가 벗어나면 원래 상태로 돌아갑니다.
     * 
     * @param card 카드
     */
    private pointerOut(card: Card): void 
    {   
        if(!this._selectedCard) {
            this.moveTo(card, card.getData("originIndex"));
            this.scene.add.tween({
                targets: card,
                x: card.getData("originPosition").x,
                y: card.getData("originPosition").y,
                angle: card.getData("originAngle"),
                duration: 100,
                scale: CardManager.CARD_SCALE,
                ease: 'Quad.easeInOut'
            });
        }
    }

    /**
     * 카드의 드래그를 시작합니다.
     * 
     * @param card 카드
     */
    private dragStart(card: Card): void 
    {
        this._selectedCard = card;
        this.scene.add.tween({
            targets: card,
            y: -CardManager.CARD_SCALE * Card.HEIGHT * 0.2,
            angle: 0,
            duration: 100,
            scale: CardManager.CARD_SCALE * 1.2,
            ease: 'Quad.easeInOut'
        });
    }

    /**
     * 카드가 드래그되면 타켓 포인터가 생깁니다.
     * 
     * @param pointer 포인터 좌표
     */
    private drag(pointer: Phaser.Input.Pointer): void
    {   
        // 턴이 로딩중이면 리턴
        if(this.battleManager.turnManager.isLoading) return;
        
        // 선택된 카드가 있으면 타겟 포인터 생성
        if(this._selectedCard) this.battleManager.targetPointer.createLineFromCardToPointer(this._selectedCard, pointer);
    }

    /**
     * 카드의 드래그 상태가 끝나면 타겟 포인터가 사라집니다.
     */
    private dragEnd(): void
    {
        this.battleManager.targetPointer.pointer.clear();
        this._selectedCard = undefined;
    }

    private setDraggable(card: Card): this {
        this.scene.input.setDraggable(card);
        return this;
    }
}

/**
 * 턴(Turn) 매니저
 * 
 * 현재 배틀의 턴을 관리하는 객체입니다.
 * 
 * @author Rubisco
 * @since 2022-09-17 오후 10:21
 */
export class TurnManager {

    /** 턴의 로딩 상태 여부 */
    get isLoading() {return this._isLoading}
    set isLoading(isLoading: boolean) {this._isLoading = isLoading}
    private _isLoading: boolean;

    /** 플레이어 턴 여부 */
    get playerTurn() {return this._playerTurn}
    set playerTurn(playerTurn: boolean) {this._playerTurn = playerTurn}
    private _playerTurn: boolean;

    /** 현재 턴 */
    get currentTurn() {return this._currentTurn}
    private set currentTurn(turn: number) {this._currentTurn = turn}
    private _currentTurn: number;

    /** 씬 객체 */
    get scene() {return this._scene}
    private readonly _scene: Scene;

    /** 배틀 매니저 객체 */
    get battleManager() {return this._battleManager}
    private readonly _battleManager: BattleManager;

    constructor(battleManager: BattleManager) {
        
        // 배틀 매니저 주입
        this._battleManager = battleManager;
        
        // 씬 주입
        this._scene = battleManager.scene;
        
        // 로딩 상태의 기본값 설정
        this._isLoading = true;

        // 플레이어 턴의 기본값 설정
        this._playerTurn = false;

        // 현재 턴 기본값 설정
        this._currentTurn = 0;
    }

    async nextTurn(): Promise<void> {
        
        // 카드 상호작용을 하지 못하도록 로딩상태를 true로 설정합니다.
        this.isLoading = true;

        // 턴 상태를 토글하고, 턴 상태에 따른 메소드를 호출합니다.
        (this.playerTurn = !this.playerTurn) 
            ? ++this.currentTurn && await this.battleManager.playerTurn() 
            : await this.battleManager.opponentTurn();

        await this.battleManager.waitForSeconds(0.5);

        // 카드와 상호작용 할 수 있도록 로딩 상태를 false로 설정합니다.
        this.isLoading = false;
    }
}