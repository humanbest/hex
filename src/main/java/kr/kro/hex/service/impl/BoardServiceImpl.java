package kr.kro.hex.service.impl;

import java.util.List;

import org.springframework.data.domain.Sort;
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
 * @see Board 게시판 Entity
 * @see BoardRepository 게시판 레포지토리
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-21 오후 11:04
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
     * @author Rubisco
     */
    @Override
    public void insertBoard(Board board) {
        board.setMember(Member.builder().memberId(board.getMemberId()).build());
        board.setCategory(Category.builder().categoryId(board.getCategoryId()).build());
        board.setGroup(Group.builder().GroupId(1L).build());

        boardRepo.save(board);
    }

    /**
     * 게시글 목록을 조회합니다.
     *
     * @return 게시글 목록
     * @author Rubisco
     */
    @Override
    public List<Board> getBoardList() {
        return boardRepo.findAll(Sort.by(Sort.Direction.DESC, "documentId"));
    }

    /**
     * documentId에 해당하는 게시글을 조회합니다.
     *
     * @param documentId 게시글 ID
     * @return 게시글
     * @author Rubisco
     */
    @Override
    public Board getBoard(Long documentId) {
        return boardRepo.findById(documentId).get();
    }

    /**
     * 게시글을 수정합니다.
     *
     * @param board 게시글
     * @author Rubisco
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateBoard(Board board) {
        boardRepo.save(getBoard(board.getDocumentId()).update(board));
    }

    /**
     * 게시글을 삭제합니다.
     *
     * @param documentId 게시글 ID
     * @author Rubisco
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteBoard(Long documentId) {
        boardRepo.deleteById(documentId);
    }
}
