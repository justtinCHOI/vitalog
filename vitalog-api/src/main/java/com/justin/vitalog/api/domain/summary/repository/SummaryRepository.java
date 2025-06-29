package com.justin.vitalog.api.domain.summary.repository;

import com.justin.vitalog.api.domain.summary.domain.Summary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SummaryRepository extends JpaRepository<Summary, Long> {
} 