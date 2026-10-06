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
        return formatTickets(supportTicketRepository.findAll());
    }

    @GetMapping("/customer/{customerId}")
    public List<Map<String, Object>> getCustomerTickets(
            @PathVariable Long customerId
    ) {
        return formatTickets(
                supportTicketRepository.findByCustomerId(customerId)
        );
    }

    @GetMapping("/agent/{agentId}")
    public List<Map<String, Object>> getAgentTickets(
            @PathVariable Long agentId
    ) {
        return formatTickets(
                supportTicketRepository.findByAssignedAgentId(agentId)
        );
    }

    private List<Map<String, Object>> formatTickets(
            List<SupportTicket> tickets
    ) {
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("MMM dd, yyyy");

        return tickets.stream().map(ticket -> {

            Map<String, Object> map = new HashMap<>();

            map.put("id", ticket.getId());
            map.put("subject", ticket.getSubject());
            map.put("status", ticket.getStatus().name());
            map.put("priority", ticket.getPriority().name());

            if (ticket.getCustomer() != null) {
                Map<String, Object> customerMap = new HashMap<>();

                customerMap.put(
                        "id",
                        ticket.getCustomer().getId()
                );

                customerMap.put(
                        "name",
                        ticket.getCustomer().getName()
                );

                map.put("customer", customerMap);
            }

            if (ticket.getAssignedAgent() != null) {
                Map<String, Object> agentMap = new HashMap<>();

                agentMap.put(
                        "id",
                        ticket.getAssignedAgent().getId()
                );

                agentMap.put(
                        "name",
                        ticket.getAssignedAgent().getName()
                );

                map.put("assignedAgent", agentMap);
            }

            map.put(
                    "createdAt",
                    ticket.getCreatedAt() != null
                            ? ticket.getCreatedAt().format(formatter)
                            : "Unknown"
            );

            map.put(
                    "lastUpdated",
                    ticket.getUpdatedAt() != null
                            ? ticket.getUpdatedAt().format(formatter)
                            : "Unknown"
            );

            return map;

        }).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(
            @PathVariable Long id
    ) {
        Optional<SupportTicket> ticketOpt =
                supportTicketRepository.findById(id);

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
            map.put(
                    "customerName",
                    ticket.getCustomer().getName()
            );

            map.put(
                    "customerId",
                    ticket.getCustomer().getId()
            );
        }

        if (ticket.getAssignedAgent() != null) {
            map.put(
                    "assignedAgentName",
                    ticket.getAssignedAgent().getName()
            );

            map.put(
                    "assignedAgentId",
                    ticket.getAssignedAgent().getId()
            );
        }

        if (ticket.getConversation() != null) {
            map.put(
                    "conversationId",
                    ticket.getConversation().getId()
            );
        }

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a");

        map.put(
                "createdAt",
                ticket.getCreatedAt() != null
                        ? ticket.getCreatedAt().format(formatter)
                        : "Unknown"
        );

        map.put(
                "lastUpdated",
                ticket.getUpdatedAt() != null
                        ? ticket.getUpdatedAt().format(formatter)
                        : "Unknown"
        );

        return ResponseEntity.ok(map);
    }

    @PostMapping
    public ResponseEntity<?> createTicket(
            @RequestBody Map<String, String> payload
    ) {
        String customerIdValue = payload.get("customerId");

        if (customerIdValue == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Customer ID is required"));
        }

        Long customerId;

        try {
            customerId = Long.parseLong(customerIdValue);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid customer ID"));
        }

        Optional<User> customerOpt =
                userRepository.findById(customerId);

        if (customerOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Customer not found"));
        }

        SupportTicket ticket = new SupportTicket();

        ticket.setCustomer(customerOpt.get());
        ticket.setSubject(payload.get("subject"));
        ticket.setDescription(payload.get("description"));
        ticket.setStatus(SupportTicket.Status.OPEN);
        ticket.setPriority(SupportTicket.Priority.MEDIUM);

        // Attach the existing conversation when provided
        String conversationIdValue = payload.get("conversationId");

        if (conversationIdValue != null) {
            try {
                Long conversationId =
                        Long.parseLong(conversationIdValue);

                Optional<Conversation> conversationOpt =
                        conversationRepository.findById(conversationId);

                if (conversationOpt.isPresent()) {
                    ticket.setConversation(
                            conversationOpt.get()
                    );
                }

            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "Invalid conversation ID"
                                )
                        );
            }
        }

        SupportTicket savedTicket =
                supportTicketRepository.save(ticket);

        Map<String, Object> response = new HashMap<>();

        response.put(
                "message",
                "Ticket created successfully"
        );

        response.put(
                "ticketId",
                "TKT-" + savedTicket.getId()
        );

        if (savedTicket.getConversation() != null) {
            response.put(
                    "conversationId",
                    savedTicket.getConversation().getId()
            );
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/replies")
    public ResponseEntity<?> getTicketReplies(
            @PathVariable Long id
    ) {
        Optional<SupportTicket> ticketOpt =
                supportTicketRepository.findById(id);

        if (ticketOpt.isEmpty()
                || ticketOpt.get().getConversation() == null) {

            return ResponseEntity.ok(List.of());
        }

        List<Message> messages =
                messageRepository
                        .findByConversationIdOrderByCreatedAtAsc(
                                ticketOpt
                                        .get()
                                        .getConversation()
                                        .getId()
                        );

        List<Map<String, Object>> response =
                messages.stream().map(msg -> {

                    Map<String, Object> map =
                            new HashMap<>();

                    map.put("id", msg.getId());
                    map.put("content", msg.getContent());

                    map.put(
                            "senderType",
                            msg.getSenderType().name()
                    );

                    return map;

                }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/replies")
    public ResponseEntity<?> addTicketReply(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        Optional<SupportTicket> ticketOpt =
                supportTicketRepository.findById(id);

        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        SupportTicket ticket = ticketOpt.get();

        Conversation conversation =
                ticket.getConversation();

        if (conversation == null) {

            conversation = new Conversation();

            conversation.setCustomer(
                    ticket.getCustomer()
            );

            conversation.setStatus(
                    Conversation.Status.ESCALATED
            );

            conversation =
                    conversationRepository.save(
                            conversation
                    );

            ticket.setConversation(conversation);

            supportTicketRepository.save(ticket);
        }

        Message message = new Message();

        message.setConversation(conversation);
        message.setContent(payload.get("content"));

        String role = payload.get("role");

        message.setSenderType(
                "CUSTOMER".equals(role)
                        ? Message.SenderType.CUSTOMER
                        : Message.SenderType.HUMAN
        );

        messageRepository.save(message);

        return ResponseEntity.ok(
                Map.of("message", "Reply saved successfully")
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        Optional<SupportTicket> ticketOpt =
                supportTicketRepository.findById(id);

        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String statusValue = payload.get("status");

        if (statusValue == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Status is required"));
        }

        try {
            SupportTicket.Status status =
                    SupportTicket.Status.valueOf(statusValue);

            SupportTicket ticket = ticketOpt.get();

            ticket.setStatus(status);

            supportTicketRepository.save(ticket);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Ticket status updated successfully",
                            "status",
                            status.name()
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid ticket status"));
        }
    }

    @PutMapping("/{id}/escalate")
    public ResponseEntity<?> escalateTicket(
            @PathVariable Long id
    ) {
        Optional<SupportTicket> ticketOpt =
                supportTicketRepository.findById(id);

        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        SupportTicket ticket = ticketOpt.get();

        List<User> agents =
                userRepository.findByRole(
                        User.Role.SUPPORT_AGENT
                );

        if (agents.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    "No support agent is available."
                            )
                    );
        }

        User assignedAgent = agents.get(0);

        ticket.setAssignedAgent(assignedAgent);
        ticket.setStatus(
                SupportTicket.Status.ESCALATED
        );

        // Also mark the linked conversation as escalated
        if (ticket.getConversation() != null) {
            ticket.getConversation().setStatus(
                    Conversation.Status.ESCALATED
            );

            conversationRepository.save(
                    ticket.getConversation()
            );
        }

        SupportTicket savedTicket =
                supportTicketRepository.save(ticket);

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "id",
                "TKT-" + savedTicket.getId()
        );

        response.put(
                "rawId",
                savedTicket.getId()
        );

        response.put(
                "status",
                savedTicket.getStatus().name()
        );

        response.put(
                "priority",
                savedTicket.getPriority().name()
        );

        response.put(
                "assignedAgentId",
                assignedAgent.getId()
        );

        response.put(
                "assignedAgentName",
                assignedAgent.getName()
        );

        response.put(
                "success",
                true
        );

        return ResponseEntity.ok(response);
    }
}