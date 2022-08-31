package kr.kro.hex.service.impl;

import kr.kro.hex.domain.Board;
import kr.kro.hex.domain.Comments;
import kr.kro.hex.domain.Member;
import kr.kro.hex.persistance.CommentRepository;
import kr.kro.hex.service.CommentService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 댓글 서비스 구현체
 * 
 * @since 2022-08-20 오후 11:04
 * @version 20220823.0
 * @author Rubisco
 * @see Comments 댓글 Entity
 * @see CommentRepository 댓글 레포지토리
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

    /** 댓글 레포지토리 */
    private final CommentRepository commentRepo;

    /**
     * 댓글을 등록합니다.
     *
     * @param comments 댓글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public void insertComment(Comments comment) {
        comment.setBoard(Board.builder().documentId(comment.getDocumentId()).build())
            .setMember(Member.builder().memberId(comment.getMemberId()).build());

        commentRepo.save(comment);
    };

        /**
     * 댓글 전체 목록을 조회합니다.
     *
     * @return 전체 댓글 목록
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public List<Comments> getCommentList() {
        return commentRepo.findAll();
    };
    
    /**
     * 댓글을 조회합니다.
     *
     * @param comment 댓글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public Comments getComment(Comments comment) {
        return commentRepo.findById(comment.getCommentId()).get();
    };

    /**
     * 댓글을 수정합니다.
     *
     * @param comments 댓글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateComment(Comments comment) {
        commentRepo.save(getComment(comment).update(comment));
    };

    /**
     * 댓글을 삭제합니다.
     *
     * @param comment 댓글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteComment(Comments comment) {
        commentRepo.deleteById(comment.getCommentId());
    };
}