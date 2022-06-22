package io.humanbest.hex;

import java.util.ArrayList;

import io.humanbest.hex.Monster.Monster;
import io.humanbest.hex.champ.Champ;
import io.humanbest.hex.dec.Card;

public class Message {

    public Champ champ;
    public Monster monster;
    public ArrayList<Card> reminCardList;
    public ArrayList<Card> selectedCardList;
    public ArrayList<Card> usedCardList;

    public Message(Champ champ, Monster monster, ArrayList<Card> remainCardList, ArrayList<Card> selectedCardList, ArrayList<Card> usedCardList){
        this.champ = champ;
        this.reminCardList = remainCardList;
        this.selectedCardList = selectedCardList;
        this.usedCardList = usedCardList;
    }
}
