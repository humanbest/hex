package kr.kro.hex.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "/auth")
public class SecurityController {

    /**임시 접근**/
    @GetMapping("/user")
    public @ResponseBody String user() {
        return "user";
    }

    @GetMapping("/admin")
    public @ResponseBody String admin() {
        return "admin";
    }

    @GetMapping("/manager")
    public @ResponseBody String manager() {
        return "manager";
    }
    
    @GetMapping(params={"act=login"})
    public String getLoginView(@RequestParam(value = "error", required = false)String error,
        @RequestParam(value = "exception", required = false)String exception,Model model) {
        
        model.addAttribute("error", error);
        model.addAttribute("exception", exception);
        return "member/login";
    }
}