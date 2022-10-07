package kr.kro.hex.dto;

import kr.kro.hex.domain.Board;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BoardDto {
    
    private Long documentId;
    private Boolean isNotice;
    private String title;
    private String content;
    private String nickName;
    private String id;
    private Long likeCount;
    private Long dislikeCount;
    private Long readedCount;
    private String category;
    private String groupName;

    public BoardDto entityToDto(Board board) {
        
        documentId = board.getDocumentId();
        isNotice = board.getIsNotice();
        title = board.getTitle();
        content = board.getContent();
        nickName = board.getMember().getNickName();
        id = board.getMember().getId();
        likeCount = board.getLikeCount();
        dislikeCount = board.getDislikeCount();
        readedCount = board.getReadedCount();
        category = board.getCategory().getCategory();
        groupName = board.getGroup().getGroupName();

        return this;
    }
}
