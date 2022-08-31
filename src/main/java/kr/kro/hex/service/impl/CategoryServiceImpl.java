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
 * @since 2022-08-20 오후 11:04
 * @version 20220823.0
 * @author Rubisco
 * @see Category 카테고리 Entity
 * @see CategoryRepository 카테고리 레포지토리
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    /** 카테고리 레포지토리 */
    private final CategoryRepository categoryRepo;

    /**
     * 카테고리를 추가합니다.
     *
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public void insertCategory(Category category) {
        categoryRepo.save(category);
    }

    /**
     * 카테고리 목록을 조회합니다.
     *
     * @param category 카테고리
     * @return 카테고리 목록
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public List<Category> getCategoryList() {
        return categoryRepo.findAll();
    };

    /**
     * 카테고리를 조회합니다.
     *
     * @param category 카테고리
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public Category getCategory(Category category) {
        return categoryRepo.findById(category.getCategoryId()).get();
    }

    /**
     * 카테고리를 수정합니다.
     *
     * @param category 카테고리
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public void updateCategory(Category category) {
        categoryRepo.save(getCategory(category).update(category));
    }

    /**
     * 카테고리를 삭제합니다.
     *
     * @param categoryId 카테고리 ID
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public void deleteCategory(Category category) {
        categoryRepo.deleteById(category.getCategoryId());
    }
}
