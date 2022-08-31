package kr.kro.hex.domain;

import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

/**
 * 카테고리 도메인
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
public class Category extends BaseTime {

    @Id @GeneratedValue
    private Long categoryId;

    @Column(length = 80, nullable = false, unique = true)
    private String category;

    @OneToMany(mappedBy = "category")
    private List<Board> boardList = new ArrayList<>();

    @Builder
    public Category(Long categoryId, String category) {
        this.categoryId = categoryId;
        this.category = category;
    }

    public Category update(Category category) {
        this.category = category.category;

        return this;
    }
}