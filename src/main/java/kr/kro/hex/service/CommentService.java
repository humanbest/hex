package kr.kro.hex.service;

import kr.kro.hex.domain.Comments;

import java.util.List;

/**
 * 댓글 서비스의 인터페이스
 * 
 * @since 2022-08-20 오후 11:04
 * @version 20220823.0
 * @author Rubisco
 */

public interface CommentService {

    /**
     * 댓글을 등록합니다.
     *
     * @param comment 댓글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void insertComment(Comments comment);

    /**
     * 댓글 전체 목록을 조회합니다.
     *
     * @author Rubisco
     */
    List<Comments> getCommentList();

    /**
     * 댓글을 조회합니다.
     *
     * @param comment 댓글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    Comments getComment(Comments comment);

    /**
     * 댓글을 수정합니다.
     *
     * @param comment 댓글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void updateComment(Comments comment);

    /**
     * 댓글을 삭제합니다.
     *
     * @param comment 댓글
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void deleteComment(Comments comment);
}