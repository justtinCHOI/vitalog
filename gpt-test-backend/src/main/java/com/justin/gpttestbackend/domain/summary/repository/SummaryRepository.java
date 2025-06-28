package com.justin.gpttestbackend.domain.summary.repository;

import com.justin.gpttestbackend.domain.summary.domain.Summary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SummaryRepository extends JpaRepository<Summary, Long> {
} 