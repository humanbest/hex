package kr.kro.hex;

import lombok.RequiredArgsConstructor;
import nz.net.ultraq.thymeleaf.layoutdialect.LayoutDialect;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 어플리케이션 설정
 *
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-22 오후 9:16
 */

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    @Bean
    public LayoutDialect layoutDialect() {
        return new LayoutDialect();
    }
}
