package kr.kro.hex.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import kr.kro.hex.domain.Member;
import kr.kro.hex.persistance.MemberRepository;
import lombok.RequiredArgsConstructor;

//시큐리티 설정에서 loginProcessingUrl("/login");
//login 요청이 오면 자동으로 UserDetailsService 타입으로 IoC되어 있는
//loadUserByUsername 함수가 실행

// 파라미터 username은 loginform에있는 name ="username"임.
@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;


    //시큐리티 session = (내부Authentication(내부 UserDetails))
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    
        Member memberEntity = memberRepository.findById(username);
        if(memberEntity!=null){
            return new PrincipalDetails(memberEntity);
        }
        return null;
    }
}
