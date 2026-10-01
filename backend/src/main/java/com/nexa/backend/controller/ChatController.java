package com.nexa.backend.controller;

import com.nexa.backend.client.AiServiceClient;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final AiServiceClient aiServiceClient;

    public ChatController(AiServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }

    @PostMapping
    public AiServiceClient.AiResponse chat(
            @RequestBody AiServiceClient.AiRequest request
    ) {
        return aiServiceClient.chat(request);
    }
}