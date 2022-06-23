package io.humanbest.hex.champ;

import io.humanbest.hex.card.Card;
import io.humanbest.hex.inventory.Item;

import java.util.ArrayList;

public class Champ {
    
    public String name;
    public int hp;
    public int defense;
    public int cost;
    public ArrayList<Card> cardList;
    public ArrayList<Item> itemList;

    public Champ(String name, int hp, int defense, int cost) {
        this.name = name;
        this.defense = defense;
        this.hp = hp;
        this.cost = cost;
        this.cardList = new ArrayList<>();
        this.itemList = new ArrayList<>();
    }
    public Champ(String name, int hp, int defense, int cost,ArrayList<Card> cardList, ArrayList<Item> itemList){
        this.name = name;
        this.defense = defense;
        this.hp = hp;
        this.cost = cost;
        this.cardList = cardList;
        this.itemList = itemList;
    }

}
