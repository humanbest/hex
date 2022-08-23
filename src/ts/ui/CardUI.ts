import { Vector } from "matter";
import { CONFIG } from "../config";
import { cardAdjust, CardAttribute, CardConfig } from "../interface/Interface";

export default class Card extends Phaser.GameObjects.Container 
{
    public static width: number = 200;
    public static height: number = 300;
    public static maxAngle: number = 30;
    public static scale: number = 0.5;

    private static imagePosition: Vector = { x: 0, y: -35 };
    private static imageScale: Vector = { x: 0.7, y: 0.7 };
    private static imageColor: {[key: string] : number} = {
        attack: 0x923a37,
        defense: 0x252a37,
        buff: 0x71915c
    }
    private static titleColor: {[key: string] : number} = {
        attack:0xffbb9d,
        defense: 0x9fdbe1,
        buff: 0xc2d6b5
    }
    
    private isSelected: boolean = false;

    constructor(parentContainer: Phaser.GameObjects.Container, cardName: string, config: CardConfig, isFront?: boolean) 
    {
        super(parentContainer.scene, 0, 0);

        const scene = parentContainer.scene;

        this.setSize(Card.width, Card.height)
            .setPosition(-Card.width, parentContainer.height / 2)
            .setScale(Card.scale)
            .setInteractive()
            .on("pointerover", this.pointerOver)
            .on("pointerout", this.pointerOut)
            .on("pointerdown", this.pointerDown)
            .on("pointermove", this.pointerMove);

        if(isFront)
        {
            let type: string;

            if(config.effect instanceof Array) {
                type = "attack";
            }
            else
            {
                switch (config.effect.type) {
                    case CardAttribute.ATTACK: type = "attack"; break;
                    case CardAttribute.DEFENSE: type = "defense"; break;
                    default: type = "buff"; break;
                }
            }
            
            const costValueTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
                fontFamily: "neodgm",
                fontSize: "20px",
                color: "#f4efe8",
                stroke: "#695a45",
                strokeThickness: 5
            }

            const cardNameTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
                fontFamily: "neodgm",
                fontSize: "18px",
                color: "#f4efe8",
                stroke: "#695a45",
                strokeThickness: 5
            }

            const adjust = this.getCardAdjustData(cardName);

            const cardFrontImage = scene.add.image(0, 0, CONFIG.SPRITE.CARD_BASE, CONFIG.IMAGE.CARD_FRONT);
            const cardColorImage = scene.add.image(0, cardFrontImage.getTopCenter().y, CONFIG.SPRITE.CARD_BASE, CONFIG.IMAGE.CARD_COLOR).setOrigin(0.5, 0).setTint(Card.imageColor[type]);
            const titleColorImage = scene.add.image(0, cardFrontImage.getTopCenter().y, CONFIG.SPRITE.CARD_BASE, CONFIG.IMAGE.TITLE_COLOR).setOrigin(0.5, 0).setTint(Card.titleColor[type]);
            const costBoxImage = scene.add.image(cardFrontImage.getTopLeft().x + 7, cardFrontImage.getTopLeft().y + 10, CONFIG.SPRITE.CARD_BASE, CONFIG.IMAGE.COST_BOX).setScale(0.8);
            const costValueText = scene.add.text(costBoxImage.getCenter().x, costBoxImage.getCenter().y, config.cost == -1 ? "∞" : config.cost.toString(), costValueTextStyle).setOrigin(0.5);
            const cardNameText = scene.add.text(-10, cardFrontImage.getTopCenter().y + 27, config.name, cardNameTextStyle).setOrigin(0.5);
            const cardImageImage = scene.add.image(adjust.position.x, adjust.position.y, CONFIG.SPRITE.CARD_IMAGE, cardName).setScale(adjust.scale.x, adjust.scale.y);
            
            this.add([cardFrontImage, cardColorImage, titleColorImage, costBoxImage, costValueText, cardNameText, cardImageImage]);
        }
    }

    private getCardAdjustData(cardName: string): cardAdjust
    {
        const cartAdjustData = this.scene.game.cache.json.get(CONFIG.DATA.CARD_ADJUST);

        return cartAdjustData.hasOwnProperty(cardName) ? cartAdjustData[cardName] as cardAdjust : { position: Card.imagePosition, scale: Card.imageScale };
    }

    private pointerOver(): void
    {
        if(!this.isSelected)
        {
            this.parentContainer.bringToTop(this);
            this.scene.add.tween({
                targets: this,
                y: this.parentContainer.height - Card.height / 2,
                angle: 0,
                duration: 100,
                scale: 1,
                ease: 'Quad.easeInOut'
            });
        }
    }

    private pointerOut(): void 
    {   
        this.isSelected = false;
        this.parentContainer.moveTo(this, this.data.values.originIndex);
        this.scene.add.tween({
            targets: this,
            x: this.data.values.originPosition.x,
            y: this.data.values.originPosition.y,
            angle: this.data.values.originAngle,
            duration: 100,
            delay: 0,
            scaleX: this.data.values.originScale.x,
            scaleY: this.data.values.originScale.y,
            ease: 'Quad.easeInOut'
        });
    }

    private pointerDown(): void 
    {
        if(!this.isSelected) this.isSelected = true;
        else {
            this.pointerOut();
        }
    }

    private pointerMove(pointer: Phaser.Input.Pointer ): void 
    {
        if(this.isSelected) this.setPosition(pointer.x, pointer.y);
    }

    public arrange(position: Vector, angle: number, doTween?: boolean): this 
    {
        if(doTween == undefined) doTween = false;

        this.scene.add.tween({
            targets: this,
            x: position.x,
            y: position.y,
            angle: angle,
            duration: 300,
            delay: doTween ? (this.parentContainer.length - 1) * 300 : 0
        });

        return this;
    }
}