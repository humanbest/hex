package io.humanbest.hex;

import io.humanbest.hex.Monster.Monster;
import io.humanbest.hex.champ.Champ;
import io.humanbest.hex.dec.Dec;

public class Message {

    public Champ champ;
    public Monster monster;
    public Dec dec;

    public Message(Champ champ, Monster monster, Dec dec){
        this.champ = champ;
        this.dec = dec;
    }
}
