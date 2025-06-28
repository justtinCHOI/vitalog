package com.justin.gpttestbackend.domain.member.dto;

import com.justin.gpttestbackend.domain.member.domain.Member;
import com.justin.gpttestbackend.domain.member.domain.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
public class MemberResponse {
    private final Long id;
    private final String username;
    private final String name;
    private final String contact;
    private final Role role;

    @Builder
    public MemberResponse(Long id, String username, String name, String contact, Role role) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.contact = contact;
        this.role = role;
    }

    public static MemberResponse from(Member member) {
        return MemberResponse.builder()
                .id(member.getId())
                .username(member.getUsername())
                .name(member.getName())
                .contact(member.getContact())
                .role(member.getRole())
                .build();
    }
} 