package kr.kro.hex.service;

import kr.kro.hex.domain.Comments;

import java.util.List;

/**
 * 댓글 서비스의 인터페이스
 * 
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-23 오전 11:23
 */

public interface CommentService {

    /**
     * 댓글 등록하기
     *
     * @param comments 댓글
     * @author Rubisco
     */
    void insertComment(Comments comment);

    /**
     * 댓글 전체 목록 가져오기
     *
     * @author Rubisco
     */
    List<Comments> getCommentList();

    /**
     * 댓글 가져오기
     *
     * @param commentId 댓글 ID
     * @author Rubisco
     */
    Comments getComment(Long commentId);

    /**
     * 댓글 수정하기
     *
     * @param comments 댓글
     * @author Rubisco
     */
    void updateComment(Comments comment);

    /**
     * 댓글 삭제하기
     *
     * @param commentId 댓글 ID
     * @author Rubisco
     */
    void deleteComment(Long commentId);
}