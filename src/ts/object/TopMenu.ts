import LoadScene from "../scene/LoadScene";
import { Scene } from "../interface/Hex";

/**
 * 상단 메뉴를 나타냅니다.
 * 
 * @author Rubisco
 * @since 2022-08-25 오후 7:41
 */
export default class TopMenu extends Phaser.GameObjects.Container
{
    /**
     * 오브젝트 이름에 대한 key값
     * */
    static readonly KEY = {
        NAME: "TopMenu",
        LEFT: "TopMenu.Left",
        Right: "TopMenu.Right",
        IMAGE: {
            BACKGROUND: "metal_texture",
            HP: "heart",
            COIN_BAG: "coin_bag",
            CLOCK: "clock",
            MAP: "map",
            DEC: "dec",
            GEAR: "gear",
        },
        TEXT: {
            NICKNAME: "nickNameText",
            HP: "hpText",
            COIN: "coinText",
            TIME: "timeText",
            CARD_COUNT: "cardCountText"
        }
    }

    /** 탑 메뉴 높이 */
    static readonly HEIGHT: number = 40;

    /** 시간 텍스트 설정 */
    set timeText(text: string) {this.timerText.setText(text)}

    /** 타이머 표시 여부 */
    set timerVisible(boolean: boolean) 
    {
        this.timerText.setVisible(boolean);
        this.timerImage.setVisible(boolean);
    }

    /** 타이머 텍스트 */
    private readonly timerText: Phaser.GameObjects.Text;
    
    /** 타이머 이미지 */
    private readonly timerImage: Phaser.GameObjects.Image;

    /**
     * 상단 메뉴를 생성합니다.
     * 
     * @author Rubisco
     * @param scene 씬
     * @param x x좌표
     * @param y y좌표
     */
    constructor(scene: Scene, x: number, y: number, timerVisible: boolean = false) {

        const game = scene.game;

        super(scene, x, y);

        // 상단 메뉴 배경
        const background = scene.add.tileSprite(
            0, 0, 
            game.canvas.width, 
            TopMenu.HEIGHT, 
            LoadScene.KEY.ATLAS.TOP,
            TopMenu.KEY.IMAGE.BACKGROUND
        ).setOrigin(0).setName(TopMenu.KEY.IMAGE.BACKGROUND);

        // 왼쪽 컨테이너 영역 생성
        const left = new Left(scene, 0, 0);
    
        // 오른쪽 컨테이너 영역 생성
        const right = new Right(scene, game.canvas.width, 0);

        // 시간 텍스트 주입
        this.timerText = right.getByName(TopMenu.KEY.TEXT.TIME) as Phaser.GameObjects.Text;
        this.timerImage = right.getByName(TopMenu.KEY.IMAGE.CLOCK) as Phaser.GameObjects.Image;

        // 타이머 기본값 입력
        this.timerVisible = timerVisible;

        // 지도, 덱, 설정 아이콘을 마우스 포인터와 상호작용 가능하도록 설정
        [TopMenu.KEY.IMAGE.MAP, TopMenu.KEY.IMAGE.DEC, TopMenu.KEY.IMAGE.GEAR].forEach( name => {
            right.getByName(name).setInteractive();
            right.getByName(name).on("pointerover", function (this: Phaser.GameObjects.Image) {this.setBlendMode(Phaser.BlendModes.ADD).setAngle(-15).setScale(name == TopMenu.KEY.IMAGE.DEC ? 1.2 : 1.05)});
            right.getByName(name).on("pointerout", function (this: Phaser.GameObjects.Image) {this.setBlendMode(0).setAngle(0).setScale(name == TopMenu.KEY.IMAGE.DEC ? 1 : 0.9)});
        });

        // 플레이어 덱에 존재하는 카드의 수를 표시
        const cardCount = scene.add.text(0, 0, game.player!.dec.length.toString(), {
            fontFamily: 'neodgm',
            fontSize: "12px",
            color: "white",
            stroke: "black",
            strokeThickness: 1
        }).setShadow(2, 2, "#000000", 2, true, true).setName(TopMenu.KEY.TEXT.CARD_COUNT);

        // 카드 개수의 상태 체크
        scene.events.on("update", () => {
            try { cardCount.setText(game.player!.dec.length.toString()) }
            catch (e) { cardCount.setText("") }
        });

        // 상단 메뉴를 씬에 추가
        this.add([background, left, right, cardCount]).setName(TopMenu.KEY.NAME);
        
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

        const background = this.getByName(TopMenu.KEY.IMAGE.BACKGROUND) as Phaser.GameObjects.TileSprite;
        const left = this.getByName(TopMenu.KEY.LEFT) as Phaser.GameObjects.Container;
        const right = this.getByName(TopMenu.KEY.Right) as Phaser.GameObjects.Container;
        const cardCount = this.getByName(TopMenu.KEY.TEXT.CARD_COUNT) as Phaser.GameObjects.Text;

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
        const dec = right.getByName(TopMenu.KEY.IMAGE.DEC) as Phaser.GameObjects.Image;
        cardCount.setPosition(right.x + dec.x + dec.width / 2, background.height - 3).setOrigin(1);
    }
}

/**
 * 상단 메뉴의 왼쪽 컨테이너 영역 입니다.
 * 
 * @author Rubisco
 * @see TopMenu
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

        const game = scene.game;

        this.add([
            
            // 플레이어 닉네임
            scene.add.text(0, 0,  game.player!.nickName, {
                fontFamily: 'neodgm',
                fontSize: "20px",
                color: "white"
            }).setShadow(2, 2, '#000000', 2, true, true).setName(TopMenu.KEY.TEXT.NICKNAME),

            // 플레이어 챔피언 이름
            scene.add.text(0, 0, game.player!.champion.name, {
                fontFamily: 'neodgm',
                fontSize: "16px",
                color: "gray"
            }).setShadow(2, 2, '#000000', 2, true, true),

            // HP 아이콘
            scene.add.image(0, 0, LoadScene.KEY.ATLAS.TOP, TopMenu.KEY.IMAGE.HP).setScale(0.75),

            // HP 값
            scene.add.text(0, 0, `${game.player!.champion.hp}/${game.player!.champion.maxHp}`, {
                fontFamily: 'neodgm',
                fontSize: "20px",
                color: "#c95134",
                stroke: "#c95134",
                strokeThickness: 1
            }).setShadow(2, 2, "#000000", 2, true, true).setName(TopMenu.KEY.TEXT.HP),

            // 코인 주머니 아이콘
            scene.add.image(0, 0, LoadScene.KEY.ATLAS.TOP, TopMenu.KEY.IMAGE.COIN_BAG).setScale(0.75).setName(TopMenu.KEY.IMAGE.COIN_BAG),

            // 코인 값
            scene.add.text(0, 0, game.player!.inventory.coin.toString(), {
                fontFamily: 'neodgm',
                fontSize: "20px",
                color: "gold",
                stroke: "gold",
                strokeThickness: 1
            }).setShadow(2, 2, "#000000", 2, true, true).setName(TopMenu.KEY.TEXT.COIN),

        ]).setName(TopMenu.KEY.LEFT);

        scene.add.existing(this);
    }
}

/**
 * 상단 메뉴의 오른쪽 컨테이너 영역 입니다.
 * 
 * @author Rubisco
 * @see TopMenu
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
            scene.add.image(0, 0, LoadScene.KEY.ATLAS.TOP, TopMenu.KEY.IMAGE.CLOCK).setScale(0.75).setName(TopMenu.KEY.IMAGE.CLOCK),

            // 시간 텍스트
            scene.add.text(0, 0, "", {
                fontFamily: 'neodgm',
                fontSize: "20px",
                color: "gold",
                stroke: "gold",
                strokeThickness: 1
            }).setShadow(2, 2, "#000000", 2, true, true).setName(TopMenu.KEY.TEXT.TIME),

            // 지도 아이콘
            scene.add.image(0, 0, LoadScene.KEY.ATLAS.TOP, TopMenu.KEY.IMAGE.MAP).setScale(0.9).setName(TopMenu.KEY.IMAGE.MAP),

            // 덱 아이콘
            scene.add.image(0, 0, LoadScene.KEY.ATLAS.TOP, TopMenu.KEY.IMAGE.DEC).setScale(1.05).setName(TopMenu.KEY.IMAGE.DEC),

            // 설정 아이콘
            scene.add.image(0, 0, LoadScene.KEY.ATLAS.TOP, TopMenu.KEY.IMAGE.GEAR).setScale(0.9).setName(TopMenu.KEY.IMAGE.GEAR),

        ]).setName(TopMenu.KEY.Right);

        scene.add.existing(this);
    }
}