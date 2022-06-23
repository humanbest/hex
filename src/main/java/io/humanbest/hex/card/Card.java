package io.humanbest.hex.card;

import io.humanbest.hex.Type;

import java.util.ArrayList;

public class Card {

    //AT버프는 몬스터에게 피해를 입히는 공격적인 효과를 지닌 버프입니다
    //DF버프는 수비적인 효과를 얻을 수 있는 버프입니다
//    public static enum Type {
//        ATTACK, DEFNSE, ATBUFF, DFBUFF, DEBUFF
//    }

    public ArrayList<Type> cardTypeList;
    public String name;
    public int typeValue;
    public int cost;

    public Card(String name, Type cardType, int typeValue, int cost) {
        this.name = name;
        this.cardTypeList = new ArrayList<>();
        this.cardTypeList.add(cardType);
        this.typeValue = typeValue;
        this.cost = cost;
    }
    public Card(String name, ArrayList<Type> cardTypeList, int typeValue, int cost) {
        this.name = name;
        this.cardTypeList = cardTypeList;
        this.typeValue = typeValue;
        this.cost = cost;
    }

}
