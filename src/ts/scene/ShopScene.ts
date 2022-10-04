import TopMenu from "../object/TopMenu";
import Card from "../object/Card";
import {CardData, ChampionPrimaryKey, defaultPlayer, Scene} from "../interface/Hex";
import LoadScene from "./LoadScene";
import Shopproduct from "../interface/Shopproduct";
import DodgeStartScene from "./DodgeStartScene";
import MapScene from "./MapScene";
import Potion from "../object/Potion";
import DecViewer from "../object/DecViewer";

// import Shopproduct from "../interface/Shopproduct";


// @ts-ignore
export class ShopCard extends Card implements CardData {

    private static readonly ORIGIN_SCALE: number = 0.9;
    private static readonly HOVER_SCALE: number = 0.95;
    private static readonly CLICK_SCALE: number = 1;

    price : number;
    key: number;
    name : string;
    ownership: ChampionPrimaryKey;
    cost: number;
    probability: number;

    // @ts-ignore
    constructor(scene: Scene, cardName?: string, isFront?: boolean, isShop : boolean) {
        super(scene, cardName, isFront);

        this.setSize(Card.WIDTH, Card.HEIGHT)
            .setScale(ShopCard.ORIGIN_SCALE)
            .setInteractive()
            .on("pointerover", () => this.scene.add.tween({
                targets: this,
                duration: 70,
                scale: ShopCard.HOVER_SCALE
            }))
            .on("pointerout", () => this.scene.add.tween({
                targets: this,
                duration: 70,
                scale: ShopCard.ORIGIN_SCALE
            }))
            .on("pointerdown", () => this.setScale(ShopCard.CLICK_SCALE))

        // @ts-ignore
        const cardData = ShopCard.cardDataList[cardName];

        this.setData(cardData).setData("key", cardName);

        this.name = cardData.name;
        this.key = cardData.key;
        this.ownership = cardData.ownership;
        this.cost = cardData.cost;
        this.probability = cardData.probability;
        this.price = this.setprice(this.cost);
        scene.add.existing(this);

        const cardprice = scene.add.text(-15,-200,this.price.toString(), {
            fontFamily: 'neodgm',
            fontSize: "30px",
            color: "gold",
            stroke: "black",
            strokeThickness: 10
        });

        if(isShop){
            this.add(cardprice);
        }
    }

    setprice (cost : number) : any {

        if (cost == 0) {
            return 30;
        }
        else if(cost == -1){
            return  60;
        }
        else {
            return cost * 30
        }

    }

}

export default class ShopScene extends Scene {

    static readonly KEY = {
        NAME: "ShopScene",
        IMAGE: {
            ShopOwner: "ShopOwner",
            ShopPaper: "ShopPaper",
            ShopMyDec: "ShopMyDec",
            ShopExit: "ShopExit",
            notenough:"notenough",
            buycomplete:"buycomplete",
            dodgeicon:"dodgeicon",
            maximumdec:"maximumdec",
            woodtexture:"woodtexture",
            woodtexture2:"woodtexture2",
            ExitButton:"ExitButton",
            sellBox:"sellBox",
            sellYes:"sellYes",
            sellNo:"sellNo"
        }
    }

    private coinText?: Phaser.GameObjects.Text;

    constructor() {
        super(ShopScene.KEY.NAME)
    }

    preload(): void {
        this.input.keyboard.on('keydown-F', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        })

        // let card:ShopCard = new ShopCard().key

        this.load.image(ShopScene.KEY.IMAGE.ShopOwner, "assets/images/shopScene/ShopOwner.png");
        this.load.image(ShopScene.KEY.IMAGE.ShopPaper, "assets/images/shopScene/paper-plain.png");
        this.load.image(ShopScene.KEY.IMAGE.ShopMyDec, "assets/images/shopScene/MYDEC.png");
        this.load.image(ShopScene.KEY.IMAGE.ShopExit, "assets/images/shopScene/EXIT.png");

        this.load.image(ShopScene.KEY.IMAGE.notenough, "assets/images/shopScene/notenough.png");
        this.load.image(ShopScene.KEY.IMAGE.buycomplete, "assets/images/shopScene/buycomplete.png");
        /** 더미 카드 이미지 */
        this.load.image(ShopScene.KEY.IMAGE.dodgeicon, "assets/images/shopScene/dodgeicon.png");
        this.load.image(ShopScene.KEY.IMAGE.maximumdec, "assets/images/shopScene/maximumdec.png");
        this.load.image(ShopScene.KEY.IMAGE.woodtexture, "assets/images/shopScene/woodtexture.png")
        this.load.image(ShopScene.KEY.IMAGE.woodtexture2, "assets/images/shopScene/woodtexture2.png")

        this.load.image(ShopScene.KEY.IMAGE.ExitButton, "assets/images/shopScene/ExitButton.png")

        this.load.image(ShopScene.KEY.IMAGE.sellBox, "assets/images/shopScene/sellBox.png")
        this.load.image(ShopScene.KEY.IMAGE.sellYes, "assets/images/shopScene/sellYes.png")
        this.load.image(ShopScene.KEY.IMAGE.sellNo, "assets/images/shopScene/sellNo.png")
    }

    create(): void {

        this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, ShopScene.KEY.IMAGE.woodtexture2).setOrigin(0, 0);

        let potion =  new Potion(this);

        this.add.existing(potion);

        let shopproduct = new Shopproduct(this);

        this.coinText = (new TopMenu(this, 0, 0).getByName(TopMenu.KEY.LEFT) as Phaser.GameObjects.Container)
            .getByName(TopMenu.KEY.TEXT.COIN) as Phaser.GameObjects.Text;

        const Shuffle: (array: string[]) => string[] = Phaser.Utils.Array.Shuffle;

        this.add.image(this.cameras.main.width-30, TopMenu.HEIGHT + 10, ShopScene.KEY.IMAGE.ShopOwner).setOrigin(1, 0).setScale(0.5);

        const dodge = this.add.image(this.cameras.main.width-150, TopMenu.HEIGHT + 300, ShopScene.KEY.IMAGE.dodgeicon).setScale(0.35)
            .setInteractive()
            .on("pointerover", () => this.add.tween({
                targets: dodge,
                duration: 70,
                scale: 0.38
            }))
            .on("pointerout", () => this.add.tween({
                targets: dodge,
                duration: 70,
                scale: 0.35
            }))
            .on("pointerdown",()=> this.gotododge());


        // this.add.image(5, 40, ShopScene.KEY.IMAGE.ShopPaper).setOrigin(0, 0);

        [
            this.add.image(this.cameras.main.width - 150, 650, ShopScene.KEY.IMAGE.ShopExit)
                .on("pointerup",()=> this.scene.start(MapScene.KEY.NAME)),
            this.add.image(this.cameras.main.width - 150, 550, ShopScene.KEY.IMAGE.ShopMyDec)
                .on("pointerup", ()=> new DecViewer(this, true))
        ].forEach((image: Phaser.GameObjects.Image)=>image
            .setScale(0.27)
            .setInteractive()
            .on("pointerover", () => this.add.tween({
                targets: image,
                duration: 70,
                scale: 0.28
            }))
            .on("pointerout", () => this.add.tween({
                targets: image,
                duration: 70,
                scale: 0.27
            }))
            .on("pointerdown", ()=> this.add.tween({
                targets: image,
                duration: 70,
                scale: 0.3
            })))



        const cardNameArr: Array<string> = Object.keys(this.game.cache.json.get(LoadScene.KEY.DATA.CARD));
        const cardArr: Array<ShopCard> = Shuffle(cardNameArr).slice(0, 3).map(cardName => new ShopCard(this, cardName, true,true));
        cardArr.forEach((shopCard : ShopCard)=>shopCard
            .on("pointerup",()=>shopproduct.buyShopCard(this,shopCard, cardNameArr))
        );


        Phaser.Actions.GridAlign([cardArr[0], cardArr[1], cardArr[2]], {
            width: (Card.WIDTH + 20) * 3,
            height: Card.HEIGHT,
            cellWidth: Card.WIDTH + 20,
            cellHeight: Card.HEIGHT,
            x: this.cameras.main.width / 6,
            y: this.cameras.main.height - (Card.HEIGHT / 1.5)
        });
    }
    
    gotododge () : void {

        let shopproduct = new Shopproduct(this);
        
        if(defaultPlayer.inventory.coin < 0){
            shopproduct.notification(shopproduct.notEnough);
        }
        else{
            this.scene.launch(DodgeStartScene.KEY.NAME)
        }
    }

    createDecviewer () : void {
        new DecViewer(this, true);
    }
    

    update():void{

        this.coinText!.setText(this.game.player!.inventory.coin.toString());

    }

}