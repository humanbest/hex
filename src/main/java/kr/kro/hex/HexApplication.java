package kr.kro.hex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * HEX 웹 어플리케이션
 *
 * @since 2022-08-20 오후 9:09
 * @version 20220821.0
 * @author Rubisco
 */
@EnableJpaAuditing
@SpringBootApplication
public class HexApplication {

    public static void main(String[] args) {
        SpringApplication.run(HexApplication.class, args);
    }
}