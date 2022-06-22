package io.humanbest.hex.dec;

import java.util.ArrayList;

public class Dec {

    public ArrayList<Card> remainCardList = new ArrayList<>();
    public ArrayList<Card> selectedCardList = new ArrayList<>();
    public ArrayList<Card> usedCardList = new ArrayList<>();

    public Dec(ArrayList<Card> remainCardList, ArrayList<Card> selectedCardList, ArrayList<Card> usedCardList) {
        this.remainCardList = remainCardList;
        this.selectedCardList = selectedCardList;
        this.usedCardList = usedCardList;
    }
}
