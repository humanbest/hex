package kr.kro.hex.persistance;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.kro.hex.domain.Category;

/**
 * 카테고리 레포지토리
 * 
 * @since 2022-08-21 오후 10:09
 * @version 20220821.0
 * @author Rubisco
 */

public interface CategoryRepository extends JpaRepository<Category, Long>  {
    
}
