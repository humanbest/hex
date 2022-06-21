package io.humanbest.hex.inventory;

import java.util.ArrayList;

public class Inventory {
    
    public ArrayList<Item> itemList = new ArrayList<>();

    public void addItem(Item item) {
        this.itemList.add(item);
    }

}
