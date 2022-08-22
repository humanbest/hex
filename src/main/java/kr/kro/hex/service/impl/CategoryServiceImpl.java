package kr.kro.hex.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.kro.hex.domain.Category;
import kr.kro.hex.persistance.CategoryRepository;
import kr.kro.hex.service.CategoryService;

import java.util.List;

/**
 * 카테고리 서비스 구현체
 * 
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-13 오후 10:59
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepo;

    @Override
    public void insertCategory(Category category) {
        categoryRepo.save(category);
    }

    @Override
    public List<Category> getCategoryList() {
        return categoryRepo.findAll();
    };

    @Override
    public Category getCategory(Category category) {
        return categoryRepo.findById(category.getCategoryId()).get();
    }

    @Override
    public void updateCategory(Category category) {
        
        categoryRepo.save(categoryRepo.findById(category.getCategoryId()).get().update(category));
    }

    @Override
    public void deleteCategory(Category category) {
        categoryRepo.deleteById(category.getCategoryId());
    }
}
