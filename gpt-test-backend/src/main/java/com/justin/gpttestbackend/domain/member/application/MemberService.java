package com.justin.gpttestbackend.domain.member.application;

import com.justin.gpttestbackend.domain.member.domain.Member;
import com.justin.gpttestbackend.domain.member.domain.Role;
import com.justin.gpttestbackend.domain.member.dto.InvitationCodeRequest;
import com.justin.gpttestbackend.domain.member.dto.MemberResponse;
import com.justin.gpttestbackend.domain.member.repository.MemberRepository;
import com.justin.gpttestbackend.global.config.security.SecurityUtils;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 8;
    private static final SecureRandom random = new SecureRandom();

    @Transactional(readOnly = true)
    public MemberResponse getMyInfo() {
        return memberRepository.findById(SecurityUtils.getCurrentMemberId().orElseThrow(() -> new RuntimeException("로그인 유저 정보가 없습니다.")))
                .map(MemberResponse::from)
                .orElseThrow(() -> new RuntimeException("내 정보를 찾을 수 없습니다."));
    }

    @Transactional
    public String generateInvitationCode() {
        Long memberId = SecurityUtils.getCurrentMemberId()
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (member.getRole() != Role.PATIENT) {
            throw new RuntimeException("환자만 초대 코드를 생성할 수 있습니다.");
        }

        String code = generateUniqueCode();
        member.setInvitationCode(code);

        return code;
    }

    @Transactional
    public void registerPatientWithCode(String invitationCode) {
        Long partnerId = SecurityUtils.getCurrentMemberId()
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        Member partner = memberRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (partner.getRole() != Role.PARTNER) {
            throw new RuntimeException("파트너만 환자를 등록할 수 있습니다.");
        }

        Member patient = memberRepository.findByInvitationCode(invitationCode)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 초대 코드입니다."));

        if (patient.getInvitationCodeExpiresAt() != null && patient.getInvitationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            patient.setInvitationCode(null);
            throw new RuntimeException("초대 코드가 만료되었습니다. 새 코드를 요청하세요.");
        }

        patient.addPartner(partner);
        patient.setInvitationCode(null);
    }

    @Transactional(readOnly = true)
    public List<MemberResponse> getConnections() {
        Long currentMemberId = SecurityUtils.getCurrentMemberId()
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        Member member = memberRepository.findById(currentMemberId)
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));

        if (member.getRole() == Role.PATIENT) {
            return member.getPartners().stream()
                    .map(MemberResponse::from)
                    .collect(Collectors.toList());
        } else if (member.getRole() == Role.PARTNER) {
            return member.getPatients().stream()
                    .map(MemberResponse::from)
                    .collect(Collectors.toList());
        }

        return Collections.emptyList();
    }

    private String generateUniqueCode() {
        String code;
        do {
            code = generateRandomCode();
        } while (memberRepository.findByInvitationCode(code).isPresent());
        return code;
    }

    private String generateRandomCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
} 