package kr.kro.hex.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

/**
 * Hex 어플리케이션의 기본값을 설정하기 위한 클래스입니다.
 * 
 * @since 2022-10-09 오후 9:24
 * @version 20221009.0
 * @author Rubisco
 */
@Data
@Component
@ConfigurationProperties(prefix = "hex")
public class HexProperties {

    /** 레이아웃 기본값 */
    private static final String DEFAULT_LATOUT = "default";

    /** 레이아웃 */
    private String layout;

    /** 그룹 */
    private DefaultGroupProperties group = new DefaultGroupProperties();

    /** 관리자 계정 */
    private DefaultAdminProperties admin = new DefaultAdminProperties();

    /**
     * 레이아웃의 이름을 반환합니다.
     * @return 레이아웃 이름
     */
    public String getLayout() {
        return layout != null ? layout : DEFAULT_LATOUT; 
    }
}
