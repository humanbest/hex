package kr.kro.hex.dto;

import lombok.Data;

@Data
public class AdminSearchDto {

    enum Category {
        ID, EMAIL, NICKNAME
    }
    
    Category category;
    String keyword;
}
