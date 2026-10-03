package com.nexa.backend.controller;

import com.nexa.backend.entity.Conversation;
import com.nexa.backend.entity.Message;
import com.nexa.backend.entity.SupportTicket;
import com.nexa.backend.entity.User;
import com.nexa.backend.repository.ConversationRepository;
import com.nexa.backend.repository.MessageRepository;
import com.nexa.backend.repository.SupportTicketRepository;
import com.nexa.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
public class SupportTicketController {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Map<String, Object>> getAllTickets() {
        List<SupportTicket> tickets = supportTicketRepository.findAll();
        return tickets.stream().map(ticket -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", "TKT-" + ticket.getId());
            map.put("subject", ticket.getSubject());

            String status = ticket.getStatus().name();
            if (status.equals("IN_PROGRESS")) status = "In Progress";
            else status = status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase();

            map.put("status", status);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
            map.put("lastUpdated", ticket.getUpdatedAt() != null ? ticket.getUpdatedAt().format(formatter) : "Unknown");

            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        Optional<SupportTicket> ticketOpt = supportTicketRepository.findById(id);

        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        SupportTicket ticket = ticketOpt.get();
        Map<String, Object> map = new HashMap<>();

        map.put("id", "TKT-" + ticket.getId());
        map.put("rawId", ticket.getId());
        map.put("subject", ticket.getSubject());
        map.put("description", ticket.getDescription());
        map.put("status", ticket.getStatus().name());
        map.put("priority", ticket.getPriority().name());

        if (ticket.getCustomer() != null) {
            map.put("customerName", ticket.getCustomer().getName());
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a");
        map.put("createdAt", ticket.getCreatedAt() != null ? ticket.getCreatedAt().format(formatter) : "Unknown");
        map.put("lastUpdated", ticket.getUpdatedAt() != null ? ticket.getUpdatedAt().format(formatter) : "Unknown");

        return ResponseEntity.ok(map);
    }

    // Create a Ticket
    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody Map<String, String> payload) {
        Long customerId = Long.parseLong(payload.get("customerId"));

        Optional<User> customerOpt = userRepository.findById(customerId);
        if (customerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Customer not found"));
        }

        SupportTicket ticket = new SupportTicket();
        ticket.setCustomer(customerOpt.get());
        ticket.setSubject(payload.get("subject"));
        ticket.setDescription(payload.get("description"));
        ticket.setStatus(SupportTicket.Status.OPEN);
        ticket.setPriority(SupportTicket.Priority.MEDIUM);

        SupportTicket savedTicket = supportTicketRepository.save(ticket);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Ticket created successfully");
        response.put("ticketId", "TKT-" + savedTicket.getId());

        return ResponseEntity.ok(response);
    }

    // Fetch all replies for a ticket
    @GetMapping("/{id}/replies")
    public ResponseEntity<?> getTicketReplies(@PathVariable Long id) {
        Optional<SupportTicket> ticketOpt = supportTicketRepository.findById(id);

        // If the ticket has no conversation yet, return an empty list
        if (ticketOpt.isEmpty() || ticketOpt.get().getConversation() == null) {
            return ResponseEntity.ok(List.of());
        }

        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(
                ticketOpt.get().getConversation().getId()
        );

        List<Map<String, Object>> response = messages.stream().map(msg -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", msg.getId());
            map.put("content", msg.getContent());
            map.put("senderType", msg.getSenderType().name());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // Post a new reply
    @PostMapping("/{id}/replies")
    public ResponseEntity<?> addTicketReply(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<SupportTicket> ticketOpt = supportTicketRepository.findById(id);
        if (ticketOpt.isEmpty()) return ResponseEntity.notFound().build();

        SupportTicket ticket = ticketOpt.get();
        Conversation conversation = ticket.getConversation();

        // If this is the first reply, dynamically create the Conversation
        if (conversation == null) {
            conversation = new Conversation();
            conversation.setCustomer(ticket.getCustomer());
            conversation.setStatus(Conversation.Status.ACTIVE);
            conversation = conversationRepository.save(conversation);

            ticket.setConversation(conversation);
            supportTicketRepository.save(ticket);
        }

        Message message = new Message();
        message.setConversation(conversation);
        message.setContent(payload.get("content"));

        // Check if the user is a CUSTOMER or an AGENT/ADMIN
        String role = payload.get("role");
        message.setSenderType("CUSTOMER".equals(role) ? Message.SenderType.CUSTOMER : Message.SenderType.HUMAN);

        messageRepository.save(message);
        return ResponseEntity.ok(Map.of("message", "Reply saved successfully"));
    }
}