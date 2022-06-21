package io.humanbest.hex.inventory;

public class Item {

    public static enum Effect {
        HPRECOVERY
    }

    public String name;
    public Effect effect;

    public Item(String name, Effect effect) {
        this.name = name;
        this.effect = effect;
    }
}
