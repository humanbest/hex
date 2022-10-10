package kr.kro.hex.service;

import kr.kro.hex.domain.Member;

import java.util.List;

/**
 * 회원 서비스의 인터페이스
 * 
 * @since 2022-08-20 오후 11:04
 * @version 20220823.0
 * @author Rubisco
 */

public interface MemberService {

    /**
     * 회원 등록하기
     *
     * @param member 회원
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    Member insertMember(Member member);

    /**
     * 회원 정보 가져오기
     *
     * @param member 회원
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    Member getMember(Member member);

        /**
     * 회원 목록 가져오기
     *
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    List<Member> getMemberList();

    /**
     * 회원 정보 수정하기
     *
     * @param member 회원
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void updateMember(Member member);

    /**
     * 비밀번호 수정하기
     *
     * @param member 회원 객체
     * @since 2022-10-10 오후 11:04
     * @version 20221010.0
     * @author Rubisco
     */
    void updatePassword(Member member);

    /**
     * 회원 삭제하기
     *
     * @param member 회원
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void deleteMember(Member member);
}
