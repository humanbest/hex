package io.humanbest.hex.map;

import java.util.ArrayList;

public class Map {
    
    public ArrayList<Coordinate> coordinateList = new ArrayList<>();

    public void createCoordinate(Coordinate coordinate) {
        this.coordinateList.add(coordinate);
    }
}
