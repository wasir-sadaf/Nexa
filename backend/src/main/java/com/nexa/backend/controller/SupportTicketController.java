package com.nexa.backend.controller;

import com.nexa.backend.entity.SupportTicket;
import com.nexa.backend.service.SupportTicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class SupportTicketController {

    private final SupportTicketService supportTicketService;

    public SupportTicketController(SupportTicketService supportTicketService) {
        this.supportTicketService = supportTicketService;
    }

    @GetMapping
    public List<SupportTicket> getAllTickets() {
        return supportTicketService.getAllTickets();
    }

    @GetMapping("/agent/{agentId}")
    public List<SupportTicket> getTicketsByAgent(@PathVariable Long agentId) {
        return supportTicketService.getTicketsByAgent(agentId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupportTicket> getTicketById(@PathVariable Long id) {
        return supportTicketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SupportTicket createTicket(@RequestBody SupportTicket ticket) {
        return supportTicketService.createTicket(ticket);
    }

    @PostMapping("/ai")
    public SupportTicket createAiTicket(@RequestBody AiTicketRequest request) {
        return supportTicketService.createAiTicket(
                request.user_id(),
                request.conversation_id(),
                request.subject(),
                request.description(),
                request.priority()
        );
    }

    @PutMapping("/{id}/escalate")
    public ResponseEntity<SupportTicket> escalateTicket(@PathVariable Long id) {
        return ResponseEntity.ok(
                supportTicketService.escalateTicket(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        supportTicketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    public record AiTicketRequest(
            Long user_id,
            Long conversation_id,
            String subject,
            String description,
            SupportTicket.Priority priority
    ) {}
}