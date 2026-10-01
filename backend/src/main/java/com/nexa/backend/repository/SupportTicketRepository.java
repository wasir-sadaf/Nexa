package com.nexa.backend.repository;

import com.nexa.backend.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    List<SupportTicket> findByAssignedAgentId(Long agentId);
}