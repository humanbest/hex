package kr.kro.hex.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.kro.hex.domain.Member;
import kr.kro.hex.service.MemberService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "/member")
public class MemberController {

    /** 멤버 서비스 */
    private final MemberService memberService;
    
    @GetMapping(params={"act=login"})
    public String getLoginView() {
        return "member/login";
    }

    @GetMapping(params={"act=signUp"})
    public String getSignUpView() {
        return "member/signUpForm";
    }

    /**
     * 회원가입 요청을 처리합니다.
     *
     * @param member 회원 객체
     * @return redirect:/
     * @since 2022-09-08 오전 9:24
     * @version 20220908.0
     * @author Rubisco
     * @see Member
     */
    @PostMapping()
    public String insertMember(Member member) {
        memberService.insertMember(member);
        return "redirect:/";
    }
}
