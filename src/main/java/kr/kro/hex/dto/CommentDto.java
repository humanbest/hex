package kr.kro.hex.dto;

import groovy.transform.builder.Builder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    
    private Long commentId;
    private String content;
    private Long likeCount;
    private Long dislikeCount;
    private Long documentId;
}
