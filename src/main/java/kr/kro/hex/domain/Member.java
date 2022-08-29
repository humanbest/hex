package kr.kro.hex.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.util.Assert;

import lombok.*;

/**
 * 회원 도메인
 *
 * @since 2022-08-20 오후 2:09
 * @version 20220822.0
 * @author Rubisco
 */

@Getter
@Entity
@DynamicInsert
@DynamicUpdate
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(indexes = {
    @Index(columnList = "id", name = "unique_id", unique = true),
    @Index(columnList = "email", name = "unique_email", unique = true),
    @Index(columnList = "nickName", name = "unique_nick_name", unique = true),
    @Index(columnList = "createDate DESC", name = "idx_create_date"),
    @Index(columnList = "updateDate DESC", name = "idx_last_login"),
    @Index(columnList = "group_id", name = "idx_group_id")
})
public class Member extends BaseTime {

    @Id @GeneratedValue
    private Long memberId;

    @Column(length = 80, nullable = false, updatable = false, unique = true)
    private String id;

    @Column(length = 60, nullable = false)
    private String password;

    @Column(unique = true)
    private String email;

    @Column(length = 40, nullable = false)
    private String name;

    @Column(length = 40, nullable = false, unique = true)
    private String nickName;

    @Column(name="last_login")
    private LocalDateTime updateDate;

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    @OrderBy("documentId desc")
    private List<Board> boardList = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    @OrderBy("commentId desc")
    private List<Comments> commentList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id")
    private Group group;

    @Transient
    private Long groupId;

    @Builder
    public Member(
            Long memberId,
            String id,
            String password,
            String email,
            String name,
            String nickName,
            Long groupId
    ) {
        this.memberId = memberId;
        this.id = id;
        this.password = password;
        this.email = email;
        this.name = name;
        this.nickName = nickName;
        this.groupId = groupId;
    }

    public Member setGroup(Group group) {

        Assert.notNull(group, "group must not be null");

        if (this.group != null) {
            this.group.getMemberList().remove(this);
        }

        this.group = group;
        group.getMemberList().add(this);

        return this;
    }
    
    public Member setBoardList(List<Board> boardList) {
        this.boardList = boardList;
        return this;
    }

    public Member update(Member member) {
        Assert.notNull(email, "email must not be null");
        Assert.notNull(name, "name must not be null");
        Assert.notNull(nickName, "nickName must not be null");

        email = member.email;
        name = member.name;
        nickName = member.nickName;

        return this;
    }
}