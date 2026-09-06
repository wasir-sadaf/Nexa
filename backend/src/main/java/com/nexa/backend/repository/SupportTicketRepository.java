package com.nexa.backend.repository;

import com.nexa.backend.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
}