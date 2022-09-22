package kr.kro.hex.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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

    //메인페이지(나중에 꾸밀것 - 통계 데이터 등등)
    @GetMapping("/main")
    public String mainPageView(){
        return "admin/main";
    }
    
    //전체 회원 목록
    @GetMapping("/memberList")
    public String getMemberListView(AdminSearchDto searchDto, Model model){
        model.addAttribute("memberList", memberService.getMemberList());
        return "/admin/memberList";
    }

    //전체 게시글 목록
    @GetMapping("/boardList")
    public String getboardList(AdminSearchDto searchDto, Model model){
        model.addAttribute("BoardList", boardService.getBoardList());
        return "/admin/boardList";
    }

    //전체 댓글 목록
    @GetMapping("/CommentList")
    public String getCommentList(AdminSearchDto searchDto, Model model){
        model.addAttribute("CommentList",commentService.getCommentList());
        return "/admin/commentList";
    }

    //전체 캐릭터 목록
    @GetMapping("/CharacterList")
    public String getCharacterList(AdminSearchDto searchDto, Model model){
        // model.addAttribute("getCommentList",characterService.getCharacterList());
        return "/admin/characterList";
    }

    //회원 정보
    @GetMapping("/memberInfo")
    public String getMemberInfo(Member member, Model model){
        model.addAttribute("memberInfo", memberService.getMember(member));
        return "/admin/memberInfo";
    }
     


}
