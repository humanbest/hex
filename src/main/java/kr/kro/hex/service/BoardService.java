package kr.kro.hex.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import kr.kro.hex.domain.Board;
import kr.kro.hex.dto.AdminBoardSearchDto;

/**
 * 게시판 서비스의 인터페이스
 *
 * @since 2022-08-20 오후 11:04
 * @version 20220823.0
 * @author Rubisco
 * @see Board 게시판 Entity
 */

public interface BoardService {

    /**
     * 게시글을 등록합니다.
     *
     * @param board 게시글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void insertBoard(Board board);

    /**
     * 게시글 목록을 조회합니다.
     *
     * @return 게시글 목록
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    Page<Board> getBoardList(Pageable pageable);

    /**
     * documentId에 해당하는 게시글을 조회합니다.
     *
     * @param board 게시글
     * @return 게시글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    Board getBoard(Board board);

    /**
     * 게시글 수정하기
     *
     * @param board 게시글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void updateBoard(Board board);

    /**
     * 게시글 삭제하기
     *
     * @param board 게시글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void deleteBoard(Board board);

    /**
     * List에 포함된 documentId에 해당하는 게시글을 삭제합니다.
     *
     * @param documentIdList 게시글 PK의 리스트 객체입니다.
     */
    void deleteByIdList(List<Long> documentIdList);

    /**
     * List에 포함된 documentId에 해당하는 게시글을 삭제합니다.
     *
     * @param adminBoardSearchDto keyword와 category를 담고있는 객체입니다.
     */
    Page<Board> findByKeyword(AdminBoardSearchDto adminBoardSearchDto, Pageable pageable);
    
}
       
