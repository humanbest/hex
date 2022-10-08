package kr.kro.hex.config;

import lombok.RequiredArgsConstructor;
import nz.net.ultraq.thymeleaf.layoutdialect.LayoutDialect;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 어플리케이션 설정
 *
 * @since 2022-08-20 오후 10:04
 * @version 20220823.0
 * @author Rubisco
 */
@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    @Bean
    public LayoutDialect layoutDialect() {
        return new LayoutDialect();
    }
}
