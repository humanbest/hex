package kr.kro.hex.domain;

import javax.persistence.*;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.util.Assert;

import lombok.*;

/**
 * 댓글 도메인
 *
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-21 오후 9:18
 **/

@Getter
@Entity
@DynamicInsert
@DynamicUpdate
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(indexes = {
    @Index(columnList = "document_id DESC", name = "idx_document_id"),
    @Index(columnList = "likeCount DESC", name = "idx_like_count"),
    @Index(columnList = "dislikeCount DESC", name = "idx_dislike_count"),
    @Index(columnList = "member_id DESC", name = "idx_member_id"),
    @Index(columnList = "createDate DESC", name = "idx_create_date"),
    @Index(columnList = "updateDate DESC", name = "idx_update_date")
})
public class Comments extends BaseTime {

    @Id @GeneratedValue
    private Long commentId;

    @Lob @Column(nullable = false)
    private String content;

    @Column(updatable = false)
    @ColumnDefault("0")
    private Long likeCount;

    @Column(updatable = false)
    @ColumnDefault("0")
    private Long dislikeCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false, updatable = false)
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="member_id", nullable = false, updatable = false)
    private Member member;

    @Transient
    private Long documentId;

    @Transient
    private Long memberId;

    @Builder
    public Comments(
            Long commentId,
            String content,
            Long documentId,
            Long memberId
    ) {
        this.commentId = commentId;
        this.content = content;
        this.documentId = documentId;
        this.memberId = memberId;
    }

    public Comments update(Comments comment) {
        Assert.notNull(content, "content must not be null");
        this.content = comment.content;
        return this;
    }

    public void setBoard(Board board) {

        if (this.board != null) {
            this.board.getCommentList().remove(this);
        }

        this.board = board;
        board.getCommentList().add(this);
    }

    public void setMember(Member member) {

        if (this.member != null) {
            this.member.getCommentList().remove(this);
        }

        this.member = member;
        member.getCommentList().add(this);
    }
}
