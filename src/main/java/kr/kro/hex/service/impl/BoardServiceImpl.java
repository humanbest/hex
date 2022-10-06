package kr.kro.hex.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.kro.hex.domain.Board;
import kr.kro.hex.domain.Category;
import kr.kro.hex.domain.Group;
import kr.kro.hex.domain.Member;
import kr.kro.hex.persistance.BoardRepository;
import kr.kro.hex.service.BoardService;
import lombok.RequiredArgsConstructor;

/**
 * 게시판 서비스의 구현체
 *
 * @since 2022-08-20 오후 11:04
 * @version 20220823.0
 * @author Rubisco
 * @see Board 게시판 Entity
 * @see BoardRepository 게시판 레포지토리
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardServiceImpl implements BoardService {
    
    /** 게시판 레포지토리 */
    private final BoardRepository boardRepo;

    /**
     * 게시글을 등록합니다.
     *
     * @param board 게시글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public void insertBoard(Board board) {
        board.setMember(Member.builder().memberId(board.getMemberId()).build())
            .setCategory(Category.builder().categoryId(board.getCategoryId()).build())
            .setGroup(Group.builder().GroupId(1L).build());
        
        boardRepo.save(board);
    }

    /**
     * 게시글 목록을 조회합니다.
     *
     * @return 게시글 목록
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public Page<Board> getBoardList(Pageable pageable) {
        return boardRepo.findAll(pageable);
    }

    /**
     * 게시글을 조회합니다.
     *
     * @param board 게시글
     * @return 게시글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public Board getBoard(Board board) {
        return boardRepo.findById(board.getDocumentId()).get();
    }

    /**
     * 게시글을 수정합니다.
     *
     * @param board 게시글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateBoard(Board board) {
        boardRepo.save(getBoard(board).update(board));
    }

    /**
     * 게시글을 삭제합니다.
     *
     * @param board 게시글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteBoard(Board board) {
        boardRepo.deleteById(board.getDocumentId());
    }

    @Override
    public void deleteByIdList(List<Long> idList){
        boardRepo.deleteAll();
    }

}
