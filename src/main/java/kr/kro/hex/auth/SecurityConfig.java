package kr.kro.hex.auth;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import lombok.RequiredArgsConstructor;
@Configuration
@EnableWebSecurity 
@RequiredArgsConstructor
// preAuthorize 어노테이션(메서드가 실행 되기전 여러 권한을 설정할 수있음) 활성화
public class SecurityConfig {

    /* 로그인 실패 핸들러 의존성 주입 */
    private final AuthenticationFailureHandler customFailureHandler;

    private final PrincipalDetailsService principalDetailsService;
    private final DataSource dataSource;

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
            .mvcMatchers("/css/**","/js/**","/imges/**","/fonts/**","/webpageimg/**");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return 
            http
            .csrf().disable()
            .headers().frameOptions().disable()
            .and()
            .authorizeRequests()
                .mvcMatchers("/assets/**").authenticated()
                .mvcMatchers("/hex/**").authenticated()
                .mvcMatchers("/community/**").authenticated()
                .mvcMatchers("/admin/**").hasRole("Admin")
                .anyRequest().permitAll()
            .and()
            .formLogin()
                .loginPage("/auth?act=login")
                .loginProcessingUrl("/auth/login")
                .failureHandler(customFailureHandler)
                .defaultSuccessUrl("/")
            .and()
            .logout() // 로그아웃 처리
                .logoutUrl("/logout") // 로그아웃 처리 URL
                .logoutSuccessUrl("/") // 로그아웃 성공 후 이동 URL
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID", "remember-me") // 로그아웃 후 쿠키 삭제
            .and()
            .rememberMe().key("securitykey")
                .userDetailsService(principalDetailsService)
                .tokenValiditySeconds(60 * 60 * 24 * 7)
                .tokenRepository(tokenRepository())
            .and()
            .build();
    }

    @Bean
    public PersistentTokenRepository tokenRepository() {
        JdbcTokenRepositoryImpl jdbcTokenRepository = new JdbcTokenRepositoryImpl();
        jdbcTokenRepository.setDataSource(dataSource);
        return jdbcTokenRepository;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
