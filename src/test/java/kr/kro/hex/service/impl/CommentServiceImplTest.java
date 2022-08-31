package kr.kro.hex.service.impl;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import kr.kro.hex.domain.Comments;
import kr.kro.hex.service.CommentService;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CommentServiceImplTest {
    
    @Autowired
    private CommentService commentService;

    @Test
    public void testDeleteComment() {
        commentService.deleteComment(Comments.builder().commentId(5L).build());
    }

    @Test
    public void testGetComment() {
        System.out.println(commentService.getComment(Comments.builder().commentId(4L).build()).getContent());
    }

    @Test
    public void testGetCommentList() {
        for(Comments comment : commentService.getCommentList()) {
            System.out.println(comment.getContent());
        }
    }

    @Test
    public void testInsertComment() {
        commentService.insertComment(
            Comments.builder()
                .documentId(4L)
                .memberId(1L)
                .content("e")
                .build()
        );
    }

    @Test
    public void testUpdateComment() {
        commentService.updateComment(
            Comments.builder()
                .commentId(5L)
                .content("f")
                .build()  
        );
    }
}
