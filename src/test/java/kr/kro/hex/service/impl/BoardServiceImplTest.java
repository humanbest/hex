package kr.kro.hex.service.impl;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import kr.kro.hex.domain.Board;
import kr.kro.hex.service.BoardService;


@RunWith(SpringRunner.class)
@SpringBootTest
public class BoardServiceImplTest {

    @Autowired
    private BoardService boardservice;

    @Test
    public void testDeleteBoard() {
        boardservice.deleteBoard(
            boardservice.getBoard(
                Board.builder().documentId(1L).build()
            )
        );
    }

    @Test
    public void testGetBoard() {
        System.out.println(
            boardservice.getBoard(
                Board.builder().documentId(1L).build()
            ).getTitle()
        );
    }

    @Test
    public void testGetBoardList() {
        for (Board board : boardservice.getBoardList()) {
            System.out.println(board.getTitle());
        }
    }

    @Test
    public void testInsertBoard() {
        boardservice.insertBoard(
            Board.builder()
                .isNotice(false)
                .title("테스트 제목")
                .content("테스트 내용")
                .build()
        );
    }

    @Test
    public void testUpdateBoard() {
        boardservice.updateBoard(
            Board.builder()
                .documentId(1L)
                .title("제목 수정")
                .content("내용 수정")
                .build()
        );
    }
}
