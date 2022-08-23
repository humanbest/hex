package kr.kro.hex.domain;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.util.Assert;
import kr.kro.hex.BooleanToYNConverter;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 게시판 도메인
 *
 * @since : 2022-08-20 오후 6:18
 * @author : Rubisco
 * @version : 1.0.0
 */

@Getter
@Entity
@DynamicInsert
@DynamicUpdate
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(indexes = {
    @Index(columnList = "category_id DESC", name = "idx_category_id"),
    @Index(columnList = "isNotice DESC", name = "idx_is_notice"),
    @Index(columnList = "readedCount DESC", name = "idx_readed_count"),
    @Index(columnList = "likeCount DESC", name = "idx_like_count"),
    @Index(columnList = "dislikeCount DESC", name = "idx_dislike_count"),
    @Index(columnList = "member_id DESC", name = "idx_member_id"),
    @Index(columnList = "group_id DESC", name = "idx_group_id"),
    @Index(columnList = "createDate DESC", name = "idx_create_date"),
    @Index(columnList = "updateDate DESC", name = "idx_update_date")
})
public class Board extends BaseTime {
    
    @Id @GeneratedValue
    private Long documentId;

    @Column(length = 1)
    @ColumnDefault("'N'")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean isNotice;

    @Column(length = 250, nullable = false)
    private String title;

    @Lob @Column(nullable = false)
    private String content;

    @Column(updatable = false)
    @ColumnDefault("0")
    private Long likeCount;

    @Column(updatable = false)
    @ColumnDefault("0")
    private Long dislikeCount;

    @Column(updatable = false)
    @ColumnDefault("0")
    private Long readedCount;

    @BatchSize(size = 1000)
    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE)
    @OrderBy("commentId desc")
    private List<Comments> commentList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id")
    private Group group;

    @Transient
    private Long categoryId;

    @Transient
    private Long memberId;

    @Transient
    private Long groupId;

    @Builder
    public Board(
        Long documentId,
        Boolean isNotice, 
        String title, 
        String content,
        Long categoryId,
        Long memberId,
        Long groupId
    ) {
        this.documentId = documentId;
        this.isNotice = isNotice;
        this.title = title;
        this.content = content;
        this.categoryId = categoryId;
        this.memberId = memberId;
        this.groupId = groupId;
    }

    public Board update(Board board) {

        Assert.notNull(title, "Title must not be null");
        Assert.notNull(content, "Content must not be null");
        Assert.notNull(isNotice, "IsNotice must not be null");

        title = board.title;
        content = board.content;
        isNotice = board.isNotice;

        return this;
    }

    public void setCategory(Category category) {

        Assert.notNull(category, "member must not be null");

        if (this.category != null) {
            this.category.getBoardList().remove(this);
        }

        this.category = category;
        category.getBoardList().add(this);
    }

    public void setMember(Member member) {

        Assert.notNull(member, "member must not be null");

        if (this.member != null) {
            this.member.getBoardList().remove(this);
        }

        this.member = member;
        member.getBoardList().add(this);
    }

    public void setGroup(Group group) {

        Assert.notNull(group, "group must not be null");

        if (this.group != null) {
            this.group.getBoardList().remove(this);
        }

        this.group = group;
        group.getBoardList().add(this);
    }
}