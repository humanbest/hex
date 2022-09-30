import { BattleCard as Card, BattleCharacter, BattleNotification, NextButton, TargetPointer } from "../object/BattleObject";
import TopMenu from "../object/TopMenu";
import MapScene from "../scene/MapScene";
import { BattleState, Buff, CardEffect, CommandType, Scene } from "./Hex";

/**
 * 배틀 매니저
 * 
 * 배틀의 흐름을 제어하며, 배틀씬과 관련된 매니저 객체들의 퍼사드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-17 오후 3:02
 */

export default class BattleManager
{

    /**
     * 카드효과 커맨드 팩토리
     * 
     * `CardEffect` 인터페이스를 통해 카드효과 커맨드를 자동으로 생성하는 팩토리 메소드 입니다.
     * 
     * @param card 배틀카드 리시버 인터페이스
     * @param character 배틀캐릭터 리시버 인터페이스
     * @param cardEffect 카드 효과 인터페이스
     * @returns 커맨드 객체
     */
    static CardEffectCommandFactory(
        card: IBattleCardReceiver,
        character: IBattleCharacterReceiver, 
        cardEffect: CardEffect
    ): Command {
        switch (cardEffect.type) {
            case CommandType.ADD_ATTACK: return new AddAttackCmd(card, cardEffect.value as number);
            case CommandType.ADD_DEFENSE: return new AddDefenseCmd(card, cardEffect.value as number);
            case CommandType.ADD_ATTACK_BY_RATIO: return new AddAttackByRatioCmd(card, cardEffect.value as number);
            case CommandType.ADD_DEFENSE_BY_RATIO: return new AddDefenseByRatioCmd(card, cardEffect.value as number);
            case CommandType.ADD_RANDOM_ATTACK: return new AddRandomAttackCmd(card, cardEffect.value as number);
            case CommandType.ADD_ATTACK_BY_COST: return new AddAttackByCostCmd(card, cardEffect.value as number);
            case CommandType.REPLECT_DAMAGE: return new ReflectDamageCmd(character, cardEffect.value as number);
            case CommandType.DEFENSE_IGNORE: return new DefenseIgnoreCmd(character, cardEffect.value as number);
            case CommandType.HP_RECOVERY: return new HpRecoveryCmd(character, cardEffect.value as number);
            case CommandType.INSTANCE_DEATH: return new InstanceDeathCmd(character, cardEffect.value as number);
            case CommandType.ADD_COST_MAX: return new AddMaxCostCmd(character, cardEffect.value as number);
            case CommandType.ADD_BUFF: return new AddBuffCmd(character, cardEffect.value as Buff);
            default: return new NoCommand();
        }
    }

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
    private readonly _opponents: Phaser.GameObjects.Group;

    /** 타겟 포인터 객체 */
    get targetPointer() {return this._targetPointer};
    private readonly _targetPointer: TargetPointer;

    /**
     * 배틀 매니저 객체를 생성합니다.
     * 
     * @param scene 씬 객체
     */
    constructor(public readonly scene: Scene)
    {
        /** 의존성 객체들을 생성하여 주입합니다. */
        this._battleNotification = new BattleNotification(this);
        this._cardManager = new CardManager(this);
        this._stateManager = new StateManager(this);
        this._plyerCharacter = new BattleCharacter(this, 0, 0, scene.game.player!.champion);
        this._opponents = this.scene.add.group();
        this._targetPointer = new TargetPointer(this);
    }

    addMonster(): this
    {
        this._opponents.add(
            this.scene.add.existing(
                new BattleCharacter(this, this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, this.scene.game.player!.champion, "middle_boss")
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
                this.addCard(this._plyerCharacter);

                await this.waitForSeconds(CardManager.TWEEN_SPEED / 1000);

                this._stateManager.state = BattleState.NORMAL;
            }
        }).on('keydown-Q', async () => {
            if(!this.stateManager.isLoading) this.stateManager.nextTurn();
        }).on('keydown-ONE',  () => this.battleClear());

        // 배틀이 시작함을 알립니다.
        this.battleNotification
            .startNotification(this.scene.tweens.createTimeline())
            .on("complete", () => {
                
                // 배틀시작 알림이 종료되면 턴넘김 버튼이 생성되어 나타납니다.
                this.scene.add.tween({
                    targets: new NextButton(this),
                    x: this.scene.cameras.main.width - 100,
                    duration: 300
                });

                // 다음턴이 시작됩니다.
                this.stateManager.nextTurn();
            })
            .play();
    }

    /**
     * 플레이어 턴이 시작되면 지정된 수만큼 카드를 뽑습니다.
     */
    async playerTurn(): Promise<void>
    {
        // 카드를 원래 포지션으로 되돌립니다.
        this.cardManager.resetPosition();

        this.scene.events.emit("plyerTurnCmd");

        // 알림창 뛰웁니다.
        this.battleNotification
            .turnNotification(this.scene.tweens.createTimeline())
            .play();

        // 카드를 분배받습니다.
        for(let i = 0; i < CardManager.INIT_CARD_COUNT; i++) await this.addCard(this._plyerCharacter);

    }

    /**
     * 상대방의 턴을 시작합니다.
     */
    async opponentTurn(): Promise<void>
    {
        // 카드를 원래 포지션으로 되돌립니다.
        this.cardManager.resetPosition();

        this.scene.events.emit("opponentTurnCmd");

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
     * 랜덤으로 카드를 한 장 추가합니다.
     */
    async addCard(battleCharacter: BattleCharacter): Promise<void>
    {
        this.stateManager.state = BattleState.LOADING;

        this.targetPointer.clear();

        this.cardManager
            .shuffle()
            .addCard(battleCharacter, this.cardManager.remainCards.pop())
            .arangeCard();
        
        await this.waitForSeconds(CardManager.TWEEN_SPEED / 1000);
    }

    /**
     * 배틀에서 승리한 경우 플레이어의 현재 노드의 clear 상태를 true로 전환합니다.
     */
    battleClear(): void { 
        this.scene.game.player!.currentNode!.isClear = true;
        this.goToMap();
    }

    /**
     * 맵씬으로 이동합니다.
     */
    private goToMap(): void
    {
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
    private _remainCards: Array<string> = [];

    /** 사용된 카드 목록 */
    get usedCards() { return this._usedCards }
    private _usedCards: Array<string> = [];

    /**
     * 카드 관리 컨테이너를 생성합니다.
     * 
     * @param battleManager 배틀 매니저
     */
    constructor(private readonly battleManager: BattleManager)
    {
        super(battleManager.scene, 0, 0);

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
     * @param battleCharacter 카드를 소유할 캐릭터 객체
     * @param cardName 카드 이름
     * @returns 카드 관리 컨테이너
     */
    addCard(battleCharacter: BattleCharacter, cardName?: string): this 
    {
        return cardName ? this.add(new Card(this.battleManager, battleCharacter, cardName, true)) : this;
    }

    /**
     * 남은 카드를 섞습니다.
     * 
     * @returns 카드 관리 컨테이너
     */
    shuffle(): this 
    {
        if(!this.remainCards.length) this.remainCards.push(...this.usedCards.splice(0));
        this._remainCards = Phaser.Utils.Array.Shuffle(this.remainCards);
        
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
        this._usedCards.push(card.name);
        this.scene.add.tween({
            targets: card,
            y: this.scene.game.canvas.height - this.y - Card.WIDTH * 0.25 - 8,
            x: this.scene.game.canvas.width - this.x - Card.WIDTH * 0.25 + 8,
            angle: 0,
            duration: CardManager.TWEEN_SPEED,
            scale: 0,
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

    /** 로딩 상태 */
    get isLoading() {return this._state === BattleState.LOADING}

    /** 드래그 상태 */
    get isDraging() {return this._state === BattleState.DRAG}

    /** 플레이어 턴 여부 */
    get playerTurn() {return this._playerTurn}

    /** 현재 턴 */
    get currentTurn() {return this._currentTurn}

    /** 카드존 */
    get cardZone() {return this._cardZone};
    private readonly _cardZone: Phaser.GameObjects.Zone;

    /** 카드제출존 */
    get submitZone() {return this._submitZone};
    private readonly _submitZone: Phaser.GameObjects.Zone;

    constructor(
        private readonly battleManager: BattleManager,
        private _state: BattleState = BattleState.LOADING,
        private _playerTurn: boolean = false,
        private _currentTurn: number = 0
    ) {
        /** 카드존을 생성하여 드래그 가능하도록 설정 */
        battleManager.scene.input.setDraggable(
            this._cardZone = battleManager.scene.add
            .zone(battleManager.cardManager.x, battleManager.cardManager.y, battleManager.cardManager.width, battleManager.cardManager.height)
            .setRectangleDropZone(battleManager.cardManager.width, battleManager.cardManager.height).setOrigin(0, 0.5)
        );

        /** 카드제출존을 생성하여 드래그 가능하도록 설정 */
        battleManager.scene.input.setDraggable(
            this._submitZone = battleManager.scene.add
            .zone(
                0, TopMenu.HEIGHT, 
                battleManager.scene.game.canvas.width, 
                battleManager.scene.game.canvas.height - TopMenu.HEIGHT - battleManager.cardManager.height
            ).setRectangleDropZone(
                battleManager.scene.game.canvas.width, 
                battleManager.scene.game.canvas.height - TopMenu.HEIGHT - battleManager.cardManager.height
            ).setOrigin(0)
        );

        // var graphics = battleManager.scene.add.graphics();
        // graphics.lineStyle(2, 0xffff00);
        // graphics.strokeRect(this._cardZone.x, this._cardZone.y - this._cardZone.input.hitArea.height / 2 , this._cardZone.input.hitArea.width, this._cardZone.input.hitArea.height);
        // graphics.strokeRect(this._submitZone.x, this._submitZone.y , this._submitZone.input.hitArea.width, this._submitZone.input.hitArea.height);
    
    }

    async nextTurn(): Promise<void> {
        
        // 카드 상호작용을 하지 못하도록 로딩상태로 설정합니다.
        this._state = BattleState.LOADING;

        if (this._playerTurn = !this._playerTurn) 
        {
            this.battleManager.plyerCharacter.emit("nextTurn");
            this.battleManager.plyerCharacter.cost = this.battleManager.plyerCharacter.maxCost;
        } 

        else 
        {
            (this.battleManager.opponents.getChildren() as BattleCharacter[]).forEach(opponent => {
                opponent.emit("nextTurn");
                opponent.cost = opponent.maxCost;
            });
        }

        // 턴 상태를 토글하고, 턴 상태에 따른 메소드를 호출합니다.
        this._playerTurn
            ? ++this._currentTurn && await this.battleManager.playerTurn() 
            : await this.battleManager.opponentTurn();

        // 0.3초 대기합니다.
        await this.battleManager.waitForSeconds(0.3);


        // 카드와 상호작용 할 수 있도록 노말상태로 설정합니다.
        this._state = BattleState.NORMAL;
    }
}

/**
 * 커맨드 인터페이스
 * 
 * 카드효과 커맨드의 인터페이스 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
interface Command {
    excute(): void;
}

/**
 * 배틀카드 리시버 인터페이스
 * 
 * 배틀카드 커맨드를 수신하는 리시버 인터페이스 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
export interface IBattleCardReceiver {

    /**
     * 공격력 추가
     * @param value 공격력 추가값 
     */
    addAttack(value: number): void;

    /**
     * 방어력 추가
     * @param value 방어력 추가값 
     */
    addDefense(value: number): void;

    /**
     * 공격력 비례 추가
     * @param value 공격력 추가 비례값
     */
    addAttackByRatio(value: number): void;

    /**
     * 방어력 비례 추가
     * @param value 방어력 추가 비례값
     */
    addDefenseByRatio(value: number): void;

    /**
     * 공격력 랜덤 추가
     * @param value 랜덤 범위값
     */
    addRandomAttack(value: number): void;

    /**
     * 공격력이 코스트에 비례하여 추가
     * @param value 코스트 비례값
     */
    addAttackByCost(value: number): void;
}

/**
 * 배틀캐릭터 리시버 인터페이스
 * 
 * 배틀캐릭터 커맨드를 수신하는 리시버 인터페이스 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
export interface IBattleCharacterReceiver {

    /**
     * HP 증가
     * @param value HP 증가값
     */
    increaseHp(value: number): void;

    /**
     * HP 감소
     * @param value HP 감소값
     */
    decreaseHp(value: number): void;

    /**
     * 방어력 증가
     * @param value 방여력 증가값
     */
    increaseDefense(value: number): void;

    /**
     * 방어력 감소
     * @param value 방어력 감소값
     */
    decreaseDefense(value: number): void;
 
    /**
     * 방어력 무시
     * @param value 체력 감소값
     */
    defenseIgnore(value: number): void;

    /**
     * 즉사
     * @param value 체력 감소값
     */
    instanceDeath(value: number): void;
    
    /**
     * 최대 코스트 증가
     * @param value 코스트 증가값
     */
    addMaxCost(value: number): void;

    /**
     * 버프 추가
     * @param buff 버프 리스트
     */
    addBuff(buff: Buff): void;
}

/**
 * 커맨드 없음
 * 
 * 특정 커맨드가 없는 경우 생성되는 기본 커맨드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
class NoCommand implements Command {
    excute(): void {}
}

/**
 * 공격력 추가 커맨드
 * 
 * 카드에 공격력을 추가하는 커맨드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
class AddAttackCmd implements Command {
    
    constructor(
        private readonly battleCard: IBattleCardReceiver,
        private readonly value: number
    ) {}
    
    excute(): void {
        this.battleCard.addAttack(this.value);
    }
}

/**
 * 방어력 추가 커맨드
 * 
 * 카드에 방어력을 추가하는 커맨드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
class AddDefenseCmd implements Command {
    
    constructor(
        private readonly battleCard: IBattleCardReceiver,
        private readonly value: number
    ) {}
    
    excute(): void {
        this.battleCard.addDefense(this.value);
    }
}

/**
 * 공격력 비례 추가 커맨드
 * 
 * 카드에 공격력을 일정 비율로 추가하는 커맨드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
class AddAttackByRatioCmd implements Command {
    
    constructor(
        private readonly battleCard: IBattleCardReceiver,
        private readonly value: number
    ) {}
    
    excute(): void {
        this.battleCard.addAttackByRatio(this.value);
    }
}

/**
 * 방어력 비례 추가 커맨드
 * 
 * 카드에 방어력을 일정 비율로 추가하는 커맨드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
class AddDefenseByRatioCmd implements Command {
    
    constructor(
        private readonly battleCard: IBattleCardReceiver,
        private readonly value: number
    ) {}
    
    excute(): void {
        this.battleCard.addDefenseByRatio(this.value);
    }
}

/**
 * 공격력 랜덤 추가 커맨드
 * 
 * 카드에 공격력을 랜덤으로 추가하는 커맨드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
class AddRandomAttackCmd implements Command {
    
    constructor(
        private readonly battleCard: IBattleCardReceiver,
        private readonly value: number
    ) {}
    
    excute(): void {
        this.battleCard.addRandomAttack(this.value);
    }
}

/**
 * 코스트 비례 공격력 추가 커맨드
 * 
 * 카드에 공격력을 코스트에 비례하여 추가하는 커맨드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
class AddAttackByCostCmd implements Command {
    
    constructor(
        private readonly battleCard: IBattleCardReceiver,
        private readonly value: number
    ) {}
    
    excute(): void {
        this.battleCard.addAttackByCost(this.value);
    }
}

/**
 * 데미지 반사 커맨드
 * 
 * 데미지 반사 효과를 적용하는 커맨드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
class ReflectDamageCmd implements Command {
    
    constructor(
        private readonly battleCharacter: IBattleCharacterReceiver,
        private readonly value: number
    ) {}
    
    excute(): void {
        this.battleCharacter.decreaseHp(this.value);
    }
}

/**
 * 방어력 무시 커맨드
 * 
 * 방어력 무시 효과를 적용하는 커맨드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
class DefenseIgnoreCmd implements Command {
    
    constructor(
        private readonly battleCharacter: IBattleCharacterReceiver,
        private readonly value: number
    ) {}
    
    excute(): void {
        this.battleCharacter.defenseIgnore(this.value);
    }
}

/**
 * 체력 회복 커맨드
 * 
 * 체력회복 효과를 적용하는 커맨드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
class HpRecoveryCmd implements Command {
    
    constructor(
        private readonly battleCharacter: IBattleCharacterReceiver,
        private readonly value: number
    ) {}
    
    excute(): void {
        this.battleCharacter.increaseHp(this.value);
    }
}

/**
 * 즉사 커맨드
 * 
 * 즉사 효과를 적용하는 커맨드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
class InstanceDeathCmd implements Command {
    
    constructor(
        private readonly battleCharacter: IBattleCharacterReceiver,
        private readonly value: number
    ) {}
    
    excute(): void {
        this.battleCharacter.instanceDeath(this.value);
    }
}

/**
 * 최대 코스트 증가 커맨드
 * 
 * 최대 코스트를 증가시키는 커맨드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
class AddMaxCostCmd implements Command {
    
    constructor(
        private readonly battleCharacter: IBattleCharacterReceiver,
        private readonly value: number
    ) {}
    
    excute(): void {
        this.battleCharacter.addMaxCost(this.value);
    }
}

/**
 * 버프 추가 커맨드
 * 
 * 버프를 추가하는 커맨드 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-27 오후 10:21
 */
class AddBuffCmd implements Command {
    
    constructor(
        private readonly battleCharacter: IBattleCharacterReceiver,
        private readonly buff: Buff
    ) {}
    
    excute(): void {
        this.battleCharacter.addBuff(this.buff);
    }
}