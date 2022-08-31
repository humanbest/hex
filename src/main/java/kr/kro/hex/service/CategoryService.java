package kr.kro.hex.service;

import java.util.List;

import kr.kro.hex.domain.Category;

/**
 * 카테고리 서비스의 인터페이스
 *
 * @since 2022-08-20 오후 11:04
 * @version 20220823.0
 * @author Rubisco
 * @see Category 카테고리 Entity
 */

public interface CategoryService {

    /**
     * 카테고리를 등록합니다.
     *
     * @param category 카테고리
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void insertCategory(Category category);

    /**
     * 카테고리를 목록을 조회합니다.
     *
     * @return 카테고리 목록
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    List<Category> getCategoryList();
    
    /**
     * 카테고리를 조회합니다.
     *
     * @param category 카테고리
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    Category getCategory(Category category);

    /**
     * 카테고리를 수정합니다.
     *
     * @param category 카테고리
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void updateCategory(Category category);

    /**
     * 카테고리를 삭제합니다.
     *
     * @param category 카테고리
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void deleteCategory(Category category);
}