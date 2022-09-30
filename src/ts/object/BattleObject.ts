import { Vector } from "matter";
import BattleManager, { IBattleCardReceiver, CardManager, StateManager, IBattleCharacterReceiver } from "../interface/BattleManager";
import { BattleState, Buff, CardEffect, CommandType, CardType, Champion, Scene } from "../interface/Hex";
import BattleScene from "../scene/BattleScene";
import Card from "./Card";

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
    static readonly HEIGHT: number = 120;

    /** 알림 토스트 컨테이너 depth */
    static readonly DEPTH: number = 2;
    
    /** 알림 토스트 배경색 */
    static readonly COLOR: number = 0x000000;

    /** 알림 토스트 배경 이미지 */
    private readonly background: Phaser.GameObjects.Rectangle;

    /** 알림 토스트 검(sword) 이미지 */
    private readonly swordImage: Phaser.GameObjects.Image;

    /** 알림 토스트 텍스트 박스 */
    private readonly textBox: Phaser.GameObjects.Text;

    /** 알림 토스트 턴(turn) 텍스트 박스 */
    private readonly turnText: Phaser.GameObjects.Text;

    /**
     * 알림 컨테이너를 생성합니다.
     * 
     * @param battleManager 배틀 매니저
     */
    constructor(readonly battleManager: BattleManager) {

        super(battleManager.scene, 0, battleManager.scene.game.canvas.height/2);
        
        // 씬을 주입합니다.
        this.scene = battleManager.scene;

        // 배경을 주입합니다.
        this.background = battleManager.scene.add.rectangle(battleManager.scene.game.canvas.width/2, 0, battleManager.scene.game.canvas.width, 0, BattleNotification.COLOR, 0.3);

        // 텍스트 박스를 주입합니다.
        this.textBox = battleManager.scene.add.text(0, 0, "", {
            fontFamily: "neodgm",
            fontSize: "60px",
            color: "gold",
            stroke: "black",
            align: "center",
            strokeThickness: 10,
        }).setOrigin(0.5).setShadow(2, 2, "black", 2, true, true).setVisible(false);

        // 턴(turn) 텍스트 박스를 주입합니다.
        this.turnText = battleManager.scene.add.text(0, 0, "", {
            fontFamily: "neodgm",
            fontSize: "25px",
            color: "snow",
            stroke: "black",
            align: "center",
            strokeThickness: 2,
        }).setOrigin(0.5, 0).setShadow(2, 2, "black", 2, true, true).setData("turn", 1).setVisible(false);

        // 검(sword) 이미지를 주입합니다.
        this.swordImage = battleManager.scene.add.container().scene.add.image(0, 0, BattleScene.KEY.IMAGE.SWORD).setOrigin(1, 0.5).setScale(3.5).setVisible(false);

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

        const isPlayerTurn: boolean = this.battleManager.stateManager.playerTurn;
        const currentTurn: number = this.battleManager.stateManager.currentTurn;
        
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

interface IBattleCharacter {
    hp: number;
    maxHp: number;
    defense: number;
    cost: number
    maxCost: number;
    buff: Buff;
}

/**
 * 배틀 캐릭터
 * 
 * 배틀 캐릭터와 배틀 캐릭터 리시버 인터페이스를 구현한 배틀 캐릭터 클래스 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-19 오전 9:06
 */
export class BattleCharacter extends Phaser.GameObjects.Container implements IBattleCharacter, IBattleCharacterReceiver {

    /** 캐릭터 체력 */
    get hp() {return this._hp}
    private _hp: number;

    /** 캐릭터 최대 체력 */
    get maxHp() {return this._maxHp}
    private _maxHp: number;

    /** 캐릭터 방어력 */
    get defense() {return this._defense}
    private _defense: number;

    /** 현재 코스트 */
    get cost() {return this._cost}
    set cost(cost: number) {this._cost = cost}
    private _cost: number;

    /** 최대 코스트 */
    get maxCost() {return this._maxCost}
    private _maxCost: number;

    /** 버프 리스트 */
    get buff() {return this._buff}
    private readonly _buff: Buff;

    /** 스킬 리스트 */
    get animArray() {return this._animArr}
    private readonly _animArr: Array<string>;

    /** 스프라이트 객체 */
    get sprite() {return this._sprite}
    private readonly _sprite: Phaser.GameObjects.Sprite;
    
    /** 
     * 캐릭터 매니저 객체를 생성합니다.
     * 
     * @param battleManager 배틀 매니저
     * @param x x축 좌표
     * @param y y축 좌표
     * @param champion 챔피언 인터페이스
     * @param name 스프라이트 키값
     */
    constructor(
        private readonly battleManager: BattleManager, x: number, y: number, champion: Champion, name: string = ""
    ){
        super(battleManager.scene, x, y);

        // 원본 캐릭터 데이터로부터 값을 복사합니다.
        this._hp = champion.hp
        this._maxHp = champion.hp
        this._defense = champion.defense
        this._cost = champion.cost
        this._maxCost = champion.cost
        
        // 버프 리스트를 초기화합니다.
        this._buff = new Array<CardEffect>;

        // 스프라이트를 생성합니다.
        this._sprite = new BattleCharacterSprite(battleManager.scene, 0, 0, name);

        // 애니메이션의 키값 리스트를 초기화합니다.
        this._animArr = this._sprite.anims.animationManager["anims"].keys();

        // 체력바를 생성합니다.
        const healthBar = new HealthBar(this);
        
        // 체력 텍스트를 생성하고 씬에 업데이트 이벤트를 추가합니다.
        const healthBarText = this.scene.add.text(this._sprite.getBottomCenter().x, this._sprite.getBottomLeft().y + 10, `${this.hp}/${this.maxHp}`, {
            fontFamily: 'neodgm',
            color: "white",
            stroke: "orangered",
            align: "center",
            strokeThickness: 3
        }).setOrigin(0.5, 0).setShadow(2, 2, "black", 2, true, true);

        // 체력을 지속적으로 업데이트 합니다.
        this.scene.events.on("update", async () => {
            if(this._hp < 0) this._hp = 0;
            healthBarText.setText(`${this._hp}/${this._maxHp}`);
            if(!this._hp) {
                await this.battleManager.waitForSeconds(0.3);
                this.destroy();
            }
        });

        // 상호작용존을 설정하고 이벤트를 추가합니다.
        let c = 0;
        const zone = new BattleCharacterZone(this, 0, 0, this._sprite.displayWidth, this._sprite.displayHeight)
            .setRectangleDropZone(this._sprite.displayWidth, this._sprite.displayHeight)
            .setInteractive()
            .on('pointerdown', () => {
                if(!this._sprite) return;
                if(++c === this._animArr.length) c = 0;
                this._sprite.play(this._animArr[c]);
            });

        /** 컨테이너에 스프라이트, 체력바, 체력 텍스트, 상호작용존 추가 */
        this.add([this._sprite, healthBar, healthBarText, zone]);
        
        /** 다음턴 이벤트가 발생하면 버프에서 턴을 하나 감소 */
        this.on("nextTurn", () => {
            const newBuff = this._buff.filter(effect => typeof effect.turn === "number" && --effect.turn > 0);
            this._buff.splice(0);
            this._buff.push(...newBuff);
        })
    }

    addMaxCost(value: number): void {
        this._cost += value;
        this._maxCost += value;
    }
    
    addBuff(buff: Buff): void {
        this._buff.push(...buff);
    }

    increaseDefense(value: number): void {
        this._defense += value;
    }

    decreaseDefense(value: number): void {
        this._defense -= value;
    }
    
    instanceDeath(value: number): void {
        Math.random() <= value ? this._hp = 0 : '';
    }

    increaseHp(value: number): void {
        this._hp += value;
    }

    decreaseHp(value: number): void {
        if(value <= this._defense) {
            this._defense -= value;
        } else {
            value -= this._defense;
            this._defense = 0;
            this._hp -= value;
        }
    }

    defenseIgnore(value: number): void {
        this._hp -= value;
    }

    increaseMaxCost(): void {
        this._maxCost++;
        this._cost++;
    }
}

/**
 * 배틀캐릭터 스프라이트
 * 
 * 배틀캐릭터의 스프라이트 입니다. 씬으로부터 생성하면 destroy시 발생하는 버그로 인해 따로 작성합니다.
 * 
 */
class BattleCharacterSprite extends Phaser.GameObjects.Sprite
{
    constructor(scene: Scene, x: number, y: number, name: string){
        super(scene, x, y, name)
        this.setScale(3).play("idle");
    }
}

/**
 * 배틀캐릭터존
 * 
 * 배틀캐릭터의 상호작용 영역을 설정하기 위한 배틀캐릭터존(Zone) 클래스 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-22 오전 6:00
 */
 export class BattleCharacterZone extends Phaser.GameObjects.Zone 
 {
    /** 배틀캐릭터 객체 */
    get battleCharacter() {return this._battleCharacter}
    
    /**
     * 배틀캐릭터존을 생성합니다.
     * 
     * @param _battleCharacter 배틀캐릭터
     * @param x x좌표
     * @param y y좌표
     * @param width 넓이
     * @param height 높이
     */
    constructor(private readonly _battleCharacter: BattleCharacter, x: number, y: number, width?: number, height?: number) 
    {
        super(_battleCharacter.scene, x, y, width, height);
    }
 }

/**
 * 체력바
 * 
 * 배틀 캐릭터의 체력바 객체입니다.
 * 
 * @author Rubisco
 * @since 2022-09-22 오전 6:00
 */
 class HealthBar extends Phaser.GameObjects.Graphics
 {
    /**
     * 배틀캐릭터의 체력바를 생성합니다.
     * 
     * @param battleCharacter 배틀캐릭터 객체
     * @param width 체력바 넓이
     */
    constructor(
        private readonly battleCharacter: BattleCharacter,
        private readonly width: number = battleCharacter.sprite.displayWidth
    ){
        super(battleCharacter.scene);

        // 체력바 위치를 설정합니다.
        this.setPosition(battleCharacter.sprite.getBottomLeft().x, battleCharacter.sprite.getBottomLeft().y + 10).draw();
        
        // 씬에서 업데이트 이벤트가 발생할때마다 체력바를 새로 그립니다.
        this.scene.events.on("update", ()=>this.draw())
    }

    /** 체력바를 그립니다. */
    private draw(): void
    {
        this.clear();

        const p = this.battleCharacter.hp / this.battleCharacter.maxHp * 100;

        this.fillStyle(0x000000).fillRect(0,  0, this.width, 20)
            .fillStyle(0xffffff).fillRect(2, 2, this.width - 4, 16)
            .fillStyle(p < 30 ? 0xff0000 : 0x00ff00).fillRect(2, 2, (this.width * p / 100 | 0) - 4,  16)
    }
 }

interface ITargetPointer {
    marker: Phaser.GameObjects.Graphics;
    pointer: Phaser.GameObjects.Graphics;
    createLineFromCardToPointer(start: Vector, end: Vector): void;
    createTargetMarker(character: BattleCharacter): void;
    clear(): void;
}

/**
 * 타겟 포인터 객체
 * 
 * 카드를 제출할때 나타나는 타겟 포인터 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-23 오전 6:00
 */
 export class TargetPointer extends Phaser.Curves.CubicBezier implements ITargetPointer
 {

    static readonly DEFAULT_COLOR: [number, number] = [0xa8aaaa, 0x41413f];
    static readonly ATTACK_COLOR: [number, number] = [0xc5373c, 0x822325];
    static readonly ASSISTANT_COLOR: [number, number] = [0x799062, 0x4169e1];

    /** 타겟 포인터 */
    private readonly _pointer: Phaser.GameObjects.Graphics;
    get pointer() {return this._pointer}

    /** 타겟 마커 */
    private readonly _marker: Phaser.GameObjects.Graphics;
    get marker() {return this._marker}

    /** 삼각형 */
    private readonly triangle: Phaser.Geom.Triangle;
    private readonly strokeTriangle: Phaser.Geom.Triangle;

    /** 색상 */
    private _color: [number, number];
    set color(color: [number, number]) {this._color = color}

    /** 
     * 타겟 포인터 객체를 생성합니다
     * 
     * @param battleManager 배틀 매니저
     */
    constructor(private readonly battleManager: BattleManager)
    {
        super(new Phaser.Math.Vector2(), new Phaser.Math.Vector2(), new Phaser.Math.Vector2(), new Phaser.Math.Vector2());
        this.battleManager = battleManager;
        this._pointer = battleManager.scene.add.graphics().setDepth(2);
        this._marker = battleManager.scene.add.graphics().setDepth(2);
        this.triangle = Phaser.Geom.Triangle.BuildEquilateral(0, 0, 30);
        this.strokeTriangle = Phaser.Geom.Triangle.BuildEquilateral(0, 0, 31);
        this._color = TargetPointer.DEFAULT_COLOR;
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
                    .fillStyle(this._color[0], 1)
                    .lineStyle(2, this._color[1], 1)
                    .fillCircle(point.x, point.y, 3)
                    .strokeCircle(point.x, point.y, 4)
                    .fillTriangleShape(this.triangle)
                    .strokeTriangleShape(this.triangle)
        );
    }

    /**
     * 타겟 마커가 그려집니다.
     * 
     * @param character 배틀캐릭터
     */
    createTargetMarker(character: BattleCharacter): void
    { 
        this._marker.clear();

        const points = [
            character.x + character.sprite!.getTopLeft().x + 0,
            character.y + character.sprite!.getTopLeft().y + 0,
            character.x + character.sprite!.getTopRight().x - 0,
            character.y + character.sprite!.getTopRight().y + 0,
            character.x + character.sprite!.getBottomLeft().x + 0,
            character.y + character.sprite!.getBottomLeft().y - 0,
            character.x + character.sprite!.getBottomRight().x - 0,
            character.y + character.sprite!.getBottomRight().y - 0,
        ]

        this._marker.lineStyle(4, TargetPointer.ATTACK_COLOR[0])
            .lineBetween(points[0], points[1], points[0] + 12, points[1])
            .lineBetween(points[0], points[1], points[0], points[1] + 12)
            .lineBetween(points[2] , points[3], points[2] - 12, points[3])
            .lineBetween(points[2] , points[3], points[2], points[3] + 12)
            .lineBetween(points[4], points[5], points[4] + 12, points[5])
            .lineBetween(points[4], points[5], points[4], points[5] - 12)
            .lineBetween(points[6] , points[7], points[6] - 12, points[7])
            .lineBetween(points[6] , points[7], points[6], points[7] - 12)
    }

    /**
     * 타겟 마커를 초기화합니다.
     */
    clear(): void {
        this._color = TargetPointer.DEFAULT_COLOR;
        this._marker.clear();
        this._pointer.clear();
    }

    /**
     * 배틀카드에 타겟 마커를 생성합니다.
     * 
     * @param card 배틀카드 객체
     */
    createCardMarker(card: BattleCard): void
    { 
        this._marker.clear();

        

        const points = [
            card.x + this.battleManager.cardManager.x - Card.WIDTH * CardManager.CARD_SCALE / 2 - 30,
            card.y + this.battleManager.cardManager.y - Card.HEIGHT * CardManager.CARD_SCALE / 2 - 30,
            card.x + this.battleManager.cardManager.x + Card.WIDTH * CardManager.CARD_SCALE / 2 + 30,
            card.y + this.battleManager.cardManager.y - Card.HEIGHT * CardManager.CARD_SCALE / 2 - 30,
            card.x + this.battleManager.cardManager.x - Card.WIDTH * CardManager.CARD_SCALE / 2 - 30,
            card.y + this.battleManager.cardManager.y + Card.HEIGHT * CardManager.CARD_SCALE / 2 + 30,
            card.x + this.battleManager.cardManager.x + Card.WIDTH * CardManager.CARD_SCALE / 2 + 30,
            card.y + this.battleManager.cardManager.y + Card.HEIGHT * CardManager.CARD_SCALE / 2 +30,
        ]

        this._marker.lineStyle(4, TargetPointer.ASSISTANT_COLOR[card.originData?.type === CardType.ASSISTANCE ? 0 : 1])
            .lineBetween(points[0], points[1], points[0] + 12, points[1])
            .lineBetween(points[0], points[1], points[0], points[1] + 12)
            .lineBetween(points[2] , points[3], points[2] - 12, points[3])
            .lineBetween(points[2] , points[3], points[2], points[3] + 12)
            .lineBetween(points[4], points[5], points[4] + 12, points[5])
            .lineBetween(points[4], points[5], points[4], points[5] - 12)
            .lineBetween(points[6] , points[7], points[6] - 12, points[7])
            .lineBetween(points[6] , points[7], points[6], points[7] - 12)
    }
}

/**
 * 배틀카드의 인터페이스입니다.
 */
interface IBattleCard {
    attack: number;
    defense: number;
    cost: number;
}

/**
 * 배틀카드 인터페이스와 배틀카드 리시버 인터페이스를 구현한 배틀카드 입니다.

 * @author Rubisco
 * @since 2022-09-27 오전 6:00
 * @see Card 객체를 상속
 */
export class BattleCard extends Card implements IBattleCard, IBattleCardReceiver
{
    /** 유효 버프 리스트 */
    private static readonly VALID_BUFF = [
        CommandType.ADD_ATTACK,
        CommandType.ADD_DEFENSE,
        CommandType.ADD_ATTACK_BY_RATIO,
        CommandType.ADD_DEFENSE_BY_RATIO,
        CommandType.ADD_RANDOM_ATTACK,
        CommandType.ADD_ATTACK_BY_COST
    ]

    private static readonly ATTACK_BUFF = [
        CommandType.ADD_ATTACK,
        CommandType.ADD_ATTACK_BY_RATIO,
        CommandType.ADD_RANDOM_ATTACK,
        CommandType.ADD_ATTACK_BY_COST
    ]

    private static readonly DEFENSE_BUFF = [
        CommandType.ADD_DEFENSE,
        CommandType.ADD_DEFENSE_BY_RATIO
    ]
    

    /** 공격력 */
    get attack() {return this._attack};
    private _attack: number;

    /** 방어력 */
    get defense() {return this._defense};
    private _defense: number;

    /** 비용 */
    get cost() {return this._cost};
    private _cost: number;
    
    /**
     * 배틀카드를 생성합니다.
     * 
     * @param battleManager 배틀 매니저 객체
     * @param battleCharacter 카드를 소유할 캐릭터 객체
     * @param cardName 카드 이름
     * @param isFront 앞면 여부
     * @param isCardManagerZone 카드가 카드존에 존재하는지에 대한 여부
     * @param stateManager 상태 매니저 객체
     * @param cardManager 카드 매니저 객체
     * @param targetPointer 타겟 포인터 객체
     */
    constructor(
        private readonly battleManager: BattleManager, 
        private readonly battleCharacter: BattleCharacter, 
        cardName?: string, 
        isFront?: boolean,
        private isCardManagerZone: boolean = true,
        private readonly stateManager: StateManager = battleManager.stateManager,
        private readonly cardManager: CardManager = battleManager.cardManager,
        private readonly targetPointer: TargetPointer = battleManager.targetPointer
    ) {
        
        super(battleManager.scene, cardName, isFront);

        this._attack = this.originData ? this.originData.attack : 0;
        this._defense = this.originData ? this.originData.defense : 0;
        this._cost = this.originData ? this.originData.cost : 0;

        //스테이터스를 초기화합니다.
        this.initStat();

        // 카드의 크기와 위치를 지정하고 원본 데이터를 저장합니다.
        // 또한 마우스 이벤트에 연결합니다.
        this.setSize(Card.WIDTH, Card.HEIGHT)
            .setData({
                originIndex: this.cardManager.length,
                originPosition: new Phaser.Math.Vector2(0, 0),
                originAngle: 0
            })
            .setPosition(-this.cardManager.x + Card.WIDTH * 0.25, 0)
            .setData({
                originIndex: this.length,
                originPosition: new Phaser.Math.Vector2(0, 0),
                originAngle: 0
            })
            .setScale(0.2)
            .setInteractive()
            .on("pointerover", this.pointerOver)
            .on("pointerout", this.pointerOut)
            .on("dragstart", this.dragStart)
            .on("dragenter", this.dragEnter)
            .on("drag", this.drag)
            .on("drop", this.drop)
            .on("dragleave", this.dragLeave)
            .on("dragend", this.dragEnd)
        
        // 카드를 드래그 가능하도록 설정합니다.
        battleManager.scene.input.setDraggable(this);
    }

    /**
     * 카드에 포인터를 올리면 카드가 커집니다.
     */
    private pointerOver(): void
    {
        if(this.stateManager.state !== BattleState.NORMAL) return;

        this.cardManager.bringToTop(this);
        this.scene.add.tween({
            targets: this,
            y: (CardManager.CARD_SCALE - 1) * Card.HEIGHT / 2,
            angle: 0,
            duration: 100,
            scale: 1,
            ease: 'Quad.easeInOut'
        });
    }

    /**
     * 카드에서 포인터가 벗어나면 원래 상태로 돌아갑니다.
     */
    private pointerOut(): void 
    {   
        if(this.stateManager.state !== BattleState.NORMAL) return;

        this.cardManager.moveTo(this, this.getData("originIndex"));
        this.scene.add.tween({
            targets: this,
            x: this.getData("originPosition").x,
            y: this.getData("originPosition").y,
            angle: this.getData("originAngle"),
            duration: 100,
            scale: CardManager.CARD_SCALE,
            ease: 'Quad.easeInOut'
        });
    }

    /**
     * 카드의 드래그를 시작합니다.
     */
    private dragStart(): void
    {
        if(this.stateManager.isLoading) return;

        this.stateManager.state = BattleState.DRAG;
        
        this.cardManager.bringToTop(this);
        this.scene.add.tween({
            targets: this,
            x: this.getData("originPosition").x,
            y: -CardManager.CARD_SCALE * Card.HEIGHT * 0.2,
            angle: 0,
            duration: 100,
            scale: CardManager.CARD_SCALE * 1.2,
            ease: 'Quad.easeInOut'
        });
    }

    /**
     * 카드가 드래그되면 타켓 포인터가 생깁니다.
     * @param pointer 포인터 좌표
     */
    private drag(pointer: Phaser.Input.Pointer): void
    {
        // 턴이 로딩중이면 리턴
        if(this.stateManager.state !== BattleState.DRAG) return;
        if(this.isCardManagerZone) return;

        // 공격카드의 경우 선택된 카드가 있으면 타겟 포인터 생성
        if (this.originData?.type === CardType.ATTACK) {
            this.targetPointer.createLineFromCardToPointer(this, pointer);
        }
        else {
            this.setPosition(pointer.x - this.cardManager.x, pointer.y - this.cardManager.y);
            this.targetPointer.createCardMarker(this);
        }
    }

    /**
     * 카드가 드랍존에 들어가면 타겟 마커가 생깁니다.
     * 
     * @param zone 드랍존
     */
    private dragEnter(_pointer: Phaser.Input.Pointer, zone: Phaser.GameObjects.Zone): void
    {
        if(zone === this.stateManager.cardZone)
        {
            this.isCardManagerZone = true;

            this.dragStart();

            this.targetPointer.color = TargetPointer.DEFAULT_COLOR;

            this.targetPointer.pointer.clear();
            this.targetPointer.marker.clear();
        }

        if(!(zone instanceof BattleCharacterZone)) return;
        
        if(this.originData?.type === CardType.ATTACK)
        {
            this.targetPointer.color = TargetPointer.ATTACK_COLOR;
            this.targetPointer.createTargetMarker(zone.battleCharacter);
        }
    }

    /**
     * 카드가 드랍존에서 벗어나면 이벤트가 발생합니다.
     * 
     * @param zone 드랍존
     */
    private dragLeave(_pointer?: Phaser.Input.Pointer, zone?: Phaser.GameObjects.Zone): void
    {   
        this.targetPointer.color = TargetPointer.DEFAULT_COLOR;

        if(zone === this.stateManager.cardZone) {
            this.isCardManagerZone = false;
        } else this.targetPointer.marker.clear();
    }

    /**
     * 카드가 드랍되면 이벤트가 발생합니다.
     * 
     * @param zone 캐릭터 상호작용존
     */
    private drop(_pointer: Phaser.Input.Pointer, zone: Phaser.GameObjects.Zone): void
    {
        // 카드가 제출존이 아닌 곳에 제출되면 리턴
        if(zone !== this.stateManager.submitZone && !(zone instanceof BattleCharacterZone)) return;
        
        // 카드의 원본 데이터가 없으면 리턴
        if(!this.originData) return;

        // 현재 코스트가 카드 코스트보다 작으면 리턴
        if(this.battleCharacter.cost < this._cost) return;

        // 보조카드의 경우 버프추가 커맨드를 생성하여 실행
        if(this.originData.type === CardType.ASSISTANCE) {

            BattleManager.CardEffectCommandFactory(this, this.battleCharacter, {
                type: CommandType.ADD_BUFF,
                value: this.originData.command.filter(effect => BattleCard.VALID_BUFF.includes(effect.type)), 
                turn: 1
            }).excute();

            const addCostMax = this.originData.command.filter(effect => effect.type === CommandType.ADD_COST_MAX);

            if(addCostMax.length) {
                BattleManager.CardEffectCommandFactory(this, this.battleCharacter, {
                    type: CommandType.ADD_COST_MAX,
                    value: addCostMax[0].value, 
                    turn: 1
                }).excute();
            }
        }

        // 방어카드의 경우 방어력 증가
        else if(this.originData.type === CardType.DEFENSE) {
            this.battleCharacter.increaseDefense(this._defense);
        }
        
        // 공격카드의 경우 공격력만큼 상대 캐릭터의 체력을 감소시킴
        else if(
            zone instanceof BattleCharacterZone && 
            zone.battleCharacter !== this.battleManager.plyerCharacter && 
            this.originData?.type === CardType.ATTACK
        ) {
            // 즉사, 방어무시 커맨드 메시지 확인
            const instanceDeath = this.originData.command.filter(effect => effect.type === CommandType.INSTANCE_DEATH)
            const defenseIgnore = this.originData.command.filter(effect => effect.type === CommandType.DEFENSE_IGNORE)

            // 카드가 즉사 커맨드 메시지를 가진 경우
            if(instanceDeath.length)
            {
                // 즉사 커맨드를 생성하여 실행
                BattleManager.CardEffectCommandFactory(this, zone.battleCharacter, {
                    type: CommandType.INSTANCE_DEATH,
                    value: instanceDeath[0].value,
                    turn: 1
                }).excute();
            } 
            
            // 카드가 방어무시 커맨드 메시지를 가진 경우
            if(defenseIgnore.length && zone.battleCharacter.hp)
            {
                // 방어무시 커맨드를 생성하여 실행
                BattleManager.CardEffectCommandFactory(this, zone.battleCharacter, {
                    type: CommandType.DEFENSE_IGNORE,
                    value: this._attack,
                    turn: 1
                }).excute();
            }
            
            // 공격력만큼 상대 캐릭터의 체력을 감소시킴
            if(!defenseIgnore.length && zone.battleCharacter.hp) zone.battleCharacter.decreaseHp(this._attack);

        } else return;

        // 커맨드 메시지에서 버프 목록 확인
        const buff = this.originData.command.filter(effect => effect.type === CommandType.ADD_BUFF) as Buff;
        
        // 버프가 있는 경우
        if(buff.length)
        {
            // 버프추가 커맨드를 생성하여 실행
            BattleManager.CardEffectCommandFactory(this, this.battleCharacter, {
                type: CommandType.ADD_BUFF,
                value: buff.filter(effect => BattleCard.VALID_BUFF.includes(effect.type) || effect.type === CommandType.REPLECT_DAMAGE), 
                turn: 1
            }).excute();
        }

        // 코스트 감소
        this.battleCharacter.cost -=  this._cost < 0 ? this.battleCharacter.cost : this._cost;
        
        this.setPosition(this.x + this.cardManager.x, this.y + this.cardManager.y);
        this.cardManager.remove(this);

        // 카드를 카드 매니저 컨테이너에서 제거후 정렬
        this.cardManager.remove(this.setVisible(false)).arangeCard();

        // 각 카드의 스테이터스 갱신
        this.cardManager.getAll().forEach(card => (card as BattleCard).initStat())

        // 타켓 포인터 초기화
        this.clear();

        // 묘지덱에 카드 이름 추가
        this.cardManager.usedCards.push(this.name);

        // 카드 제거
        this.destroy();
        
    }

    /**
     * 카드의 드래그 상태가 끝나면 타겟 포인터가 사라집니다.
     */
    private dragEnd(): void
    {
        this.isCardManagerZone = true;
        this.clear();
        this.pointerOut();
    }

    /**
     * 카드의 스테이터스를 초기화 합니다.
     */
    private initStat(): void
    {
        this._attack = this.originData ? this.originData.attack : 0;
        this._defense = this.originData ? this.originData.defense : 0;

        // 캐릭터의 코스트가 카드 코스트보다 작으면 색상 변경
        if(this.battleCharacter.cost < this._cost) (this.getAt(4) as Phaser.GameObjects.Text)?.setColor("#c5373c").setStroke("#822325", 5);

        // 카드 기본 속성 적용
        if(this.originData?.type !== CardType.ASSISTANCE) {
            this.originData?.command
                .filter(effect => BattleCard.VALID_BUFF.includes(effect.type))
                .forEach(effect => BattleManager.CardEffectCommandFactory(this, this.battleCharacter, effect).excute())
        }

        // 카드에 버프 적용
        this.battleCharacter.buff
            .filter(effect => BattleCard.VALID_BUFF.includes(effect.type))
            .forEach(effect => {
                if(this.originData) {
                    if(
                        BattleCard.ATTACK_BUFF.includes(effect.type) && this.originData.type === CardType.ATTACK ||
                        BattleCard.DEFENSE_BUFF.includes(effect.type) && this.originData.type === CardType.DEFENSE
                    ) BattleManager.CardEffectCommandFactory(this, this.battleCharacter, effect).excute();
                    (this.getAt(9) as Phaser.GameObjects.Text).setColor(this._attack > this.originData.attack ? "#00ff00" : "#f4efe8");
                    (this.getAt(11) as Phaser.GameObjects.Text).setColor(this._defense > this.originData.defense ? "#00ff00" : "#f4efe8");
                }
            })

        // 최종 스테이터스 반영
        if(this.originData) { 
            (this.getAt(9) as Phaser.GameObjects.Text).setText(this._attack.toString());
            (this.getAt(11) as Phaser.GameObjects.Text).setText(this._defense.toString());
            this.emit("statAlign");
        }
    }

    /**
     * 타겟 포인터를 초기화 합니다.
     */
    private clear(): void {
        this.stateManager.state = BattleState.NORMAL;
        this.targetPointer.color = TargetPointer.DEFAULT_COLOR;

        this.targetPointer.marker.clear();
        this.targetPointer.pointer.clear();
    }

    addAttack(value: number): void {
        this._attack += value;
    }

    addDefense(value: number): void {
        this._defense += value;
    }

    addAttackByRatio(value: number): void {
        this._attack *= value;
    }

    addDefenseByRatio(value: number): void {
        this._defense *= value;
    }

    addRandomAttack(value: number): void {
        this._attack *= ((Math.random() * value)|0 + 1);
    }

    addAttackByCost(value: number): void {
        this._attack += value * this.battleCharacter.cost;
    }
}

/**
 * 턴(turn) 전환 버튼
 * 
 * 턴을 전환하기 위한 버튼 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-30 오후 6:00
 */
export class NextButton extends Phaser.GameObjects.Container {

    private static COLOR = [0x6666ff, 0xcccccc, 0xffd700, 0xdddddd];

    private background: Phaser.GameObjects.Polygon;
    private text: Phaser.GameObjects.Text;

    constructor(battleManager: BattleManager) {

        super(battleManager.scene, battleManager.scene.cameras.main.width + 100, battleManager.stateManager.submitZone.getBottomRight().y - 40);
        
        this.background = battleManager.scene.add.polygon(0, 0, [ 0,20, 20,0, 80,0, 100,20, 80,40, 20,40, 0,20 ], NextButton.COLOR[0]).setStrokeStyle(4, NextButton.COLOR[1]);
        
        this.text = battleManager.scene.add.text(0, 0, "턴 종료", {
            fontFamily: 'neodgm',
            color: "white",
            stroke: "black",
            align: "center",
            strokeThickness: 2
        })
        .setOrigin(0.5)
        .setShadow(1, 1, "black", 1, true, true)

        this.add([this.background, this.text])
            .setSize(100, 40)
            .setScale(1.3)
            .setInteractive()
            .on("pointerover", () => {
                if(battleManager.stateManager.isLoading) return;
                this.setScale(1.5); 
                this.text.setColor("gold");
                this.background.setStrokeStyle(4, NextButton.COLOR[2])
            })
            .on("pointerout", () => {
                this.setScale(1.3);
                this.text.setColor("white");
                this.background.setStrokeStyle(4, NextButton.COLOR[1])
            })
            .on("pointerup", () => {
                if(battleManager.stateManager.isLoading) return;
                battleManager.stateManager.nextTurn();
            })

        battleManager.scene.events
            .on("plyerTurnCmd", ()=>this.setPlayerTurn())
            .on("opponentTurnCmd", ()=>this.setOpponentTurn());

        battleManager.scene.add.existing(this);
    }

    private setText(text: string): this
    {
        this.text.setText(text);

        return this;
    }

    private setBackground(colors: [number, number]): this
    {
        this.background.setFillStyle(colors[0]);
        this.background.setStrokeStyle(4, colors[1]);

        return this;
    }

    setOpponentTurn(): void
    {
        this.removeInteractive()
            .setScale(1.3)
            .setText("적 턴")
            .setBackground([NextButton.COLOR[3], NextButton.COLOR[1]]);
        
        this.text.setColor("white");
    }

    setPlayerTurn(): void
    {
        this.setInteractive()
            .setScale(1.3)
            .setText("턴 종료")
            .setBackground([NextButton.COLOR[0], NextButton.COLOR[1]]);
            
        this.text.setColor("white");
    }
}