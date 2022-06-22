package io.humanbest.hex.dec;

public class Card {

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
