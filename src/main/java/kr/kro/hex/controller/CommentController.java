package kr.kro.hex.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.kro.hex.domain.Comments;
import kr.kro.hex.service.CommentService;

/**
 * 댓글 컨트롤러
 * 
 * @since 2022-08-20 오후 6:24
 * @version 20220823.0
 * @@author Rubisco
 */
@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/comment")
public class CommentController {

    /** 댓글 서비스 */
    private final CommentService commentService;

    /**
     * 댓글 등록 요청을 처리합니다.
     *
     * @param comment
     * @return string
     * @since 2022-08-23 오후 6:24
     * @version 20220823.0
     * @author Rubisco
     */
    @PostMapping(params = "documentId")
    public String insertComment(Comments comment) {
        commentService.insertComment(comment);
        return "redirect:/board/" + comment.getDocumentId();
    }

    /**
     * 댓글 삭제 요청을 처리합니다.
     *
     * @param comment
     * @return string
     * @since 2022-08-23 오후 6:24
     * @version 20220823.0
     * @author Rubisco
     */
    @DeleteMapping(params = {"documentId", "commentId"})
    public String updateComment(Comments comment) {
        commentService.deleteComment(comment);
        return "redirect:/board/"+ comment.getDocumentId();
    }

    /**
     * 댓글 삭제 요청을 처리합니다.
     *
     * @param comment
     * @return string
     * @since 2022-08-23 오후 6:24
     * @version 20220823.0
     * @author Rubisco
     */
    @DeleteMapping(params = {"documentId", "commentId"})
    public String deleteComment(Comments comment) {
        commentService.deleteComment(comment);
        return "redirect:/board/"+ comment.getDocumentId();
    }
}
