package kr.kro.hex.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import kr.kro.hex.domain.Member;
import kr.kro.hex.service.MemberService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "/member")
@SessionAttributes("member")
public class MemberController {

    /**임시 접근**/
    @GetMapping("/user")
    public @ResponseBody String user() {
        return "user";
    }

    @GetMapping("/admin")
    public @ResponseBody String admin() {
        return "admin";
    }

    @GetMapping("/manager")
    public @ResponseBody String manager() {
        return "manager";
    }

    /** 멤버 서비스 */
    private final MemberService memberService;
    
    @GetMapping(params={"act=login"})
    public String getLoginView(@RequestParam(value = "error", required = false)String error,
        @RequestParam(value = "exception", required = false)String exception,Model model) {
        
        model.addAttribute("error", error);
        model.addAttribute("exception", exception);
        return "member/login";
    }

    // @GetMapping(params={"act=login"})
    // public String login(Member member, Model model) {
    //     Member findMember = memberService.getMember(member);

    //     if(findMember != null && findMember.getPassword().equals(member.getPassword())) {
    //         model.addAttribute("member", findMember);
    //         return "redirect:/community";
    //     }
    //     return "redirect:/member?act=login";
    // }

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
