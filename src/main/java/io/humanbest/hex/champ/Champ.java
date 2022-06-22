package io.humanbest.hex.champ;

import io.humanbest.hex.card.Card;
import io.humanbest.hex.inventory.Item;

import java.util.ArrayList;

public class Champ {
    
    public String name;
    public int hp = 50;
    public int maxHp = 50;
    public int defense = 0;
    public int cost = 3;
    public ArrayList<Card> cardList = new ArrayList<>();
    public ArrayList<Item> itemList = new ArrayList<>();

    public Champ(String name) {
        this.name = name;
    }
}
