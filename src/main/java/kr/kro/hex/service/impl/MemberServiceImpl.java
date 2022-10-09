package kr.kro.hex.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.kro.hex.config.HexProperties;
import kr.kro.hex.domain.Member;
import kr.kro.hex.persistance.GroupRepository;
import kr.kro.hex.persistance.MemberRepository;
import kr.kro.hex.service.MemberService;
import lombok.RequiredArgsConstructor;

/**
 * 회원 서비스의 인터페이스
 * 
 * @since 2022-08-20 오후 11:04
 * @version 20220823.0
 * @author Rubisco
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberServiceImpl implements MemberService {

    /** 회원 레포지토리 */
    private final MemberRepository memberRepo;

    /** 그룹 레포지토리 */
    private final GroupRepository groupRepo;

    /** 비밀번호 인코더 */
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    /** 어플리케이션 설정 객체 */
    private final HexProperties hexProperties;

    /**
     * 회원 등록하기
     *
     * @param member 회원
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    @Transactional
    public Member insertMember(Member member) {
        
        member.setGroup(
            groupRepo.findByGroupName(
                member.getGroup() == null ? 
                hexProperties.getGroup().getGeneral() : 
                member.getGroup().getGroupName()
            )
        ).setPassword(bCryptPasswordEncoder.encode(member.getPassword()));
        
        return memberRepo.save(member);
    };

    /**
     * 회원 정보 가져오기
     *
     * @param member 회원
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public Member getMember(Member member) {
        
        if (member.getMemberId() != null) {
            Optional<Member> findMember = memberRepo.findById(member.getMemberId());
            return findMember.isPresent() ? findMember.get() : null;
        }
        else if (member.getId() != null) return memberRepo.findById(member.getId());

        return null;
    };

    /**
     * 회원 목록 가져오기
     *
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public List<Member> getMemberList() {
        return memberRepo.findAll();
    };

    /**
     * 회원 정보 수정하기
     *
     * @param member 회원
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    @Transactional
    public void updateMember(Member member) {
        memberRepo.save(getMember(member).update(member));
    };

    /**
     * 회원 삭제하기
     *
     * @param member 회원
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    @Transactional
    public void deleteMember(Member member) {
        memberRepo.deleteById(member.getMemberId());
    };
}
