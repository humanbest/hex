import {BattleCard as Card, BattleCharacter, BattleNotification, TargetPointer } from "../object/BattleObject";
import MapScene from "../scene/MapScene";
import { BattleState, Scene } from "./Hex";

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
    get stateManager() {return this._stateManager}
    private readonly _stateManager: StateManager;

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
        this._stateManager = new StateManager(this);
        this._plyerCharacter = new BattleCharacter(this, 0, 0, scene.game.player!.champion);
        this._opponents = new Array<BattleCharacter>();
        this._targetPointer = new TargetPointer(this);
    }

    addMonster(): this
    {
        this._opponents.push(
            this._scene.add.existing(
                new BattleCharacter(this, this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, this.scene.game.player!.champion, "ninza")
            )
        )

        return this;
    }

    /**
     * 배틀을 시작합니다.
     */
    start(): void
    {
        // 테스트를 위한 치트키 설정
        this.scene.input.keyboard.on('keydown-SPACE', async () => {
            
            if(!this._stateManager.isLoading) {
                
                this._stateManager.state = BattleState.LOADING;

                this.cardManager.resetPosition();
                this.addCard();

                await this.waitForSeconds(CardManager.TWEEN_SPEED / 1000);

                this._stateManager.state = BattleState.NORMAL;
            }
        }).on('keydown-Q', async () => {     
            if(!this.stateManager.isLoading) this.stateManager.nextTurn();
        }).on('keydown-ONE',  () => this.battleClear());

        // 배틀이 시작함을 알립니다.
        this.battleNotification
            .startNotification(this.scene.tweens.createTimeline())
            .on("complete", () => this.stateManager.nextTurn())
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
        this.stateManager.state = BattleState.LOADING;

        this.targetPointer.clear();
        
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

    /** 카드 데미지 계산 메소드 */
    // static readonly CALULATE_DAMAGE = (cardEffectArr: Array<CardEffect>) => {

    //     let damage = 0;

    //     cardEffectArr.filter(buff => buff.type === CardEffectType.ADD_DAMAGE).forEach(buff => {
    //         damage += buff.value;
    //     });
    
    //     cardEffectArr.filter(buff => buff.type === CardEffectType.ADD_DAMAGE_BY_RATIO).forEach(buff => {
    //         damage += buff.value;
    //     });
        
    //     return damage;
    // }

    /** 남은 카드 목록 */
    get remainCards() { return this._remainCards }
    set remainCards(remainCards) { this._remainCards = remainCards }
    private _remainCards: Array<string> = [];

    /** 사용된 카드 목록 */
    get usedCards() { return this._usedCards }
    set usedCards(usedCards: Array<string>) { this._usedCards = usedCards }
    private _usedCards: Array<string> = [];

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
        return cardName ? this.add(new Card(this.battleManager, cardName, true)) : this;
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
}

/**
 * 상태 매니저
 * 
 * 현재 배틀의 상태를 관리하는 객체입니다.
 * 
 * @author Rubisco
 * @since 2022-09-17 오후 10:21
 */
export class StateManager {

    /** 배틀 상태 */
    get state() {return this._state}
    set state(state: BattleState) {this._state = state}
    private _state: BattleState;

    /** 로딩 상태 */
    get isLoading() {return this._state === BattleState.LOADING}

    /** 드래그 상태 */
    get isDraging() {return this._state === BattleState.DRAG}

    /** 플레이어 턴 여부 */
    get playerTurn() {return this._playerTurn}
    set playerTurn(playerTurn: boolean) {this._playerTurn = playerTurn}
    private _playerTurn: boolean;

    /** 현재 턴 */
    get currentTurn() {return this._currentTurn}
    private set currentTurn(turn: number) {this._currentTurn = turn}
    private _currentTurn: number;

    /** 배틀 매니저 객체 */
    get battleManager() {return this._battleManager}
    private readonly _battleManager: BattleManager;

    constructor(battleManager: BattleManager) {
        
        // 배틀 매니저 주입
        this._battleManager = battleManager;
        
        // 로딩 상태를 기본값으로 설정
        this._state = BattleState.LOADING;

        // 플레이어 턴의 기본값 설정
        this._playerTurn = false;

        // 현재 턴 기본값 설정
        this._currentTurn = 0;
    }

    async nextTurn(): Promise<void> {
        
        // 카드 상호작용을 하지 못하도록 로딩상태로 설정합니다.
        this._state = BattleState.LOADING;

        // 턴 상태를 토글하고, 턴 상태에 따른 메소드를 호출합니다.
        (this.playerTurn = !this.playerTurn) 
            ? ++this.currentTurn && await this.battleManager.playerTurn() 
            : await this.battleManager.opponentTurn();

        await this.battleManager.waitForSeconds(0.3);

        // 카드와 상호작용 할 수 있도록 노말상태로 설정합니다.
        this._state = BattleState.NORMAL;
    }
}