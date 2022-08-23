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
 * @see Comments 댓글 Entity
 * @see CommentRepository 댓글 레포지토리
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-23 오전 11:23
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

    /** 댓글 레포지토리 */
    private final CommentRepository commentRepo;

    /**
     * 댓글 등록하기
     *
     * @param comments 댓글
     * @author Rubisco
     */
    public void insertComment(Comments comment) {
        comment.setBoard(Board.builder().documentId(comment.getDocumentId()).build());
        comment.setMember(Member.builder().memberId(comment.getMemberId()).build());
        commentRepo.save(comment);
    };

    /**
     * 댓글 전체 목록 가져오기
     *
     * @author Rubisco
     * @return 전체 댓글 목록
     */
    public List<Comments> getCommentList() {
        return commentRepo.findAll();
    };

    /**
     * 댓글 가져오기
     *
     * @param commentId 댓글 ID
     * @author Rubisco
     */
    public Comments getComment(Long commentId) {
        return commentRepo.findById(commentId).get();
    };

    /**
     * 댓글 수정하기
     *
     * @param comments 댓글
     * @author Rubisco
     */
    public void updateComment(Comments comment) {
        commentRepo.save(getComment(comment.getCommentId()).update(comment));
    };

    /**
     * 댓글 삭제하기
     *
     * @param commentId 댓글 ID
     * @author Rubisco
     */
    public void deleteComment(Long commentId) {
        commentRepo.deleteById(commentId);
    };
}