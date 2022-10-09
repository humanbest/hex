package kr.kro.hex.domain;

import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

/**
 * 등급 도메인
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
@Table(name="member_group")
public class Group extends BaseTime {

    @Id @GeneratedValue
    private Long groupId;

    @Column(length = 80, nullable = false, unique = true)
    private String groupName;

    @OneToMany(mappedBy = "group")
    private List<Board> boardList = new ArrayList<>();

    @OneToMany(mappedBy = "group")
    private List<Member> memberList = new ArrayList<>();

    @Builder
    public Group(Long groupId, String groupName) {
        this.groupId = groupId;
        this.groupName = groupName;
    }

    public Group update(Group group) {
        this.groupName = group.groupName;

        return this;
    }
}