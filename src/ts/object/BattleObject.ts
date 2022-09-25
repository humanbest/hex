import { Vector } from "matter";
import BattleManager, { CardManager, StateManager } from "../interface/BattleManager";
import { BattleState, Buff, CardType, Champion, Scene } from "../interface/Hex";
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

/**
 * 배틀 캐릭터 객체
 * 
 * 배틀을 위해 챔피언 캐릭터의 인터페이스를 구현한 클래스 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-19 오전 9:06
 */
export class BattleCharacter extends Phaser.GameObjects.Container implements Champion {

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
    private readonly _buffArr: Array<Buff>;

    /** 스킬 리스트 */
    get animArr() {return this._animArr}
    private readonly _animArr: Array<string>;

    /** 캐릭터 원본 객체 */
    get originData() {return this._originData};
    private readonly _originData: Champion;

    /** 스프라이트 객체 */
    get sprite() {return this._sprite}
    private readonly _sprite: Phaser.GameObjects.Sprite;
    
    /** 배틀 매니저 객체 */
    get battleManager() {return this._battleManager}
    private readonly _battleManager: BattleManager;

    /** 
     * 캐릭터 매니저 객체를 생성합니다.
     * 
     * @param battleManager 배틀 매니저
     * @param x x축 좌표
     * @param y y축 좌표
     * @param champion 챔피언 인터페이스
     * @param name 스프라이트 키값
     */
    constructor(battleManager: BattleManager, x: number, y: number, champion: Champion, name: string = "") {

        super(battleManager.scene, x, y);

        // 배틀 매니저 객체를 주입합니다.
        this._battleManager = battleManager;

        // 원본 캐릭터 데이터로부터 값을 복사합니다.
        this._hp = champion.hp
        this._maxHp = champion.hp
        this._defense = champion.defense
        this._cost = champion.cost
        
        // 버프 리스트를 초기화합니다.
        this._buffArr = new Array<Buff>;

        // 원본 캐릭터 데이터를 주입합니다.
        this._originData = champion;

        // 스프라이트를 생성합니다.
        this._sprite = battleManager.scene.add.sprite(0, 0, name).setScale(3).play("idle");

        // 애니메이션의 키값 리스트를 초기화합니다.
        this._animArr = this._sprite.anims.animationManager["anims"].keys();

        // 체력바를 생성합니다.
        const healthBar = new HeathBar(this);
        
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
            if(this.hp < 0) this.hp = 0;
            healthBarText.setText(`${this.hp}/${this.maxHp}`);
            if(!this.hp) {
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
    addBuff(buff: Buff): void { this.buffArr.push(buff) }
}

/**
 * 배틀캐릭터존
 * 
 * 배틀캐릭터의 상호작용 영역을 설정하기 위한 존(Zone) 객체입니다.
 * 
 * @author Rubisco
 * @since 2022-09-22 오전 6:00
 */
 export class BattleCharacterZone extends Phaser.GameObjects.Zone {
    
    /** 배틀캐릭터 객체 */
    get battleCharacter() {return this._battleCharacter}
    private readonly _battleCharacter: BattleCharacter;

    /**
     * 배틀캐릭터존을 생성합니다.
     * 
     * @param battleCharacter 배틀캐릭터
     * @param x x좌표
     * @param y y좌표
     * @param width 넓이
     * @param height 높이
     */
    constructor(battleCharacter: BattleCharacter, x: number, y: number, width?: number, height?: number) {
        super(battleCharacter.scene, x, y, width, height);
        this._battleCharacter = battleCharacter;
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
 class HeathBar extends Phaser.GameObjects.Graphics
 {
    /** 배틀캐릭터 객체 */
    private readonly battleCharacter: BattleCharacter;
    
    /** 스프라이트 객체 */
    private readonly sprite: Phaser.GameObjects.Sprite;

    /** 체력바 넓이 */
    private readonly width: number;

    /**
     * 체력바를 생성합니다.
     * 
     * @param battleCharacter 배틀캐릭터 객체
     */
    constructor(battleCharacter: BattleCharacter)
    {
        super(battleCharacter.scene);

        this.battleCharacter = battleCharacter;
        this.sprite = battleCharacter.sprite;
        this.width = this.sprite.displayWidth;

        this.setPosition(this.sprite.getBottomLeft().x, this.sprite.getBottomLeft().y + 10).draw();

        this.scene.events.on("update", ()=>this.draw())
    }

    draw(): void
    {
        this.clear();

        const p = this.battleCharacter.hp / this.battleCharacter.maxHp * 100;

        this.fillStyle(0x000000).fillRect(0,  0, this.width, 20)
            .fillStyle(0xffffff).fillRect(2, 2, this.width - 4, 16)
            .fillStyle(p < 30 ? 0xff0000 : 0x00ff00).fillRect(2, 2, (this.width * p / 100 | 0) - 4,  16)
    }
 }

 /**
 * 타겟 포인터 객체
 * 
 * 카드를 제출할때 나타나는 타겟 포인터 입니다.
 * 
 * @author Rubisco
 * @since 2022-09-23 오전 6:00
 */
 export class TargetPointer extends Phaser.Curves.CubicBezier 
 {

    static readonly DEFAULT_COLOR: [number, number] = [0xa8aaaa, 0x41413f];
    static readonly ATTACK_COLOR: [number, number] = [0xc5373c, 0x822325];

    /** 배틀 매니저 객체 */
    private readonly battleManager: BattleManager;

    /** 포인터 */
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
    constructor(battleManager: BattleManager)
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
    createTargetMarker(character: BattleCharacter)
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
}

interface IBattleCard {
    attack: number;
    defense: number;
}

export class BattleCard extends Card implements IBattleCard
{
    private readonly stateManager: StateManager;
    private readonly cardManager: CardManager;
    private readonly targetPointer: TargetPointer;

    get attack() {return this._attack};
    private _attack: number;

    get defense() {return this._defense};
    private _defense: number;

    get buff() {return this._buff};
    private _buff: Array<Buff>;
    
    constructor(battleManager: BattleManager, cardName?: string, isFront?: boolean) {
        
        super(battleManager.scene, cardName, isFront);

        this.stateManager = battleManager.stateManager;
        this.cardManager = battleManager.cardManager;
        this.targetPointer = battleManager.targetPointer;

        this._attack = this.originData ? this.originData.attack : 0;
        this._defense = this.originData ? this.originData.defense : 0;
        this._buff = JSON.parse(JSON.stringify(this.originData));

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
            .on("pointerout", this.pointerout)
            .on("dragstart", this.dragstart)
            .on("dragenter", this.dragenter)
            .on("drag", this.drag)
            .on("drop", this.drop)
            .on("dragleave", this.dragleave)
            .on("dragend", this.dragend)

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
    private pointerout(): void 
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
    private dragstart(): void
    {
        this.stateManager.state = BattleState.DRAG;

        this.cardManager.bringToTop(this);
        this.scene.add.tween({
            targets: this,
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
        if(this.stateManager.state !== BattleState.DRAG) return this.targetPointer.clear();

        // 선택된 카드가 있으면 타겟 포인터 생성
        this.targetPointer.createLineFromCardToPointer(this, pointer);
    }

    /**
     * 카드가 드랍존에 들어가면 타겟 마커가 생깁니다.
     * 
     * @param zone 드랍존
     */
    private dragenter(_pointer: Phaser.Input.Pointer, zone: BattleCharacterZone): void
    {
        if(!zone.battleCharacter) return;
        if(this.originData?.type !== CardType.ATTACK) return;

        this.targetPointer.color = TargetPointer.ATTACK_COLOR;
        this.targetPointer.createTargetMarker(zone.battleCharacter);
    }

    /**
     * 카드가 드랍존에서 벗어나면 이벤트가 발생합니다.
     */
    private dragleave(): void
    {
        this.targetPointer.color = TargetPointer.DEFAULT_COLOR;
        this.targetPointer.marker.clear();
    }

    /**
     * 카드가 상호작용존에 드랍되면 이벤트가 발생합니다.
     * 
     * @param zone 캐릭터 상호작용존
     * @returns 
     */
    private drop(_pointer: Phaser.Input.Pointer, zone: BattleCharacterZone): void
    {
        if(!zone.battleCharacter) return;
        if(this.originData?.type !== CardType.ATTACK) return;
        
        zone.battleCharacter.addDamage(this._attack);
        this.cardManager.usedCards.push(this.name);
        
        this.stateManager.state = BattleState.NORMAL;

        this.targetPointer.pointer.clear();
        this.targetPointer.color = TargetPointer.DEFAULT_COLOR;
        this.targetPointer.marker.clear();
        this.cardManager.remove(this.setVisible(false));
        this.cardManager.arangeCard();

        this.destroy();
    }

    /**
     * 카드의 드래그 상태가 끝나면 타겟 포인터가 사라집니다.
     */
    private dragend(): void
    {
        this.stateManager.state = BattleState.NORMAL;

        this.targetPointer.pointer.clear();
        this.dragleave();
        this.pointerout();
    }
}