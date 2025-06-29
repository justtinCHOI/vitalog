package com.justin.vitalog.api.domain.member.application;

import com.justin.vitalog.api.domain.member.dto.LoginRequest;
import com.justin.vitalog.api.domain.member.dto.SignUpRequest;
import com.justin.vitalog.api.domain.member.dto.TokenResponse;
import com.justin.vitalog.api.domain.member.repository.MemberRepository;
import com.justin.vitalog.api.global.config.security.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.justin.vitalog.api.domain.member.domain.Role;
import com.justin.vitalog.api.domain.member.domain.Member;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    @Transactional
    public void signup(SignUpRequest request) {
        if (memberRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("이미 가입되어 있는 유저입니다.");
        }
        Member newMember = request.toMember(passwordEncoder);
        memberRepository.save(newMember);

        if (newMember.getRole() == Role.PARTNER && request.getInvitationCode() != null && !request.getInvitationCode().isBlank()) {
            Member patient = memberRepository.findByInvitationCode(request.getInvitationCode())
                    .orElseThrow(() -> new RuntimeException("유효하지 않은 초대 코드입니다."));

            if (patient.getRole() != Role.PATIENT) {
                throw new RuntimeException("초대 코드가 유효하지 않습니다.");
            }
            patient.addPartner(newMember);
        }
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        String accessToken = tokenProvider.createToken(authentication);

        return new TokenResponse(accessToken);
    }
} 