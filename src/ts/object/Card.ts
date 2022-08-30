import { Vector } from "matter";
import { Scene } from "phaser";
import { CONFIG } from "../config";
import { CardAdjust, CardData, CardType } from "../interface/Interface";

/**
 * 카드 오브젝트
 * 
 * @author Rubisco
 * @since 2022-08-25 오후 7:41
 */
export default class Card extends Phaser.GameObjects.Container 
{
    /** 카드 넓이 */
    public static width: number = 200;

    /** 카드 높이 */
    public static height: number = 300;

    /** 카드 배열 최대 각도 */
    public static maxAngle: number = 30;

    /** 카드 크기 */
    public static scale: number = 0.5;

    /** 카드 이미지 위치 오차 조절 */
    private static imagePosition: Vector = { x: 0, y: -35 };
    
    /** 카드 이미지 크기 오차 조절 */
    private static imageScale: Vector = { x: 0.7, y: 0.7 };

    /** 
     * 카드 타입에 따른 이미지 영역 색상
     * @see 
     */
    private static imageColor: number[] = [0x923a37, 0x252a37, 0x71915c, 0x71915c, 0x71915c];
    private static titleColor: number[] = [0xffbb9d, 0x9fdbe1, 0xc2d6b5, 0xc2d6b5, 0xc2d6b5];
    
    public isSelected: boolean = false;
    public isFront: boolean = true;

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

        /** 카드 데이터 */
        const cardData: CardData | undefined = this.getCardData(cardName);

        if(isFront && cardName && cardData)
        {
            /** 카드 타입 */
            let type: CardType;
            
            if(cardData.type instanceof Array) type = cardData.type[0];
            else type = cardData.type;
            
            /** 카드 비용 텍스트 스타일 */
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
            const adjust = this.getCardAdjustData(cardName);

            /** 카드 앞면 이미지 */
            const cardFrontImage = scene.add.image(0, 0, CONFIG.ATLAS.CARD_BASE, CONFIG.IMAGE.CARD_FRONT);
            
            /** 카드 영역 색상 */
            const cardColorImage = scene.add.image(0, cardFrontImage.getTopCenter().y, CONFIG.ATLAS.CARD_BASE, CONFIG.IMAGE.CARD_COLOR).setOrigin(0.5, 0).setTint(Card.imageColor[type]);
            
            /** 카드 이름 영역 색상 */
            const titleColorImage = scene.add.image(0, cardFrontImage.getTopCenter().y, CONFIG.ATLAS.CARD_BASE, CONFIG.IMAGE.TITLE_COLOR).setOrigin(0.5, 0).setTint(Card.titleColor[type]);
            
            /** 카드 비용 영역 배경 이미지 */
            const costBoxImage = scene.add.image(cardFrontImage.getTopLeft().x + 7, cardFrontImage.getTopLeft().y + 10, CONFIG.ATLAS.CARD_BASE, CONFIG.IMAGE.COST_BOX).setScale(0.8);
            
            /** 카드 비용 텍스트 */
            const costValueText = scene.add.text(costBoxImage.getCenter().x, costBoxImage.getCenter().y, cardData.cost == -1 ? "∞" : cardData.cost.toString(), costValueTextStyle).setOrigin(0.5);
            
            /** 카드 이름 텍스트 */
            const cardNameText = scene.add.text(-10, cardFrontImage.getTopCenter().y + 27, cardData.name, cardNameTextStyle).setOrigin(0.5);
            
            /** 카드 이미지 */
            const cardImage = scene.add.image(adjust.position.x, adjust.position.y, CONFIG.ATLAS.CARD_IMAGE, cardName).setScale(adjust.scale.x, adjust.scale.y);
            
            this.add([cardFrontImage, cardColorImage, titleColorImage, costBoxImage, costValueText, cardNameText, cardImage]);
        }
        else
        {
            this.add(scene.add.image(0, 0, CONFIG.IMAGE.CARD_BACK));
        }
    }

    /**
     * 카드의 오차 데이터를 반환합니다.
     * 
     * @param cardName 카드 이름
     * @returns 카드 오차 데이터
     */
    private getCardAdjustData(cardName: string): CardAdjust
    {
        const cartAdjustData = this.scene.game.cache.json.get(CONFIG.DATA.CARD_ADJUST);

        return cartAdjustData.hasOwnProperty(cardName) ? cartAdjustData[cardName] : { position: Card.imagePosition, scale: Card.imageScale };
    }

    /**
     * 카드 데이터를 반환합니다.
     * 
     * @param cardName 카드 이름
     * @returns 카드 데이터
     */
    private getCardData(cardName?: string): CardData | undefined 
    {
        const cardData: any = this.scene.game.cache.json.get(CONFIG.DATA.CARD_DATA);

        if(cardName && cardData.hasOwnProperty(cardName)) {
            return {
                name: cardData[cardName].name,
                type: cardData[cardName].type,
                ownership: cardData[cardName].ownership,
                cost: cardData[cardName].cost
            }
        }

        return undefined;
    }
}