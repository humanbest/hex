package kr.kro.hex.service.impl;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.junit4.SpringRunner;

import kr.kro.hex.domain.Board;
import kr.kro.hex.persistance.BoardRepository;
import kr.kro.hex.service.BoardService;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BoardServiceImplTest {

    @Autowired
    private BoardService boardservice;

    @Autowired
    private BoardRepository boardRepo;

    // @Before
    // public void dataPrepare() {
    //     for (int i = 1; i <= 200; i++) {
    //         boardservice.insertBoard(
    //             Board.builder()
    //                 .title("테스트 제목 " + i)
    //                 .content("테스트 내용 " + i)
    //                 .isNotice(false)
    //                 .categoryId(1L)
    //                 .memberId(1L)
    //                 .groupId(1L)
    //                 .build()
    //         );
    //     }
    // }

    @Test
    public void testDeleteBoard() {
        boardservice.deleteBoard(Board.builder().documentId(1L).build());
    }

    @Test
    public void testGetBoard() {
        System.out.println(
            boardservice.getBoard(Board.builder().documentId(1L).build()).getTitle()
        );
    }

    @Test
    public void testGetBoardList() {
        Page<Board> pageInfo = boardRepo.findAll(PageRequest.of(0, 20, Sort.Direction.DESC, "documentId"));
        System.out.println(pageInfo.getTotalElements());
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
