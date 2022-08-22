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

    void insertBoard(Board board);

    List<Board> getBoardList();

    Board getBoard(Board board);

    void updateBoard(Board board);

    void deleteBoard(Board board);
}
