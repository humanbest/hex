package kr.kro.hex.persistance;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import kr.kro.hex.domain.Board;

/**
 * 게시판 레포지토리
 * 
 * @since 2022-08-21 오후 10:09
 * @version 20220821.0
 * @author Rubisco
 */

public interface BoardRepository extends JpaRepository<Board, Long>  {
    
    @Override
    @Query(
        value = "select b from Board b join fetch b.member join fetch b.category join fetch b.group",
        countQuery = "select count(b) from Board b inner join b.member inner join b.category inner join b.group"
    )
    Page<Board> findAll(Pageable pageable);

    @Override
    @Query("select b from Board b join fetch b.member join fetch b.category join fetch b.group left outer join fetch b.commentList where b.documentId = :id")
    Optional<Board> findById(@Param("id") Long id);


    @Query(
        value = "select b from Board b join fetch b.member join fetch b.category join fetch b.group where b.member.id = :id",
        countQuery = "select count(b) from Board b inner join b.member inner join b.category inner join b.group where b.member.id = :id"
    )
    Page<Board> findByMemberId(@Param("id") String id, Pageable pageable);

    @Query(
        value = "select b from Board b join fetch b.member join fetch b.category join fetch b.group where b.title like %?1%",
        countQuery = "select count(b) from Board b inner join b.member inner join b.category inner join b.group where b.title like %?1%"
    )
    Page<Board> findByBoardTitle(@Param("title") String title, Pageable pageable);



    
    

}
