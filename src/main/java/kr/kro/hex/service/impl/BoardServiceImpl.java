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

    @Override
    public void insertBoard(Board board) {
        board.setMember(Member.builder().memberId(board.getMemberId()).build());
        board.setCategory(Category.builder().categoryId(board.getCategoryId()).build());
        board.setGroup(Group.builder().GroupId(1L).build());

        boardRepo.save(board);
    }

    @Override
    public List<Board> getBoardList() {
        return boardRepo.findAll(Sort.by(Sort.Direction.DESC, "documentId"));
    }

    @Override
    public Board getBoard(Board board) {
        return boardRepo.findById(board.getDocumentId()).get();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateBoard(Board board) {
        boardRepo.save(getBoard(board).update(board));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteBoard(Board board) {
        boardRepo.deleteById(board.getDocumentId());
    }
}
