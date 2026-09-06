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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        supportTicketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}