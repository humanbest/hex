import { Vector } from "matter";
import Card from "../object/Card";
import BattleScene from "../scene/BattleScene";
import MapScene from "../scene/MapScene";
import { Buff, Champion, ChampionName, Scene } from "./Hex";

enum CardState { NORMAL, HOVER, CLICK , PLAYER_HOVER, ENEMY_HOVER}

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
                new BattleCharacter(this, scene.cameras.main.width / 2, scene.cameras.main.height / 2, scene.game.player!.champion, "middle_boss")
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
                originAngle: 0,
                state: CardState.NORMAL
            })
            .setScale(0.2)
            .setInteractive()
            .on("pointerover", () => this.pointerOver(card))
            .on("pointerout", () => this.pointerOut(card))
            .on("dragstart", ()=> this.dragStart(card))
            .on("drag", (pointer: Phaser.Input.Pointer) => this.drag(pointer))
            .on("dragend", () => this.dragEnd())
            // .on("pointerdown", () => this.pointerDown(card))
            // .on("pointermove", (pointer: Phaser.Input.Pointer) => this.pointerMove(card, pointer))
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
     * @param card 카드
     */
    private drag(pointer: Phaser.Input.Pointer): void
    {
        if(this._selectedCard) this.battleManager.targetPointer.createLineFromCardToPointer(this._selectedCard, pointer);
    }

    /**
     * 카드의 드래그 상태가 끝나면 타겟 포인터가 사라집니다.
     * 
     * @param card 카드
     */
    private dragEnd(): void
    {
        this.battleManager.targetPointer.pointer.clear();
        this._selectedCard = undefined;
    }

    /**
     * 카드를 클릭하면 isSelected 상태가 토글됩니다.
     * 
     * @param card 카드
     */
    private pointerDown(card: Card): void 
    {
        if(this.battleManager.turnManager.isLoading) return;

        if(this._selectedCard === card) {
            this._selectedCard = undefined;
            this.pointerOut(card);
            this.battleManager.targetPointer.pointer.clear();
        } else {
            const preSelectedCard = this._selectedCard;
            this._selectedCard = card;
            if (preSelectedCard) this.pointerOut(preSelectedCard);
            this.bringToTop(card);
            this.scene.add.tween({
                targets: card,
                y: -CardManager.CARD_SCALE * Card.HEIGHT * 0.2,
                angle: 0,
                duration: 100,
                scale: CardManager.CARD_SCALE * 1.2,
                ease: 'Quad.easeInOut'
            });
        }
    }

    /**
     * 카드가 포인터 위치를 따라 움직입니다.
     * 
     * @param card 카드
     * @param pointer 포인터 위치
     */
    private pointerMove(_card: Card, _pointer: Phaser.Input.Pointer): void 
    {
        // if(!this.battleManager.turnManager.isLoading && card.isSelected) card.setPosition(pointer.x - this.x, pointer.y - this.y);
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

/**
 * 알림 컨테이너
 * 
 * 현재 배틀 상태에 대한 알림창을 나타냅니다.
 * 
 * @author Rubisco
 * @since 2022-09-17 오후 10:21
 */
export class BattleNotification extends Phaser.GameObjects.Container {

    /** 알림 토스트 컨테이너 높이 */
    static HEIGHT: number = 120;

    /** 알림 토스트 컨테이너 depth */
    static DEPTH: number = 2;
    
    /** 알림 토스트 배경색 */
    static COLOR: number = 0x000000;

    /** 알림 토스트 배경 이미지 */
    private readonly _background: Phaser.GameObjects.Rectangle;
    get background() {return this._background}

    /** 알림 토스트 검(sword) 이미지 */
    private readonly _swordImage: Phaser.GameObjects.Image;
    get swordImage() {return this._swordImage}

    /** 알림 토스트 텍스트 박스 */
    private readonly _textBox: Phaser.GameObjects.Text;
    get textBox() {return this._textBox}

    /** 알림 토스트 턴(turn) 텍스트 박스 */
    private readonly _turnText: Phaser.GameObjects.Text;
    get turnText() {return this._turnText}

    /** 씬 객체 인터페이스 재정의 */
    scene: Scene;

    /** 배틀 매니저 객체 */
    get battleManager() {return this._battleManager}
    private readonly _battleManager: BattleManager;

    /**
     * 알림 컨테이너를 생성합니다.
     * 
     * @param battleManager 배틀 매니저
     */
    constructor(battleManager: BattleManager) {

        super(battleManager.scene, 0, battleManager.scene.game.canvas.height/2);

        // 배틀 매니저를 주입합니다.
        this._battleManager = battleManager;
        
        // 씬을 주입합니다.
        this.scene = battleManager.scene;

        // 배경을 주입합니다.
        this._background = battleManager.scene.add.rectangle(battleManager.scene.game.canvas.width/2, 0, battleManager.scene.game.canvas.width, 0, BattleNotification.COLOR, 0.3);

        // 텍스트 박스를 주입합니다.
        this._textBox = battleManager.scene.add.text(0, 0, "", {
            fontFamily: "neodgm",
            fontSize: "60px",
            color: "gold",
            stroke: "black",
            align: "center",
            strokeThickness: 10,
        }).setOrigin(0.5).setShadow(2, 2, "black", 2, true, true).setVisible(false);

        // 턴(turn) 텍스트 박스를 주입합니다.
        this._turnText = battleManager.scene.add.text(0, 0, "", {
            fontFamily: "neodgm",
            fontSize: "25px",
            color: "snow",
            stroke: "black",
            align: "center",
            strokeThickness: 2,
        }).setOrigin(0.5, 0).setShadow(2, 2, "black", 2, true, true).setData("turn", 1).setVisible(false);

        // 검(sword) 이미지를 주입합니다.
        this._swordImage = battleManager.scene.add.container().scene.add.image(0, 0, BattleScene.KEY.IMAGE.SWORD).setOrigin(1, 0.5).setScale(3.5).setVisible(false);

        // 씬에 알림 컨테이너를 추가합니다.
        battleManager.scene.add.existing(this)
            .setSize(battleManager.scene.game.canvas.width, BattleNotification.HEIGHT)
            .setDepth(BattleNotification.DEPTH)
            .add([this.background, this.swordImage, this.textBox, this.turnText])
            .setVisible(false);
    }

    /**
     * 배틀 시작 알림에 대한 타임라인을 추가하여 반환합니다.
     * 
     * @param timeline 타임라인
     * @return Phaser.Tweens.Timeline
     */
    startNotification(timeline: Phaser.Tweens.Timeline): Phaser.Tweens.Timeline {
        
        // 텍스트 박스의 텍스트와 위치를 설정합니다.
        this.textBox
            .setText("전투 시작")
            .setPosition(this.width/2, 0)
            .setVisible(true);
        
        // 검 이미지의 위치를 설정합니다.
        this.swordImage
            .setPosition(this.textBox.getLeftCenter().x, 0)
            .setVisible(true);

        // 알림 컨테이너를 visible 상태로 전환합니다.
        this.setVisible(true);
        
        // 알림 컨테이너의 배경이 나타나고, 
        // 중앙에 있던 텍스트 박스와 검(sword) 이미지가 왼쪽으로 이동하면서 사라집니다.
        return timeline.add({
            targets: this.background,
            y: -BattleNotification.HEIGHT/2,
            height: BattleNotification.HEIGHT,
            duration: 300,
            ease: 'Quad.easeInOut',
        }).add({
            targets: [this.swordImage, this.textBox],
            x: `-=${this.textBox.getRightCenter().x}`,
            delay: 800,
            duration: 300,
            ease: 'Quad.easeInOut',
            onComplete: (_tweens, targets) => targets.forEach(obj => obj.setVisible(false))
        });
    }

    /**
     * 턴을 알리는 타임라인을 추가하여 반환합니다.
     * 
     * @param timeline 타임라인
     * @return Phaser.Tweens.Timeline
     */
    turnNotification(timeline: Phaser.Tweens.Timeline): Phaser.Tweens.Timeline {

        const isPlayerTurn: boolean = this.battleManager.turnManager.playerTurn;
        const currentTurn: number = this.battleManager.turnManager.currentTurn;
        
        // 1번째 턴인 경우
        if(currentTurn === 1 && isPlayerTurn) {

            // 텍스트 박스의 텍스트와 위치를 설정합니다.
            this.textBox
                .setText("내 턴")
                .setPosition(this.width + this.textBox.width/2, -15)
                .setVisible(true);

            // 턴(turn)텍스트 박스의 텍스트와 위치를 설정합니다.
            this.turnText
                .setText(`${currentTurn}턴`)
                .setPosition(this.textBox.getBottomCenter().x, this.textBox.getBottomCenter().y)
                .setVisible(true);

            // 텍스트가 중앙으로 이동하고, 알림창이 서서히 사라집니다.
            return timeline.add({
                targets: [this.textBox, this.turnText],
                x: this.width/2,
                duration: 300,
                ease: 'Quad.easeInOut',
            }).add({
                targets: this,
                alpha: 0,
                delay: 800,
                duration: 800,
                ease: 'Quad.easeInOut',
                onComplete: () => {
                    this.setAlpha(1).setVisible(false);
                    this.textBox.setVisible(false);
                    this.turnText.setVisible(false);
                }
            })
        }

        // 1번째 턴이 아닌 경우

        // 텍스트 박스의 텍스트와 위치를 설정합니다.
        this.textBox
            .setText( isPlayerTurn ? "내 턴" : "적 턴")
            .setPosition(this.width/2, isPlayerTurn ? -15 : 0)
            .setVisible(true);

        // 턴(turn)텍스트 박스의 텍스트와 위치를 설정합니다.
        if (isPlayerTurn) {
            this.turnText
                .setText(`${currentTurn}턴`)
                .setPosition(this.textBox.getBottomCenter().x, this.textBox.getBottomCenter().y)
                .setVisible(true);
        }

        // 알림 컨테이너의 투명도를 0으로 설정하고 visible 상태로 전환합니다.
        this.setAlpha(0).setVisible(true);

        // 알림창이 서서히 나타났다가 다시 서서히 사라집니다.
        return timeline.add({
            targets: this,
            alpha: 1,
            duration: 800,
            ease: 'Quad.easeInOut',
        }).add({
            targets: this,
            alpha: 0,
            delay: 800,
            duration: 800,
            ease: 'Quad.easeInOut',
            onComplete: () => {
                this.setAlpha(1).setVisible(false);
                this.textBox.setVisible(false);
                this.turnText.setVisible(false);
            }
        })
    }
}

/**
 * 배틀 캐릭터 객체
 * 
 * 배틀을 위해 챔피언 캐릭터의 인터페이스를 구현한 클래스 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-19 오전 9:06
 */
export class BattleCharacter extends Phaser.GameObjects.Container {

    /** 캐릭터 체력 */
    get hp() {return this._hp}
    private set hp(hp) {this._hp = hp}
    private _hp: number;

    /** 캐릭터 최대 체력 */
    get maxHp() {return this._maxHp}
    private set maxHp(maxHp) {this._maxHp = maxHp}
    private _maxHp: number;

    /** 캐릭터 방어력 */
    get defense() {return this._defense}
    private set defense(defense) {this._defense = defense}
    private _defense: number;

    /** 현재 코스트 */
    get cost() {return this._cost}
    private set cost(cost) {this._cost = cost}
    private _cost: number;

    /** 버프 리스트 */
    get buffArr() {return this._buffArr}
    private set buffArr(buffArr) {this._buffArr = buffArr}
    private _buffArr: Buff[];

    /** 캐릭터 원본 객체 */
    get originData() {return this._originData};
    private readonly _originData: Champion;

    /** 배틀 매니저 객체 */
    get battleManager() {return this._battleManager}
    private readonly _battleManager: BattleManager;

    /** 스프라이트 객체 */
    get sprite() {return this._sprite}
    private _sprite?: Phaser.GameObjects.Sprite;

    /** 
     * 캐릭터 매니저 객체를 생성합니다.
     * 
     * @param battleManager 배틀 매니저
     */
    constructor(battleManager: BattleManager, x: number, y: number, champion: Champion, name?: string) {

        super(battleManager.scene, x, y);

        /** 배틀 매니저 객체를 주입합니다. */
        this._battleManager = battleManager;

        /** 원본 캐릭터 데이터로부터 값을 복사합니다. */
        this._hp = champion.hp
        this._maxHp = champion.maxHp
        this._defense = champion.defense
        this._cost = champion.cost
        this._buffArr = [];

        /** 원본 캐릭터 데이터를 주입합니다. */
        this._originData = champion;

        if(name) this.add(this._sprite = battleManager.scene.add.sprite(0, 0, name));

        if(this._sprite) {
            this.setSize(this._sprite.width, this._sprite.height);
            const skills = this._sprite.anims.animationManager["anims"].keys();
            let c = 0;
            this._sprite.setInteractive().on('pointerdown', () => {
                if(this._sprite) {
                    if(++c === skills.length) c = 0;
                    this._sprite.play(skills[c]);
                }
            })
    
            this._sprite.play("idle").setScale(3);
        }

    }

    /**
     * 캐릭터가 데미지를 입습니다.
     * 
     * @param damage 데미지
     */
    addDamage(damage: number): void { this.hp -= damage }

    /**
     * 캐릭터의 방어력을 향상시킵니다.
     * 
     * @param defense 방어력
     */
     addDefense(defense: number): void { this.defense += defense }

     /**
     * 캐릭터에 버프를 추가합니다.
     * 
     * @param buff 버프
     */
    addBuffCmd(buff: Buff): void { this.buffArr.push(buff) }
 }

 /**
 * 타겟 포인터 객체
 * 
 * 카드를 제출할때 나타나는 타겟 포인터 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-23 오전 6:00
 */
 class TargetPointer extends Phaser.Curves.CubicBezier 
 {
    /** 배틀 매니저 객체 */
    private readonly battleManager: BattleManager;

    /** 포인터 */
    private readonly _pointer: Phaser.GameObjects.Graphics;
    get pointer() {return this._pointer}

    /** 삼각형 */
    private readonly triangle: Phaser.Geom.Triangle;
    private readonly strokeTriangle: Phaser.Geom.Triangle;

    /** 색상 */
    private _color: number;
    set color(color: number) {this._color = color}

    /** 선 색상 */
    private _strokeColor: number;
    set strokeColor(color: number) {this._strokeColor = color}

    /** 
     * 타겟 포인터 객체를 생성합니다
     * 
     * @param battleManager 배틀 매니저
     */
    constructor(battleManager: BattleManager)
    {
        super(new Phaser.Math.Vector2(), new Phaser.Math.Vector2(), new Phaser.Math.Vector2(), new Phaser.Math.Vector2());
        this.battleManager = battleManager;
        this._pointer = battleManager.scene.add.graphics().setDepth(2);
        this.triangle = Phaser.Geom.Triangle.BuildEquilateral(0, 0, 30);
        this.strokeTriangle = Phaser.Geom.Triangle.BuildEquilateral(0, 0, 31);
        this._color = 0xa8aaaa;
        this._strokeColor = 0x41413f;
    }

    /** 타겟 포인터가 그려집니다.
     * 
     * @param start 시작 좌표
     * @param end 끝 좌표
     */
    createLineFromCardToPointer(start: Vector, end: Vector): void
    {
        this._pointer.clear()

        this.p0.x = start.x + this.battleManager.cardManager.x;
        this.p0.y = start.y + this.battleManager.cardManager.y;

        this.p1.x = start.x + this.battleManager.cardManager.x;
        this.p1.y = end.y - 100;

        this.p2.x = end.x;
        this.p2.y = end.y;

        this.p3.x = end.x;
        this.p3.y = end.y;

        Phaser.Geom.Triangle.CenterOn(this.triangle, end.x, end.y);
        Phaser.Geom.Triangle.CenterOn(this.strokeTriangle, end.x, end.y);

        this.getPoints(32).forEach(
            point => 
                this._pointer
                    .fillStyle(this._color, 1)
                    .lineStyle(2, this._strokeColor, 1)
                    .fillCircle(point.x, point.y, 3)
                    .strokeCircle(point.x, point.y, 4)
                    .fillTriangleShape(this.triangle)
                    .strokeTriangleShape(this.triangle)
        );
    }
 }