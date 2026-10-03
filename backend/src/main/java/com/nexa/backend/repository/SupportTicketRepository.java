package com.nexa.backend.repository;

import com.nexa.backend.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    // This tells Spring to automatically find all tickets assigned to a specific agent
    List<SupportTicket> findByAssignedAgentId(Long agentId);

}