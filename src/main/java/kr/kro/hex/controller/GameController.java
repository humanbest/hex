package kr.kro.hex.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 게임 컨트롤러
 * 
 * @since 2022-08-23 오후 10:24
 * @version 20220823.0
 * @@author Rubisco
 */
@Controller
@RequestMapping(path = "/hex")
public class GameController {

    @GetMapping()
    public String getGameView() { return "game"; }

}
