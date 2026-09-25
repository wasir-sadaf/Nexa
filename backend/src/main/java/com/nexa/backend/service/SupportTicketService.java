package com.nexa.backend.service;

import com.nexa.backend.entity.Conversation;
import com.nexa.backend.entity.SupportTicket;
import com.nexa.backend.entity.User;
import com.nexa.backend.repository.ConversationRepository;
import com.nexa.backend.repository.SupportTicketRepository;
import com.nexa.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupportTicketService {

    private final SupportTicketRepository supportTicketRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;

    public SupportTicketService(
            SupportTicketRepository supportTicketRepository,
            UserRepository userRepository,
            ConversationRepository conversationRepository
    ) {
        this.supportTicketRepository = supportTicketRepository;
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
    }

    public List<SupportTicket> getAllTickets() {
        return supportTicketRepository.findAll();
    }

    public Optional<SupportTicket> getTicketById(Long id) {
        return supportTicketRepository.findById(id);
    }

    public SupportTicket createTicket(SupportTicket ticket) {
        return supportTicketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        supportTicketRepository.deleteById(id);
    }

    public SupportTicket createAiTicket(
            Long userId,
            Long conversationId,
            String subject,
            String description,
            SupportTicket.Priority priority
    ) {
        User customer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        SupportTicket ticket = new SupportTicket();

        ticket.setCustomer(customer);
        ticket.setConversation(conversation);
        ticket.setSubject(subject);
        ticket.setDescription(description);
        ticket.setPriority(priority);

        return supportTicketRepository.save(ticket);
    }

    public SupportTicket escalateTicket(Long id) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (ticket.getStatus() == SupportTicket.Status.RESOLVED ||
                ticket.getStatus() == SupportTicket.Status.CLOSED) {

            throw new RuntimeException(
                    "Ticket cannot be escalated because its status is " + ticket.getStatus()
            );
        }

        List<User> supportAgents =
                userRepository.findByRole(User.Role.SUPPORT_AGENT);

        if (supportAgents.isEmpty()) {
            throw new RuntimeException("No support agent is available");
        }

        User assignedAgent = supportAgents.get(0);

        ticket.setAssignedAgent(assignedAgent);
        ticket.setStatus(SupportTicket.Status.IN_PROGRESS);
        ticket.setPriority(SupportTicket.Priority.HIGH);

        return supportTicketRepository.save(ticket);
    }

    public List<SupportTicket> getTicketsByAgent(Long agentId) {
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Support agent not found"));

        if (agent.getRole() != User.Role.SUPPORT_AGENT) {
            throw new RuntimeException("User is not a support agent");
        }

        return supportTicketRepository.findByAssignedAgentId(agentId);
    }
}