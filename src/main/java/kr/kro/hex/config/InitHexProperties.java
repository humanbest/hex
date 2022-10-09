package kr.kro.hex.config;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Component;

import kr.kro.hex.domain.Group;
import kr.kro.hex.domain.Member;
import kr.kro.hex.service.GroupService;
import kr.kro.hex.service.MemberService;
import lombok.RequiredArgsConstructor;

/**
 * Hex 어플리케이션의 설정을 초기화하는 클래스입니다.
 * 
 * @since 2022-10-09 오후 9:24
 * @version 20221009.0
 * @author Rubisco
 */
@Component
@RequiredArgsConstructor
public class InitHexProperties {
    
    /** 그룹 서비스 주입 */
    private final GroupService groupService;

    /** 회원 서비스 주입 */
    private final MemberService memberService;

    /** 어플리케이션 설정 객체 주입 */
    private final HexProperties hexProperties;

    /**
     * 의존성 주입이 완료되면 어플리케이션 설정을 초기화 합니다.
     */
    @PostConstruct
    private void initProperties() {

        Group adminGroup = Group.builder().groupName(hexProperties.getGroup().getAdmin()).build();
        Group generalGroup = Group.builder().groupName(hexProperties.getGroup().getGeneral()).build();
        
        if((groupService.getGroup(adminGroup)) == null) adminGroup = groupService.insertGroup(adminGroup);
        if(groupService.getGroup(generalGroup) == null) generalGroup = groupService.insertGroup(generalGroup);

        Member admin = hexProperties.getAdmin().toMember().setGroup(adminGroup);

        if(memberService.getMember(admin) == null) memberService.insertMember(admin);
    }
}
