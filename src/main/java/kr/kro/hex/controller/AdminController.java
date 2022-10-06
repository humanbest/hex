package kr.kro.hex.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.kro.hex.domain.Board;
import kr.kro.hex.domain.Member;
import kr.kro.hex.dto.AdminSearchDto;
import kr.kro.hex.service.BoardService;
import kr.kro.hex.service.CommentService;
import kr.kro.hex.service.MemberService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/admin")
public class AdminController {

    public final MemberService memberService;
    public final BoardService boardService;
    public final CommentService commentService;
    // public final CharacterService characterService;

    private static final String LAYOUT = "admin";

    //메인페이지(나중에 꾸밀것 - 통계 데이터 등등)
    @GetMapping()
    public String mainPageView(){
        return "admin/" + LAYOUT + "/main";
    }


    /*회원 관련*/
    
    //전체 회원 목록
    @GetMapping("/member")
    public String getMemberListView(AdminSearchDto searchDto, Model model){
        model.addAttribute("memberList", memberService.getMemberList());
        return "/admin/" + LAYOUT + "/getList";
    }
    //회원 상세
    @GetMapping("/member/{memberId}")
    public String getMemberInfo(Member member, Model model){
        model.addAttribute("member", memberService.getMember(member));
        return "/admin/" + LAYOUT +"/getMember";
    }

    /*게시글 관련*/

    //전체 게시글 목록
    @GetMapping("/board")
    public String getboardList(AdminSearchDto searchDto, Model model){
        model.addAttribute("boardList", boardService.getBoardList());
        return "/admin/" + LAYOUT + "/getList";
    }
    //게시판 상세
    @GetMapping("/board/{documentId}")
    public String getBoardInfo(Board board, Model model){
        Board boardDetails = boardService.getBoard(board);
        model.addAttribute("getBoardDetails",boardDetails);
        return "admin/" + LAYOUT +"/getBoardDetails";
    }

    //게시글 삭제
    @GetMapping("/delete/{documentId}")
    public String deleteBoard(Board board){
        boardService.deleteBoard(board);
        return "redirect:/admin/board";
    }
    //게시글 선택 삭제
    // @PostMapping("delete")
    // public @ResponseBody ResponseEntity deleteBoard(@RequestParam("documentIdList") List<Long> documentIdList){

    //     return ResponseEntity.ok(documentIdList);
    // }

    /*댓글 관련*/

    //전체 댓글 목록
    @GetMapping("/comment")
    public String getCommentList(AdminSearchDto searchDto, Model model){
        model.addAttribute("commentList",commentService.getCommentList());
        return "/admin/" + LAYOUT + "/getList";
    }


    /*캐릭터 관련*/

    //전체 캐릭터 목록
    @GetMapping("/character")
    public String getCharacterList(AdminSearchDto searchDto, Model model){
        // model.addAttribute("getCommentList",characterService.getCharacterList());
        return "/admin/" + LAYOUT + "/getList";
    }

    

    
     
}
