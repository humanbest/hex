package io.humanbest.hex.champ;

import io.humanbest.hex.dec.Card;
import io.humanbest.hex.dec.Dec;
import io.humanbest.hex.inventory.Inventory;

import java.util.ArrayList;

public class Champ {
    
    public String name;
    public int hp = 50;
    public int maxhp = 50;
    public int defence = 0;
    public int cost = 3;
    public ArrayList<Card> dec = new ArrayList<>();
    public Inventory inventory = new Inventory();

    public Champ(String name) {
        this.name = name;
    }
}
