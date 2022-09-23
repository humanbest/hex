import { Vector } from "matter";
import BattleManager from "../interface/BattleManager";
import { Buff, CardType, Champion, Scene } from "../interface/Hex";
import BattleScene from "../scene/BattleScene";

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

    /** 체력바 */
    get healthBar() {return this._healthBar}
    private readonly _healthBar?: Phaser.GameObjects.Graphics;

    /** 
     * 캐릭터 매니저 객체를 생성합니다.
     * 
     * @param battleManager 배틀 매니저
     * @param x x축 좌표
     * @param y y축 좌표
     * @param champion 챔피언 인터페이스
     * @param name 스프라이트 키값
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

        /** name 값이 있으면 스프라이트를 생성하여 객체에 주입합니다. */
        if(name) this.add(this._sprite = battleManager.scene.add.sprite(0, 0, name));
        

        if(!this._sprite) return this;

        this.setSize(this._sprite.displayWidth, this._sprite.displayHeight)
            .createCharaterSprite();
        this.add(this._healthBar = new Phaser.GameObjects.Graphics(battleManager.scene));
        this._healthBar
            .fillStyle(0x000000).fillRect(this._sprite.getBottomLeft().x, this._sprite.getBottomLeft().y + 10, this._sprite.displayWidth, 16)
            .fillStyle(0xffffff).fillRect(this._sprite.getBottomLeft().x, this._sprite.getBottomLeft().y + 10, this._sprite.displayWidth, 16)
    }

    /** 
     * 캐릭터 스프라이트를 생성합니다.
     */
    private createCharaterSprite(): void
    {
        if(!this._sprite) return;

        const skills = this._sprite.anims.animationManager["anims"].keys();
        let c = 0;

        this._sprite.setInteractive().on('pointerdown', () => {
            if(this._sprite) {
                if(++c === skills.length) c = 0;
                this._sprite.play(skills[c]);
            }
        }).on('pointerover', ()=>{
            const card = this.battleManager.cardManager.selectedCard;
            if(card && card.getData("type") !== CardType.ATTACK) return;
            this.battleManager.targetPointer.color = TargetPointer.ATTACK_COLOR;
            if(this.battleManager.cardManager.selectedCard && this._sprite) this.battleManager.targetPointer.createTargetMarker(this);
        }).on('pointerout', ()=>{
            this.battleManager.targetPointer.color = TargetPointer.DEFAULT_COLOR;
            this.battleManager.targetPointer.marker.clear();
        }).play("idle").setScale(3);
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

    createTargetMarker(character: BattleCharacter)
    { 
        this._marker.clear();

        const points = [
            character.x + character.sprite!.getTopLeft().x + 25,
            character.y + character.sprite!.getTopLeft().y + 25,
            character.x + character.sprite!.getTopRight().x - 25,
            character.y + character.sprite!.getTopRight().y + 25,
            character.x + character.sprite!.getBottomLeft().x + 25,
            character.y + character.sprite!.getBottomLeft().y - 25,
            character.x + character.sprite!.getBottomRight().x -25,
            character.y + character.sprite!.getBottomRight().y -25,
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
}