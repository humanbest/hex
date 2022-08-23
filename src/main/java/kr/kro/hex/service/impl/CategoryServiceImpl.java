package kr.kro.hex.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.kro.hex.domain.Category;
import kr.kro.hex.persistance.CategoryRepository;
import kr.kro.hex.service.CategoryService;

import java.util.List;

/**
 * 카테고리 서비스의 구현체
 * 
 * @see Category 카테고리 Entity
 * @see CategoryRepository 카테고리 레포지토리
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-21 오후 11:06
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    /** 카테고리 레포지토리 */
    private final CategoryRepository categoryRepo;

    /**
     * 카테고리 추가하기
     *
     * @author Rubisco
     */
    @Override
    public void insertCategory(Category category) {
        categoryRepo.save(category);
    }

    /**
     * 카테고리 목록 가져오기
     *
     * @param category 카테고리
     * @return 카테고리 목록
     * @author Rubisco
     */
    @Override
    public List<Category> getCategoryList() {
        return categoryRepo.findAll();
    };

    /**
     * 카테고리 가져오기
     *
     * @param categoryId 카테고리 ID
     * @author Rubisco
     */
    @Override
    public Category getCategory(Long categoryId) {
        return categoryRepo.findById(categoryId).get();
    }

    /**
     * 카테고리 수정하기
     *
     * @param category 카테고리
     * @author Rubisco
     */
    @Override
    public void updateCategory(Category category) {
        categoryRepo.save(getCategory(category.getCategoryId()).update(category));
    }

    /**
     * 카테고리 삭제하기
     *
     * @param categoryId 카테고리 ID
     * @author Rubisco
     */
    @Override
    public void deleteCategory(Long categoryId) {
        categoryRepo.deleteById(categoryId);
    }
}
