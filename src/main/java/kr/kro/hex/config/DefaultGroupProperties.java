package kr.kro.hex.config;

import lombok.Data;

/**
 * 회원 등급의 기본값을 설정하기 위한 클래스입니다.
 * 
 * @since 2022-10-09 오후 9:24
 * @version 20221009.0
 * @author Rubisco
 */
@Data
public class DefaultGroupProperties {
    
    /** 기본 Admin 그룹 이름 */
    private static final String DEFAULT_ADMIN = "Admin";
    
    /** 기본 일반 그룹 이름 */
    private static final String DEFAULT_GENERAL = "Bronze";

    /** Admin 그룹 이름 */
    private String admin;

    /** 일반 그룹 이름 */
    private String general;

    /**
     * Admin 그룹의 이름을 반환합니다.
     * @return Admin 그룹 이름
     */
    public String getAdmin() {
        return admin != null ? admin : DEFAULT_ADMIN;
    }

    /**
     * 일반 그룹의 이름을 반환합니다.
     * @return 일반 그룹 이름
     */
    public String getGeneral() {
        return general != null ? general : DEFAULT_GENERAL;
    }
}
