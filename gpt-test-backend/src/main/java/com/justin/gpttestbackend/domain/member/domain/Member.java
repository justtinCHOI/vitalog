package com.justin.gpttestbackend.domain.member.domain;

import com.justin.gpttestbackend.domain.common.model.BaseTimeEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String username; // For login

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String contact;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(unique = true)
    private String invitationCode;

    private LocalDateTime invitationCodeExpiresAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "patient_partner",
            joinColumns = @JoinColumn(name = "patient_id"),
            inverseJoinColumns = @JoinColumn(name = "partner_id"))
    private Set<Member> partners = new HashSet<>();

    @ManyToMany(mappedBy = "partners", fetch = FetchType.LAZY)
    private Set<Member> patients = new HashSet<>();

    @Builder
    public Member(String username, String password, String name, String contact, Role role, String invitationCode) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.contact = contact;
        this.role = role;
        this.invitationCode = invitationCode;
    }

    public void addPartner(Member partner) {
        this.partners.add(partner);
        partner.getPatients().add(this);
    }

    public void setInvitationCode(String invitationCode) {
        this.invitationCode = invitationCode;
        if (invitationCode != null) {
            this.invitationCodeExpiresAt = LocalDateTime.now().plusMinutes(10);
        } else {
            this.invitationCodeExpiresAt = null;
        }
    }
} 