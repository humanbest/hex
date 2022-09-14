import { Scene } from "../interface/Hex";
import MapScene from "./MapScene";

/**
 * Hex 게임의 케릭터선택신 입니다.
 * 
 * @author Jeong GS
 * @since 2022-09-08 오후 17:24
 * 세부 디자인(케릭터,폰트 등)은 추후 구현예정입니다.
 * 맵씬으로 넘어가는 효과도 구현예정
 */

export default class CharacterScene extends Scene 
{

    static readonly KEY = {
        NAME: "CharacterScene"
    }
    constructor() 
    {
        super(CharacterScene.KEY.NAME)
    }
    preload(): void
    {
        this.input.keyboard.on('keydown-F',  () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        })
        this.load.image('SBGI', 'assets/images/characterScene/Background1.png');

        this.load.image('smugglerSel', 'assets/images/characterScene/PosterSm.png');
        this.load.image('phantomSel', 'assets/images/characterScene/PosterPh.png');
        this.load.image('WarwickSel', 'assets/images/characterScene/PosterWa.png');
        this.load.image('question', 'assets/images/characterScene/PosterWh.png');
        this.load.image('LeftSel', 'assets/images/characterScene/LeftSel.png');
        this.load.image('RightSel', 'assets/images/characterScene/RightSel.png');

        this.load.image('smugglerBig', 'assets/images/characterScene/smugglerBig2.png')
        this.load.image('warwick', 'assets/images/characterScene/warwolfBig.png')
        this.load.image('phantom', 'assets/images/characterScene/phantomBig.png')
        this.load.image('LeftArrow','assets/images/characterScene/LeftArrow.png')
    }
    
    create(): void
    {
        /*초기 화면*/

        //배경화면
        this.add.image(400, 400, 'SBGI').setDepth(1).setVisible(true)
        //캐릭터 선택 버튼
        const CharacterSelB1 = this.add.text(100,200, '캐릭터 선택',{font: '32px Arial'}).setInteractive().setDepth(4)
        CharacterSelB1.setTint()
        //설정버튼
        const CharacterSelB2 = this.add.text(100,300, '설정',{font: '32px Arial'}).setDepth(4)
//--------------------------------------------------------------------------------------------------------------------
        /*캐릭터 선택 화면*/

        //캐릭터 선택 버튼
        const buttons = [
            this.add.image(0, 0, 'smugglerSel'),
            this.add.image(0, 0, 'phantomSel'),
            this.add.image(0, 0, 'WarwickSel'),
            this.add.image(0, 0, 'question').setName('question')
        ].map(button => button.setInteractive().setVisible(false));
        
       
        //캐릭터 버튼 컨테이너
        const characterContainer = this.add.container(160, this.cameras.main.height/2).add(buttons).setDepth(3);

        //Geom rectangle  
        const rightRect = this.add.rectangle(this.game.canvas.width, this.game.canvas.height/2, 100, buttons[0].height).setOrigin(1, 0.5)
        .setInteractive().setDepth(5).setVisible(false)

       const leftRect =this.add.rectangle(0, this.game.canvas.height/2, 100, buttons[0].height).setOrigin(0, 0.5)
        .setInteractive().setDepth(5).setVisible(false)

       Phaser.Actions.GridAlign(buttons, {
           width: this.cameras.main.width - 200,
           height: buttons[0].height,
           cellWidth: 300,
           cellHeight: buttons[0].height,
           x: 20,
           y: 0
       });

       //캐릭터 선택시 나오는 이미지
       const imgs = [
        this.add.image(0,0,'smugglerBig').setDepth(2).setOrigin(0).setVisible(false).setInteractive(),
        this.add.image(0,0,'phantom').setDepth(2).setOrigin(0).setVisible(false).setInteractive(),
        this.add.image(0,0,'warwick').setDepth(2).setOrigin(0).setVisible(false).setInteractive()
    ];
        //게임시작 버튼
        const GameStartB = this.add.text(this.game.canvas.width/2,680, '게임 시작',{font: '32px Arial'}).setInteractive().setDepth(4).setVisible(false)
        //이전 버튼
        const LeftArrow = this.add.image(50, 700, 'LeftArrow').setDepth(4).setVisible(false).setInteractive();
//--------------------------------------------------------------------------------------------------------------
       
        /*인터렉티브 */

        //캐릭터 선택화면에서 캐릭터 버튼 효과
        buttons.map((button, i) => {
            
            button.on("pointerover", function (this: Phaser.GameObjects.Image) {this.setBlendMode(Phaser.BlendModes.ADD).setAngle(-15).setScale(1.05)
            }).on("pointerout", function (this: Phaser.GameObjects.Image) {this.setBlendMode(0).setAngle(0).setScale(0.9)
            });
            
            if(button.name !== 'question')
            button.on("pointerdown",function(){imgs.map((img, j) => i === j ? img.setVisible(true) : img.setVisible(false))
                buttons.forEach(i=>i.setVisible(false))
                GameStartB.setVisible(true)
            })
        })

        //캐릭터 선택화면에서 오른쪽 오버시 오른쪽으로 스크롤 효과
        rightRect.on('pointerover', ()=> this.add.tween({
            targets: characterContainer,
            x: -750,
            duration: 1000,
            ease: 'Quad.easeInOut' 
        }))

        //캐릭터 선택화면에서 왼쪽 오버시 왼쪽으로 스크롤 효과
        leftRect.on('pointerover', ()=> this.add.tween({
            targets: characterContainer,
            x: 160,
            duration: 1000,
            ease: 'Quad.easeInOut' 
        }))

        //이전 버튼 효과
        LeftArrow.on(
            'pointerdown',
            function(){
                if(imgs.some(x=> x.visible)){
                    buttons.forEach(i=>i.setVisible(true)),
                    CharacterSelB1.setVisible(false),
                    CharacterSelB2.setVisible(false),
                    rightRect.setVisible(true),
                    leftRect.setVisible(true),
                    LeftArrow.setVisible(true),
                    imgs.forEach(i=>i.setVisible(false)),
                    GameStartB.setVisible(false)
                    
                } else {
                    buttons.forEach(i=>i.setVisible(false)),
                    CharacterSelB1.setVisible(true),
                    CharacterSelB2.setVisible(true),
                    rightRect.setVisible(false),
                    leftRect.setVisible(false),
                    LeftArrow.setVisible(false),
                    imgs.forEach(i=>i.setVisible(false)),
                    GameStartB.setVisible(false)
                }
                
            })
        
        
        //맵씬으로 넘어가기
        GameStartB.on('pointerdown', ()=> {
            this.scene.start(MapScene.KEY.NAME)
        })


        //초기화면에서 캐릭터 선택 버튼 클릭시 효과
        CharacterSelB1.on(
            'pointerdown',
            function(){
                buttons.forEach(i=>i.setVisible(true)),
                CharacterSelB1.setVisible(false),
                CharacterSelB2.setVisible(false),
                rightRect.setVisible(true),
                leftRect.setVisible(true),
                LeftArrow.setVisible(true)
                
            })
    }
    update(): void {
    }
}

