package kr.kro.hex.dto;

import lombok.Data;

@Data
public class AdminBoardSearchDto {

    public static enum Category {
        title, wirter
    }
    
    private Category category;
    private String keyword;

}
