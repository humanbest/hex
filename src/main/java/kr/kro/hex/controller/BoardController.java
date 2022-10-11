package kr.kro.hex.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.kro.hex.auth.PrincipalDetails;
import kr.kro.hex.config.HexProperties;
import kr.kro.hex.domain.Board;
import kr.kro.hex.service.BoardService;
import kr.kro.hex.service.CategoryService;
import lombok.RequiredArgsConstructor;

/**
 * 게시판 컨트롤러
 *
 * @since 2022-08-20 오후 6:24
 * @version 20220823.0
 * @author Rubisco
 * @see BoardService 게시판 서비스
 * @see CategoryService 카테고리 서비스
 */

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "/community")
public class BoardController {

    /** hex 어플리케이션 설정값 주입 */
    private final HexProperties hexProperties;

    /** 한 페이지에 대한 Entity 기본 사이즈 */
    private static final int PAGE_BATCH_SIZE = 10;

    /** 게시판 서비스 */
    private final BoardService boardService;

    /** 카테고리 서비스 */
    private final CategoryService categoryService;

    /**
     * 게시글 목록의 뷰를 반환합니다.
     *
     * @param model 모델
     * @return getBoardList.html
     * @since 2022-08-20 오후 6:24
     * @version 20220823.0
     * @author Rubisco
     */
    @GetMapping()
    public String getBoardListView(
        @PageableDefault(size = 10, sort = "documentId",  direction = Sort.Direction.DESC) Pageable pageable,
        @RequestParam(value="size", required=false) Integer size,
        Model model
    ) {
        Page<Board> boardList = boardService.getBoardList(pageable);
        
        if(size == null) size = PAGE_BATCH_SIZE;

        int start = (int) Math.floor(boardList.getNumber() / PAGE_BATCH_SIZE) * PAGE_BATCH_SIZE + 1;
        int last = Math.min(start + PAGE_BATCH_SIZE - 1, boardList.getTotalPages());


        System.out.println(hexProperties.getGroup().getAdmin());

        model.addAttribute("boardList", boardList);
        model.addAttribute("size", size);
        model.addAttribute("startPage", start);
        model.addAttribute("lastPage", last);

        return "/board/" + hexProperties.getLayout() + "/getBoardList";
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
        model.addAttribute("board", boardService.getBoard(board));
        model.addAttribute("adminGroup", hexProperties.getGroup().getAdmin());
        return "/board/" + hexProperties.getLayout() + "/getBoard";
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
        model.addAttribute("categoryList", categoryService.getCategoryList());
        return "/board/" + hexProperties.getLayout() + "/insertBoard";
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
        model.addAttribute("board", boardService.getBoard(board));
        model.addAttribute("categoryList", categoryService.getCategoryList());
        return "/board/" + hexProperties.getLayout() + "/insertBoard";
    }

    /**
     * 게시글 등록 요청을 처리합니다.
     *
     * @param board 게시글
     * @return redirect:/community
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
     * @return redirect:/community/{documentId}
     * @since 2022-08-20 오후 6:24
     * @version 20220823.0
     * @author Rubisco
     * @see Board
     */
    @PatchMapping(params = "documentId")
    public String updateBoard(@AuthenticationPrincipal PrincipalDetails uDetails, Board board) {
        board = boardService.getBoard(board);
        if(uDetails.getMember().getMemberId() != board.getMember().getMemberId() 
            && !uDetails.getMember().getGroup().getGroupName().equals(hexProperties.getGroup().getAdmin())) return "/error/404";
        boardService.updateBoard(board);
        return "redirect:/community/"+board.getDocumentId();
    }

    /**
     * 게시글 삭제 요청을 처리합니다.
     *
     * @param board
     * @return redirect:/community
     * @since 2022-08-20 오후 6:24
     * @version 20220823.0
     * @author Rubisco
     */
    @DeleteMapping(params = "documentId")
    public String deleteBoard(@AuthenticationPrincipal PrincipalDetails uDetails, Board board) {
        board = boardService.getBoard(board);
        if(uDetails.getMember().getMemberId() != board.getMember().getMemberId() 
            && !uDetails.getMember().getGroup().getGroupName().equals(hexProperties.getGroup().getAdmin())) return "/error/404";
        boardService.deleteBoard(board);
        return "redirect:/community";
    }
}