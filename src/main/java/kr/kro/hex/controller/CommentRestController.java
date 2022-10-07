package kr.kro.hex.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.kro.hex.domain.Comments;
import kr.kro.hex.service.CommentService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentRestController {
    
    private final CommentService commentService;

    @DeleteMapping()
    public ResponseEntity<Comments> deleteCommentResponse(@RequestBody Comments comment) {
        commentService.deleteComment(Comments.builder().commentId(comment.getCommentId()).build());
        return ResponseEntity.ok(comment);
    }
}
