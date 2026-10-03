package com.nexa.backend.controller;

import com.nexa.backend.client.AiServiceClient;
import com.nexa.backend.entity.Conversation;
import com.nexa.backend.entity.Message;
import com.nexa.backend.entity.SupportTicket;
import com.nexa.backend.repository.ConversationRepository;
import com.nexa.backend.repository.MessageRepository;
import com.nexa.backend.repository.SupportTicketRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final AiServiceClient aiServiceClient;
    private final MessageRepository messageRepository;
    private final SupportTicketRepository ticketRepository;
    private final ConversationRepository conversationRepository;

    public ChatController(
            AiServiceClient aiServiceClient,
            MessageRepository messageRepository,
            SupportTicketRepository ticketRepository,
            ConversationRepository conversationRepository
    ) {
        this.aiServiceClient = aiServiceClient;
        this.messageRepository = messageRepository;
        this.ticketRepository = ticketRepository;
        this.conversationRepository = conversationRepository;
    }

    @PostMapping
    public AiServiceClient.AiResponse chat(@RequestBody AiServiceClient.AiRequest request) {

        // 1. Fetch the structured AI response from your Python microservice
        AiServiceClient.AiResponse aiResponse = aiServiceClient.chat(request);

        // Fetch the associated Conversation entity
        Conversation conversation = conversationRepository.findById((long) request.conversation_id())
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        // 2. Save the User's incoming message to the database
        Message userMessage = new Message();
        userMessage.setConversation(conversation);
        userMessage.setSenderType(Message.SenderType.CUSTOMER);
        userMessage.setContent(request.message());
        messageRepository.save(userMessage);

        // 3. Save the AI's response message to the database
        Message aiMessage = new Message();
        aiMessage.setConversation(conversation);
        aiMessage.setSenderType(Message.SenderType.AI);
        aiMessage.setContent(aiResponse.response());
        messageRepository.save(aiMessage);

        // 4. Escalate to a human agent if the AI determined it's necessary
        if (aiResponse.needs_human()) {
            ticketRepository.findById((long) request.conversation_id()).ifPresent(ticket -> {
                ticket.setStatus(SupportTicket.Status.ESCALATED);
                ticketRepository.save(ticket);
            });
        }

        return aiResponse;
    }
}