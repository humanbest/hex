package io.humanbest.hex.dec;

public class Card {

    //AT버프는 몬스터에게 피해를 입히는 공격적인 효과를 지닌 버프입니다
    //DF버프는 수비적인 효과를 얻을 수 있는 버프입니다


    public static enum Type {
        ATTACK, DEFNSE, ATBUFF, DFBUFF, DEBUFF
    }

    public Type type;
    public int typeValue;
    public int cost;
    public String name;
    public String description;

    public Card(Type type,int typeValue, int cost, String name) {
        this.type = type;
        this.typeValue = typeValue;
        this.cost = cost;
        this.name = name;
    }
}
