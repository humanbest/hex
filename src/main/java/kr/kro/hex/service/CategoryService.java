package kr.kro.hex.service;

import java.util.List;

import kr.kro.hex.domain.Category;

/**
 * 카테고리 서비스의 인터페이스
 *
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-21 오후 11:06
 */

public interface CategoryService {

    /**
     * 카테고리 추가하기
     *
     * @param category 카테고리
     * @author Rubisco
     */
    void insertCategory(Category category);

    /**
     * 카테고리 목록 가져오기
     *
     * @return 카테고리 목록
     * @author Rubisco
     */
    List<Category> getCategoryList();
    
    /**
     * 카테고리 가져오기
     *
     * @param categoryId 카테고리 ID
     * @author Rubisco
     */
    Category getCategory(Long categoryId);

    /**
     * 카테고리 수정하기
     *
     * @param category 카테고리
     * @author Rubisco
     */
    void updateCategory(Category category);

    /**
     * 카테고리 삭제하기
     *
     * @param categoryId 카테고리 ID
     * @author Rubisco
     */
    void deleteCategory(Long categoryId);
}