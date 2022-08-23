package kr.kro.hex.service;

import java.util.List;

import kr.kro.hex.domain.Board;

/**
 * 게시판 서비스의 인터페이스
 *
 * @see Board 게시판 Entity
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-21 오후 11:04
 */

public interface BoardService {

    /**
     * 게시글을 등록합니다.
     *
     * @param board 게시글
     * @author Rubisco
     */
    void insertBoard(Board board);

    /**
     * 게시글 목록을 조회합니다.
     *
     * @author Rubisco
     * @return 게시글 목록
     */
    List<Board> getBoardList();

    /**
     * documentId에 해당하는 게시글을 조회합니다.
     *
     * @author Rubisco
     * @param documentId 게시글 ID
     * @return 게시글
     */
    Board getBoard(Long documentId);

    /**
     * 게시글 수정하기
     *
     * @param board 게시글
     * @author Rubisco
     */
    void updateBoard(Board board);

    
    /**
     * 게시글 삭제하기
     *
     * @param documentId 게시글 ID
     * @author Rubisco
     */
    void deleteBoard(Long documentId);
}