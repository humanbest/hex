package kr.kro.hex.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 페이지 컨트롤러
 *
 * @since 2022-09-08 오후 11:24
 * @version 20220908.0
 * @author Rubisco
 * @see BoardService 게시판 서비스
 * @see CategoryService 카테고리 서비스
 */
@Controller
public class PageController {

    /**
     * 게임에 접속하기 위한 페이지뷰를 반환합니다.
     *
     * @return game.html
     * @since 2022-09-08 오후 11:24
     * @version 20220908.0
     * @author Rubisco
     */
    @GetMapping("/hex")
    public String getGameView() { return "game"; }

}
