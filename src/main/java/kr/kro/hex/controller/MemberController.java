package kr.kro.hex.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

import kr.kro.hex.auth.PrincipalDetails;
import kr.kro.hex.config.HexProperties;
import kr.kro.hex.domain.Member;
import kr.kro.hex.service.MemberService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "/member")
@SessionAttributes("member")
public class MemberController {

    /** hex 어플리케이션 설정값 주입 */
    private final HexProperties hexProperties;

    /** 멤버 서비스 */
    private final MemberService memberService;
    
    /**
     * 회원가입 페이지 뷰를 반환합니다.
     *
     * @return /member/{layout}/signUpForm.html
     * @since 2022-09-08 오전 9:24
     * @version 20220908.0
     * @author Rubisco
     */
    @GetMapping(params={"act=signUp"})
    public String getSignUpView(@AuthenticationPrincipal PrincipalDetails member) {

        if(member != null) return "redirect:/";

        return "/member/" + hexProperties.getLayout() + "/signUpForm";
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
        return "redirect:/auth/?act=login";
    }

    /**
     * 회원정보 페이지 뷰를 반환합니다.
     *
     * @param member 회원 객체
     * @return redirect:/member/{layout}/memberInfo.html
     * @since 2022-09-08 오전 9:24
     * @version 20220908.0
     * @author Rubisco
     * @see Member
     */
    @PostMapping()
    public String getMemberInfoView(@AuthenticationPrincipal PrincipalDetails member) {
        memberService.getMember(member.getMember());
        return "/member/" + hexProperties.getLayout() + "/memberInfo";
    }

    /**
     * 회원정보 수정 요청을 처리합니다.
     *
     * @param member 회원 객체
     * @return redirect:/member
     * @since 2022-09-08 오전 9:24
     * @version 20220908.0
     * @author Rubisco
     */
    @PatchMapping()
    public String updateMember(@AuthenticationPrincipal PrincipalDetails member) {
        memberService.updateMember(member.getMember());
        return "redirect:/member";
    }

    /**
     * 회원탈퇴 요청을 처리합니다.
     *
     * @param member 회원 객체
     * @return redirect:/
     * @since 2022-09-08 오전 9:24
     * @version 20220908.0
     * @author Rubisco
     * @see Member
     */
    @DeleteMapping()
    public String DeleteMember(@AuthenticationPrincipal PrincipalDetails member) {
        memberService.deleteMember(member.getMember());
        return "redirect:/";
    }
}