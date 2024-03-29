package kr.kro.hex.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "/auth")
public class SecurityController {
    
    @GetMapping(params={"act=login"})
    public String getLoginView(
        @RequestParam(value = "error", required = false)String error, 
        @RequestParam(value = "exception", required = false)String exception, 
        RedirectAttributes redirectAttributes, 
        Model model
    ) {
        if(exception != null) {
            redirectAttributes.addFlashAttribute("exception", exception);
            return "redirect:/auth?act=login";
        }
        return "member/login";
    }
    
    @GetMapping("/logout")
    public String BackToLogin(){
        return "/";
    }
}