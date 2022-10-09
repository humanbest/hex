package kr.kro.hex.config;

import kr.kro.hex.domain.Member;
import lombok.Data;

/**
 * Admin 계정의 기본값을 설정하기 위한 클래스입니다.
 * 
 * @since 2022-10-09 오후 9:24
 * @version 20221009.0
 * @author Rubisco
 */
@Data
public class DefaultAdminProperties {

    private static final String ID = "admin";
    private static final String PASSWORD = "admin";
    private static final String EMAIL = "admin@hex.kro.kr";
    private static final String NAME = "admin";
    private static final String NICK_NAME = "관리자";
    
    private String id;
    private String password;
    private String email;
    private String name;
    private String nickName;

    public String getId() {
        return id != null ? id : ID;
    }

    public String getPassword() {
        return password != null ? password : PASSWORD;
    }

    public String getEmail() {
        return email != null ? email : EMAIL;
    }

    public String getName() {
        return name != null ? name : NAME;
    }

    public String getNickName() {
        return nickName != null ? nickName : NICK_NAME;
    }

    public Member toMember() {
        return Member.builder()
                .id(getId())
                .password(getPassword())
                .email(getEmail())
                .name(getName())
                .nickName(getNickName())
                .build();
    }
}
