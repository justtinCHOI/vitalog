package com.justin.gpttestbackend.domain.member.repository;

import com.justin.gpttestbackend.domain.member.domain.Member;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUsername(String username);
    Optional<Member> findByInvitationCode(String invitationCode);
} 