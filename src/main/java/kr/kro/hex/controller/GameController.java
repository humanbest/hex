package kr.kro.hex.controller;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Service
@RequestMapping(path = "/hex")
public class GameController {

    @GetMapping()
    public String getGameView() { return "game"; }

}
