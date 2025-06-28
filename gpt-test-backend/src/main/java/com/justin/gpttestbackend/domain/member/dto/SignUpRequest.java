package com.justin.gpttestbackend.domain.member.dto;

import com.justin.gpttestbackend.domain.member.domain.Member;
import com.justin.gpttestbackend.domain.member.domain.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

@Getter
@NoArgsConstructor
public class SignUpRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    private String name;

    @NotBlank
    private String contact;

    private Role role;

    private String invitationCode;

    public Member toMember(PasswordEncoder passwordEncoder) {
        return Member.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .name(name)
                .contact(contact)
                .role(role)
                .build();
    }
} 