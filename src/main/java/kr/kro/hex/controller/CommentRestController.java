package kr.kro.hex.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.kro.hex.domain.Comments;
import kr.kro.hex.service.CommentService;
import lombok.RequiredArgsConstructor;

/**
 * 댓글 API 컨트롤러
 * 
 * @since 2022-08-20 오후 6:24
 * @version 20220823.0
 * @author Rubisco
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentRestController {
    
    /** 댓글 서비스 주입 */
    private final CommentService commentService;

    /**
     * 댓글 삭제
     * 
     * 댓글을 삭제합니다.
     * 
     * @param comment 댓글 객체입니다.
     * @return
     */
    @DeleteMapping()
    public ResponseEntity<Comments> deleteCommentResponse(@RequestBody Comments comment) {
        commentService.deleteComment(Comments.builder().commentId(comment.getCommentId()).build());
        return ResponseEntity.ok(comment);
    }
}
