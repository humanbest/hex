package io.humanbest.hex.champ;

import io.humanbest.hex.dec.Dec;
import io.humanbest.hex.inventory.Inventory;

public class Champ {
    
    public String name;
    public int hp = 50;
    public int maxhp = 50;
    public int defence = 0;
    public int cost = 3;
    public Dec dec = new Dec();
    public Inventory inventory = new Inventory();

    public Champ(String name) {
        this.name = name;
    }
}
