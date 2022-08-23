package kr.kro.hex.service;

import kr.kro.hex.domain.Member;

import java.util.List;

/**
 * 회원 서비스의 인터페이스
 * 
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-11 오후 3:57
 */

public interface MemberService {

    /**
     * 회원 등록하기
     *
     * @param member 회원
     * @author Rubisco
     */
    void insertMember(Member member);

    /**
     * 회원 목록 가져오기
     *
     * @author Rubisco
     */
    List<Member> getMemberList();

    /**
     * 회원 정보 가져오기
     *
     * @param memberId 회원 ID
     * @author Rubisco
     */
    Member getMember(Long memberId);


    /**
     * 회원 정보 수정하기
     *
     * @param member 회원
     * @author Rubisco
     */
    void updateMember(Member member);

    /**
     * 회원 삭제하기
     *
     * @param memberId 회원 ID
     * @author Rubisco
     */
    void deleteMember(Long memberId);
}
