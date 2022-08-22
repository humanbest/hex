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
     * 게시글 등록하기
     *
     * @param board 게시글
     * @author Rubisco
     */
    void insertBoard(Board board);

    /**
     * 게시글 목록 가져오기
     *
     * @author Rubisco
     * @return 게시글 목록
     */
    List<Board> getBoardList();

    /**
     * 게시글 가져오기
     *
     * @author Rubisco
     * @param board 게시글
     * @return 게시글
     */
    Board getBoard(Board board);

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
     * @param board 게시글
     * @author Rubisco
     */
    void deleteBoard(Board board);
}
