package kr.kro.hex.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.kro.hex.domain.Comments;
import kr.kro.hex.service.CommentService;

/**
 * @author : Rubisco
 * @version : 1.0.0
 * @package : practice.jpa.board.controller
 * @name : CommentController.java
 * @date : 2022-08-08 오후 6:24
 * @modifyed :
 * @description : 댓글 컨트롤러
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
     * @author Rubisco
     */
    @DeleteMapping(params = "commentId")
    public String deleteComment(Comments comment) {
        commentService.deleteComment(comment);
        return "redirect:/board/"+ comment.getDocumentId();
    }
}
