package kr.kro.hex.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import kr.kro.hex.auth.PrincipalDetails;
import kr.kro.hex.config.HexProperties;
import kr.kro.hex.domain.Member;
import kr.kro.hex.dto.UpdatePasswordDto;
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

    /** 비밀번호 인코더 */
    private final PasswordEncoder passwordEncoder;
    
    /**
     * 회원가입 페이지 뷰를 반환합니다.
     *
     * @return /member/{layout}/signUpForm.html
     * @since 2022-09-08 오전 9:24
     * @version 20220908.0
     * @author Rubisco
     */
    @GetMapping(params="act=signUp")
    public String getSignUpView(@AuthenticationPrincipal PrincipalDetails uDetails) {

        if(uDetails != null) return "redirect:/";

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
     * 비밀번호 변경 페이지 뷰를 반환합니다.
     *
     * @param uDetails 인증된 회원 객체
     * @return /member/{layout}/updatePassword.html
     * @since 2022-10-08 오전 9:24
     * @version 20221008.0
     * @author Rubisco
     */
    @GetMapping(params="act=updatePassword")
    public String getUpdatePasswordView(
        @AuthenticationPrincipal PrincipalDetails uDetails,
        @RequestParam(value = "exception", required = false)String exception, 
        RedirectAttributes redirectAttributes
    ) {

        if(uDetails == null) return "redirect:/";

        if(exception != null) {
            redirectAttributes.addFlashAttribute("exception", exception);
            return "redirect:/member?act=updatePassword";
        }

        return "/member/" + hexProperties.getLayout() + "/updatePassword";
    }

    /**
     * 회원정보 페이지 뷰를 반환합니다.
     *
     * @param uDetails 인증된 회원 객체
     * @return redirect:/member/{layout}/memberInfo.html
     * @since 2022-09-08 오전 9:24
     * @version 20220908.0
     * @author Rubisco
     * @see Member
     */
    @GetMapping()
    public String getMemberInfoView(@AuthenticationPrincipal PrincipalDetails uDetails) {
        if(uDetails == null) return "redirect:/auth?act=login";
        memberService.getMember(uDetails.getMember());
        return "/member/" + hexProperties.getLayout() + "/memberInfo";
    }

    /**
     * 회원정보 수정 요청을 처리합니다.
     *
     * @param uDetails 인증된 회원 객체
     * @param name 변경된 회원 이름
     * @param nickName 변경된 닉네임
     * @param email 변경된 이메일
     * @return redirect:/member
     * @since 2022-10-10 오전 9:24
     * @version 20221010.0
     * @author Rubisco
     */
    @PatchMapping()
    public String updateMember(
        @AuthenticationPrincipal PrincipalDetails uDetails, 
        @RequestParam("name") String name,
        @RequestParam("nickName") String nickName,
        @RequestParam("email") String email
    ) {
        if(uDetails == null) return "redirect:/auth?act=login";

        Member member = Member.builder()
                .memberId(uDetails.getMember().getMemberId())
                .name(name)
                .nickName(nickName)
                .email(email)
                .build();

        memberService.updateMember(member);
        uDetails.getMember().update(member);

        return "redirect:/member";
    }

    /**
     * 비밀번호 변경 요청을 처리합니다.
     *
     * @param uDetails 인증된 회원 객체
     * @param updatePasswordDto 비밀번호 변경 객체
     * @return redirect:/member
     * @since 2022-10-10 오전 9:24
     * @version 20221010.0
     * @author Rubisco
     * @throws UnsupportedEncodingException
     */
    @PatchMapping(params="act=updatePassword")
    public String updatePassword(
        @AuthenticationPrincipal PrincipalDetails uDetails, 
        UpdatePasswordDto updatePasswordDto
    ) throws UnsupportedEncodingException {
        if(uDetails == null) return "redirect:/auth?act=login";

        String errMsg = "";

        if(!passwordEncoder.matches(updatePasswordDto.getCurrentPassword(), uDetails.getPassword()))
            errMsg =  "현재 비밀번호가 일치하지 않습니다.";

        else if(!updatePasswordDto.getPassword1().equals(updatePasswordDto.getPassword2()))
            errMsg =  "새 비밀번호가 일치하지 않습니다.";
        
        if(!errMsg.equals("")) return "redirect:/member?act=updatePassword&exception=" + URLEncoder.encode(errMsg, "UTF8");
            
        Member member = Member.builder().memberId(uDetails.getMember().getMemberId()).build();
        member.setPassword(passwordEncoder.encode(updatePasswordDto.getPassword1()));

        memberService.updatePassword(member);
        uDetails.getMember().setPassword(member.getPassword());

        return "redirect:/member";
    }

    /**
     * 회원탈퇴 요청을 처리합니다.
     *
     * @param uDetails 인증된 회원 객체
     * @return redirect:/
     * @since 2022-10-10 오전 9:24
     * @version 20221010.0
     * @author Rubisco
     * @see Member
     */
    @DeleteMapping()
    public String DeleteMember(@AuthenticationPrincipal PrincipalDetails uDetails) {
        if(uDetails == null) return "redirect:/auth?act=login";
        memberService.deleteMember(uDetails.getMember());
        return "redirect:/logout";
    }
}