package kr.kro.hex.persistance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import kr.kro.hex.domain.Member;

/**
 * 회원 레포지토리
 * 
 * @since 2022-08-21 오후 10:09
 * @version 20220821.0
 * @author Rubisco
 */

public interface MemberRepository extends JpaRepository<Member, Long>  {
    
    @Query("select distinct m from Member m join fetch m.group where m.id = :id")
    Member findById(@Param("id") String id);
}