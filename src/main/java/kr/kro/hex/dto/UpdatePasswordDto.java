package kr.kro.hex.dto;

import lombok.Data;

@Data
public class UpdatePasswordDto {
    private String currentPassword;
    private String password1;
    private String password2;
}
