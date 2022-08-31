package kr.kro.hex.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.kro.hex.domain.Member;
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

    /**
     * 회원 등록하기
     *
     * @param member 회원
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public void insertMember(Member member) {
        memberRepo.save(member);
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
        return memberRepo.findById(member.getMemberId()).get();
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
    public void deleteMember(Member member) {
        memberRepo.deleteById(member.getMemberId());
    };
}
