package com.justin.vitalog.api.domain.member.api;

import com.justin.vitalog.api.domain.member.application.MemberService;
import com.justin.vitalog.api.domain.member.dto.InvitationCodeRequest;
import com.justin.vitalog.api.domain.member.dto.MemberResponse;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/me")
    public ResponseEntity<MemberResponse> getMyInfo() {
        return ResponseEntity.ok(memberService.getMyInfo());
    }

    @GetMapping("/me/connections")
    public ResponseEntity<List<MemberResponse>> getConnections() {
        return ResponseEntity.ok(memberService.getConnections());
    }

    @PostMapping("/me/invitation-code")
    public ResponseEntity<Map<String, String>> generateInvitationCode() {
        String code = memberService.generateInvitationCode();
        return ResponseEntity.ok(Map.of("invitationCode", code));
    }

    @PostMapping("/me/register-patient")
    public ResponseEntity<Void> registerPatientWithCode(@RequestBody InvitationCodeRequest request) {
        memberService.registerPatientWithCode(request.getInvitationCode());
        return ResponseEntity.ok().build();
    }
} 