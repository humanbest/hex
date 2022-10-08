package kr.kro.hex.config;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
public class ModuleInterceptor implements HandlerInterceptor {
    
    @Override
    public void postHandle(
        HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView
    ) throws Exception {
        System.out.println(request.getRequestURI());
        String module = request.getRequestURI().split("/").length > 1  ? request.getRequestURI().split("/")[1] : request.getRequestURI();

        if(modelAndView != null) modelAndView.addObject("module", module);
    }
}