import Phaser, { Scene } from "phaser";
import { CONFIG } from "../config";
import { HexGame } from "./Interface";

/**
 * 상단 메뉴를 나타냅니다.
 * 
 * @author Rubisco
 * @since 2022-08-25 오후 7:41
 */
export default class TopMenu extends Phaser.GameObjects.Container {
    
    /**
     * 상단 메뉴를 생성합니다.
     * 
     * @author Rubisco
     * @param scene 씬
     * @param x x좌표
     * @param y y좌표
     */
    constructor(scene: Scene, x: number, y: number) {
        const game = scene.game as HexGame;

        super(scene, x, y);

        // 상단 메뉴 배경
        const background = scene.add.tileSprite(
            0, 0, 
            game.canvas.width, 
            CONFIG.CONTAINER.TOP_MENU.HEIGHT, 
            CONFIG.SPRITE.TOP,
            CONFIG.IMAGE.METAL
        ).setOrigin(0).setName(CONFIG.CONTAINER.TOP_MENU.BACKGROUND);

        // 왼쪽 컨테이너 영역 생성
        const left = new Left(scene, 0, 0);
    
        // 오른쪽 컨테이너 영역 생성
        const right = new Right(scene, game.canvas.width, 0);

        // 지도, 덱, 설정 아이콘을 마우스 포인터와 상호작용 가능하도록 설정
        [CONFIG.CONTAINER.TOP_MENU.RIGHT.MAP_IMAGE, CONFIG.CONTAINER.TOP_MENU.RIGHT.DEC_IMAGE, CONFIG.CONTAINER.TOP_MENU.RIGHT.GEAR_IMAGE].forEach( name => {
            right.getByName(name).setInteractive();
            right.getByName(name).on("pointerover", function (this: Phaser.GameObjects.Image) {this.setBlendMode(Phaser.BlendModes.ADD).setAngle(-15).setScale(name == CONFIG.IMAGE.DEC ? 1.2 : 1.05)});
            right.getByName(name).on("pointerout", function (this: Phaser.GameObjects.Image) {this.setBlendMode(0).setAngle(0).setScale(name == CONFIG.IMAGE.DEC ? 1 : 0.9)});
        });

        // 플레이어 덱에 존재하는 카드의 수를 표시
        const cardCount = scene.add.text(0, 0, game.player!.dec.length.toString(), {
            fontSize: "12px",
            color: "white",
            stroke: "black",
            strokeThickness: 1
        }).setShadow(2, 2, "#000000", 2, true, true).setName(CONFIG.CONTAINER.TOP_MENU.RIGHT.CARD_COUNT);

        // 상단 메뉴를 씬에 추가
        this.add([background, left, right, cardCount]).setName(CONFIG.CONTAINER.TOP_MENU.NAME);
        
        // 정렬 이벤트 등록
        this.on('align', this.align);
        
        // 정렬
        this.align();

        scene.add.existing(this);
    }

    /**
     * 상단 메뉴의 오브젝트를 정렬합니다.
     * 
     * @author Rubisco
     */
    public align(): void {

        const background = this.getByName('background') as Phaser.GameObjects.TileSprite;
        const left = this.getByName('left') as Phaser.GameObjects.Container;
        const right = this.getByName('right') as Phaser.GameObjects.Container;
        const cardCount = this.getByName('cardCount') as Phaser.GameObjects.Text;
        
        // 배경의 넓이 설정
        background.width = this.scene.game.canvas.width;
        
        // 왼쪽 컨테이너의 오브젝트 정렬
        left.getAll().forEach((e: any, i, a: any) => e.setOrigin(0.5).setPosition(
            [0, 20, 30, 5, 30, 5][i] + (i ? a[i - 1].x + (a[i - 1].width * a[i - 1].scale + a[i].width * a[i].scale) / 2 : 0), 
            background.getCenter().y
        ));
        
        // 왼쪽 컨테이너 위치 설정
        //@ts-ignore
        left.x = left.getAt(0).width / 2 + 20;

        // 오른쪽 컨테이너의 오브젝트 정렬
        right.list.forEach((e: any, i, a: any) => e.setOrigin(0.5).setPosition(
            [0, 5, 30, 20, 20][i] + (i ? a[i - 1].x + (a[i - 1].width * a[i - 1].scale + a[i].width * a[i].scale) / 2 : 0), 
            background.getCenter().y
        ));

        // 오른쪽 컨테이너 위치 설정
        //@ts-ignore
        right.x -= right.getAt(right.list.length -1).x + right.getAt(right.list.length -1).width / 2 + 20;
        
        // 카드 수를 나타내는 텍스트의 위치 설정
        const dec = right.getByName(CONFIG.CONTAINER.TOP_MENU.RIGHT.DEC_IMAGE) as Phaser.GameObjects.Image;
        cardCount.setPosition(right.x + dec.x + dec.width / 2, background.height - 3).setOrigin(1);
    }
}

/**
 * 상단 메뉴의 왼쪽 컨테이너 영역 입니다.
 * 
 * @author Rubisco
 * @since 2022-08-25 오후 7:41
 */
class Left extends Phaser.GameObjects.Container {

    /**
     * 상단 메뉴의 왼쪽 컨테이너 영역을 생성합니다.
     * 
     * @author Rubisco
     * @param scene 씬
     * @param x x좌표
     * @param y y좌표
     */
    constructor(scene: Scene, x: number, y: number) {

        super(scene, x, y);

        const game = scene.game as HexGame;

        this.add([
            
            // 플레이어 닉네임
            scene.add.text(0, 0,  game.player!.nickName, {
                fontFamily: 'Noto Sans KR',
                fontSize: "20px",
                color: "white"
            }).setShadow(2, 2, '#000000', 2, true, true).setName(CONFIG.CONTAINER.TOP_MENU.LEFT.NICKNAME),

            // 플레이어 챔피언 이름
            scene.add.text(0, 0, game.player!.champion.name, {
                fontFamily: 'Noto Sans KR',
                fontSize: "15px",
                color: "gray"
            }).setShadow(2, 2, '#000000', 2, true, true).setName('champName'),

            // HP 아이콘
            scene.add.image(0, 0, CONFIG.SPRITE.TOP, CONFIG.IMAGE.HEART).setScale(0.75).setName(CONFIG.CONTAINER.TOP_MENU.LEFT.HP_IMAGE),

            // HP 값
            scene.add.text(0, 0, `${game.player!.champion.hp}/${game.player!.champion.maxHp}`, {
                fontSize: "20px",
                color: "#c95134",
                stroke: "#c95134",
                strokeThickness: 1
            }).setShadow(2, 2, "#000000", 2, true, true).setName(CONFIG.CONTAINER.TOP_MENU.LEFT.HP_VALUE),

            // 코인 주머니 아이콘
            scene.add.image(0, 0, CONFIG.SPRITE.TOP, CONFIG.IMAGE.COIN_BAG).setScale(0.75).setName(CONFIG.CONTAINER.TOP_MENU.LEFT.COIN_BAG_IMAGE),

            // 코인 값
            scene.add.text(0, 0, game.player!.inventory.coin.toString(), {
                fontSize: "20px",
                color: "gold",
                stroke: "gold",
                strokeThickness: 1
            }).setShadow(2, 2, "#000000", 2, true, true).setName(CONFIG.CONTAINER.TOP_MENU.LEFT.COIN_BAG_VALUE),

        ]).setName(CONFIG.CONTAINER.TOP_MENU.LEFT.NAME);

        scene.add.existing(this);
    }
}

/**
 * 상단 메뉴의 오른쪽 컨테이너 영역 입니다.
 * 
 * @author Rubisco
 * @since 2022-08-25 오후 7:41
 */
class Right extends Phaser.GameObjects.Container {
    
    /**
     * 상단 메뉴의 오른쪽 컨테이너 영역을 생성합니다.
     * 
     * @author Rubisco
     * @param scene 씬
     * @param x x좌표
     * @param y y좌표
     */
    constructor(scene: Scene, x: number, y: number) {

        super(scene, x, y);

        this.add([

            // 시계 아이콘
            scene.add.image(0, 0, CONFIG.SPRITE.TOP, CONFIG.IMAGE.CLOCK).setScale(0.75).setName(CONFIG.CONTAINER.TOP_MENU.RIGHT.CLOCK_IMAGE),

            // 시간 텍스트
            scene.add.text(0, 0, "00:00", {
                fontSize: "20px",
                color: "gold",
                stroke: "gold",
                strokeThickness: 1
            }).setShadow(2, 2, "#000000", 2, true, true).setName(CONFIG.CONTAINER.TOP_MENU.RIGHT.CLOCK_VALUE),

            // 지도 아이콘
            scene.add.image(0, 0, CONFIG.SPRITE.TOP, CONFIG.IMAGE.MAP).setScale(0.9).setName(CONFIG.CONTAINER.TOP_MENU.RIGHT.MAP_IMAGE),

            // 덱 아이콘
            scene.add.image(0, 0, CONFIG.SPRITE.TOP, CONFIG.IMAGE.DEC).setScale(1.05).setName(CONFIG.CONTAINER.TOP_MENU.RIGHT.DEC_IMAGE),

            // 설정 아이콘
            scene.add.image(0, 0, CONFIG.SPRITE.TOP, CONFIG.IMAGE.GEAR).setScale(0.9).setName(CONFIG.CONTAINER.TOP_MENU.RIGHT.GEAR_IMAGE),

        ]).setName(CONFIG.CONTAINER.TOP_MENU.RIGHT.NAME);

        scene.add.existing(this);
    }
}