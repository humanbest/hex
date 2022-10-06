package kr.kro.hex.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import kr.kro.hex.domain.Member;

import java.util.ArrayList;
import java.util.Collection;

public class PrincipalDetails implements UserDetails {

    private Member member; //컴포지션

    public PrincipalDetails(Member member){
        this.member = member;
    } //생성자

    //해당 User의 권한을 리턴하는 곳
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collect = new ArrayList<>();
        collect.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return "ROLE_" + member.getGroup().getGroupName();
            }
        });
        return collect;
    }

    //패스워드를 리턴
    @Override
    public String getPassword() {
        return member.getPassword();
    }

    //Id를 리턴
    @Override
    public String getUsername() {
        return member.getId();
    }

    //계정이 완료되지 않았니?
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    //계정이 잠기지 않았니?
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    //계정의 비밀번호가 만료되지 않았니? 너무오래 사용한거 아니니? ex)1년이 지나지않았니?
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //계정이 활성화되어 있니?
    @Override
    public boolean isEnabled() {

        return true;
    }
}