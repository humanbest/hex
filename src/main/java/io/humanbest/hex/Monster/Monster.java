package io.humanbest.hex.Monster;

import java.util.ArrayList;

public class Monster {

    public static enum Skill {
        ATTACK, DEPNSE
    }
    
    public int hp;
    public int depense;
    public ArrayList<Skill> skillList = new ArrayList<>();

    public Monster(int hp, int depnse) {
        this.hp = hp;
        this.depense = depnse;
    }

    public Monster(int hp, int depnse, ArrayList<Skill> skillList) {
        this.hp = hp;
        this.depense = depnse;
        this.skillList = skillList;
    }
}
