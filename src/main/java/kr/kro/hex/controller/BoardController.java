package kr.kro.hex.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.kro.hex.domain.Board;
import kr.kro.hex.service.BoardService;
import kr.kro.hex.service.CategoryService;
import lombok.RequiredArgsConstructor;

/**
 * 게시판 서비스 컨트롤러
 *
 * @see BoardService 게시판 서비스
 * @see CategoryService 카테고리 서비스
 *
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-08 오후 6:24
 */

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "/board")
public class BoardController {
    
    /** 게시판 서비스 */
    private final BoardService boardService;

    /** 카테고리 서비스 */
    private final CategoryService categoryService;

    /**
     * 게시글 목록 뷰를 반환
     *
     * @author Rubisco
     * @param model 모델
     * @return getBoardList.html
     */
    @GetMapping()
    public String getBoardListView(Model model) {
        model.addAttribute("boardList", boardService.getBoardList());
        return "/board/getBoardList";
    }

    /**
     * 게시글 뷰를 반환
     *
     * @see Board
     * @author Rubisco
     * @param board 게시글
     * @param model 모델
     * @return getBoard.html
     */
    @GetMapping("/{documentId}")
    public String getBoardView(Board board, Model model) {
        model.addAttribute("nl", System.getProperty("line.separator"));
        model.addAttribute("board", boardService.getBoard(board));
        return "/board/getBoard";
    }

    /**
     * 게시글 작성 페이지 뷰를 반환
     *
     * @author Rubisco
     * @param model 모델
     * @return insertBoard.html
     */
    @GetMapping(params = "act=write")
    public String insertBoardView(Model model) {
        model.addAttribute("categoryList", categoryService.getCategoryList());
        return "/board/insertBoard";
    }

    /**
     * 게시글 수정 페이지 뷰를 반환
     *
     * @see Board
     * @param board 게시글
     * @param model 모델
     * @return insertBoard.html
     * @author Rubisco
     */
    @GetMapping(params = {"documentId","act=update"})
    public String updateBoardView(Board board, Model model) {
        model.addAttribute("board", boardService.getBoard(board));
        model.addAttribute("categoryList", categoryService.getCategoryList());
        return "insertBoard";
    }

    /**
     * 게시글 등록 요청을 처리
     *
     * @see Board
     * @author Rubisco
     * @param board 게시글
     * @return redirect:/board
     */
    @PostMapping()
    public String insertBoardController(Board board) {
        boardService.insertBoard(board);
        return "redirect:/board";
    }

    /**
     * 게시글 수정 요청을 처리
     *
     * @see Board
     * @param board 게시글
     * @author Rubisco
     * @return redirect:/board/{documentSrl}
     */
    @PatchMapping(params = "documentSrl")
    public String updateBoard(Board board) {
        boardService.updateBoard(board);
        return "redirect:/board/"+board.getDocumentId();
    }

    /**
     * 게시글 삭제 요청을 처리
     *
     * @author Rubisco
     * @param board
     * @return redirect:/board
     */
    @DeleteMapping(params = "documentId")
    public String deleteBoard(Board board) {
        boardService.deleteBoard(board);
        return "redirect:/board";
    }
}
