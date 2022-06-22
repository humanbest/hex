package io.humanbest.hex;
import java.util.*;

import io.humanbest.hex.Monster.Monster;
import io.humanbest.hex.champ.Champ;
import io.humanbest.hex.dec.Card;

public class Action {


    public static Action combat(A action) {
        
        for(int i=0; i<action.selectedCardList.size(); i++) {
            Card card = action.selectedCardList.get(i);
            
            if(card.type.equals(Card.Type.ATTACK)) {
                action.monster.hp -= card.typeValue;
            }
        }
        return action;
    }
    
}
