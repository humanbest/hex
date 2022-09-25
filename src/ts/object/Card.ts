import { Vector } from "matter";
import { CardAdjust, CardData, CardType, Game, Scene } from "../interface/Hex";
import LoadScene from "../scene/LoadScene";

/**
 * 카드 오브젝트
 * 
 * @author Rubisco
 * @since 2022-08-25 오후 7:41
 */
export default class Card extends Phaser.GameObjects.Container
{

    static readonly KEY = {
        IMAGE: {
            CARD_FRONT: "card_front",
            CARD_COLOR: "card_color",
            TITLE_COLOR: "title_color",
            COST_BOX: "cost_box"
        }
    }

    /** 카드 넓이 */
    static readonly WIDTH: number = 200;

    /** 카드 높이 */
    static readonly HEIGHT: number = 300;

    /** 카드 이미지 위치 오차 조절 */
    static readonly IMAGE_POSITION: Vector = { x: 0, y: -35 };
    
    /** 카드 이미지 크기 오차 조절 */
    static readonly IMAGE_SCALE: Vector = { x: 0.7, y: 0.7 };

    /** 카드 타입에 따른 이미지 영역 색상 */
    private static readonly imageColor: number[] = [0x923a37, 0x252a37, 0x71915c];
    private static readonly titleColor: number[] = [0xffbb9d, 0x9fdbe1, 0xc2d6b5];
    
    /** 카드 데이터 리스트 */
    static get cardDataList() {return this._cardDataList }
    static set cardDataList(cardDataList) { this._cardDataList = cardDataList }
    private static _cardDataList: {[key: string]: CardData};

    get originData() {return this._originData}
    private readonly _originData?: CardData;
    
    /** 카드의 선택 여부 */
    isSelected: boolean = false;

    /** 카드의 앞면 여부 */
    readonly isFront: boolean;

    /**
     * 카드 오브젝트를 생성합니다.
     * 
     * @param scene 씬
     * @param cardName 카드 이름
     * @param isFront 앞면 여부
     * @returns 카드
     */
    constructor(scene: Scene, cardName?: string, isFront?: boolean) 
    {
        super(scene, 0, 0);

        if(isFront === undefined) isFront = false;

        this.isFront = isFront;

        if(isFront && cardName && Card.cardDataList[cardName])
        {

            /** 카드 데이터 주입 */
            let cardData = Card.cardDataList[cardName];
            this.name = cardName;

            /** 카드 데이터 저장 */
            this._originData = cardData;

            /** 카드 타입 */
            const type: CardType = cardData.type;
            
            /** 카드 cost 텍스트 스타일 */
            const costValueTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
                fontFamily: "neodgm",
                fontSize: "20px",
                color: "#f4efe8",
                stroke: "#695a45",
                strokeThickness: 5
            }

            /** 카드 이름 텍스트 스타일 */
            const cardNameTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
                fontFamily: "neodgm",
                fontSize: "18px",
                color: "#f4efe8",
                stroke: "#695a45",
                strokeThickness: 5
            }

            /** 카드 오차 데이터 */
            const adjust = Card.getCardAdjustData(this.scene.game, cardName);

            /** 카드 앞면 이미지 */
            const cardFrontImage = scene.add.image(0, 0, LoadScene.KEY.ATLAS.CARD_BASE, Card.KEY.IMAGE.CARD_FRONT);
            
            /** 카드 영역 색상 */
            const cardColorImage = scene.add.image(0, cardFrontImage.getTopCenter().y, LoadScene.KEY.ATLAS.CARD_BASE, Card.KEY.IMAGE.CARD_COLOR).setOrigin(0.5, 0).setTint(Card.imageColor[type]);
            
            /** 카드 이름 영역 색상 */
            const titleColorImage = scene.add.image(0, cardFrontImage.getTopCenter().y, LoadScene.KEY.ATLAS.CARD_BASE, Card.KEY.IMAGE.TITLE_COLOR).setOrigin(0.5, 0).setTint(Card.titleColor[type]);
            
            /** 카드 cost 영역 배경 이미지 */
            const costBoxImage = scene.add.image(cardFrontImage.getTopLeft().x + 7, cardFrontImage.getTopLeft().y + 10, LoadScene.KEY.ATLAS.CARD_BASE, Card.KEY.IMAGE.COST_BOX).setScale(0.8);
            
            /** 카드 비용 텍스트 */
            const costValueText = scene.add.text(costBoxImage.getCenter().x, costBoxImage.getCenter().y, cardData.cost == -1 ? "∞" : cardData.cost.toString(), costValueTextStyle).setOrigin(0.5);
            
            /** 카드 이름 텍스트 */
            const cardNameText = scene.add.text(-10, cardFrontImage.getTopCenter().y + 27, cardData.name, cardNameTextStyle).setOrigin(0.5);
            
            /** 카드 이미지 */
            const cardImage = scene.add.image(adjust.position.x, adjust.position.y, LoadScene.KEY.ATLAS.CARD_IMAGE, cardName).setScale(adjust.scale.x, adjust.scale.y);
            
            this.add([cardFrontImage, cardColorImage, titleColorImage, costBoxImage, costValueText, cardNameText, cardImage]);
        }
        else
        {
            this.add(scene.add.image(0, 0, LoadScene.KEY.IMAGE.CARD_BACK));
        }
    }

    /**
     * 카드의 오차 데이터를 반환합니다.
     * 
     * @param cardName 카드 이름
     * @returns 카드 오차 데이터
     */
    private static getCardAdjustData(game: Game, cardName: string): CardAdjust
    {
        const cartAdjustData = game.cache.json.get(LoadScene.KEY.DATA.ADJUST);

        return cartAdjustData.hasOwnProperty(cardName) ? cartAdjustData[cardName] : { position: Card.IMAGE_POSITION, scale: Card.IMAGE_SCALE };
    }
}