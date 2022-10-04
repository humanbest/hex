package kr.kro.hex.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

import kr.kro.hex.domain.Board;
import kr.kro.hex.domain.Member;
import kr.kro.hex.service.BoardService;
import kr.kro.hex.service.CategoryService;
import lombok.RequiredArgsConstructor;

/**
 * 커뮤니티 컨트롤러
 *
 * @since 2022-08-20 오후 6:24
 * @version 20220823.0
 * @author Rubisco
 * @see BoardService 게시판 서비스
 * @see CategoryService 카테고리 서비스
 */

@SessionAttributes("member")
@Controller
@RequiredArgsConstructor
@RequestMapping(path = "/community")
public class CommunityController {

    /** 레이아웃 */
    private static final String LAYOUT = "example"; 

    /** 게시판 서비스 */
    private final BoardService boardService;

    /** 카테고리 서비스 */
    private final CategoryService categoryService;

    @ModelAttribute("member")
    public Member setMember() {
        return Member.builder().build();
    }

    /**
     * 커뮤니티 게시글 목록의 뷰를 반환합니다.
     *
     * @param model 모델
     * @return getBoardList.html
     * @since 2022-08-20 오후 6:24
     * @version 20220823.0
     * @author Rubisco
     */
    @GetMapping()
    public String getBoardListView(Model model) {
        model.addAttribute("boardList", boardService.getBoardList());
        return "/board/" + LAYOUT + "/getBoardList";
    }

    /**
     * 커뮤니티 게시글의 뷰를 반환합니다.
     *
     * @param board 게시글
     * @param model 모델
     * @return getBoard.html
     * @since 2022-08-20 오후 6:24
     * @version 20220908.0
     * @author Rubisco
     * @see Board
     */
    @GetMapping("/{documentId}")
    public String getBoardView(Board board, Model model) {
        model.addAttribute("nl", System.getProperty("line.separator"));
        model.addAttribute("layout", "default");
        model.addAttribute("board", boardService.getBoard(board));
        return "/board/" + LAYOUT + "/getBoard";
    }

    /**
     * 게시글 작성 페이지의 뷰를 반환합니다.
     *
     * @param model 모델
     * @return insertBoard.html
     * @since 2022-08-20 오후 6:24
     * @version 20220908.0
     * @author Rubisco
     */
    @GetMapping(params = "act=write")
    public String insertBoardView(Model model) {
        model.addAttribute("layout", "default");
        model.addAttribute("categoryList", categoryService.getCategoryList());
        return "/board/" + LAYOUT + "/insertBoard";
    }

    /**
     * 게시글 수정 페이지의 뷰를 반환합니다.
     *
     * @param board 게시글
     * @param model 모델
     * @return insertBoard.html
     * @since 2022-08-20 오후 6:24
     * @version 20220823.0
     * @author Rubisco
     * @see Board
     */
    @GetMapping(params = {"documentId","act=update"})
    public String updateBoardView(Board board, Model model) {
        model.addAttribute("layout", "default");
        model.addAttribute("board", boardService.getBoard(board));
        model.addAttribute("categoryList", categoryService.getCategoryList());
        return "/board/" + LAYOUT + "/insertBoard";
    }

    /**
     * 게시글 등록 요청을 처리합니다.
     *
     * @param board 게시글
     * @return redirect:/board
     * @since 2022-08-20 오후 6:24
     * @version 20220823.0
     * @author Rubisco
     * @see Board
     */
    @PostMapping()
    public String insertBoard(Board board) {
        boardService.insertBoard(board);
        return "redirect:/community";
    }

    /**
     * 게시글 수정 요청을 처리합니다.
     *
     * @param board 게시글
     * @return redirect:/board/{documentId}
     * @since 2022-08-20 오후 6:24
     * @version 20220823.0
     * @author Rubisco
     * @see Board
     */
    @PatchMapping(params = "documentId")
    public String updateBoard(Board board) {
        boardService.updateBoard(board);
        return "redirect:/community/"+board.getDocumentId();
    }

    /**
     * 게시글 삭제 요청을 처리합니다.
     *
     * @param board
     * @return redirect:/board
     * @since 2022-08-20 오후 6:24
     * @version 20220823.0
     * @author Rubisco
     */
    @DeleteMapping(params = "documentId")
    public String deleteBoard(Board board) {
        boardService.deleteBoard(board);
        return "redirect:/community";
    }
}
