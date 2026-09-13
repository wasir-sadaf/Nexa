package com.nexa.backend.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class AiServiceClient {

    private final RestClient restClient;

    public AiServiceClient() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8000")
                .build();
    }

    public AiResponse chat(AiRequest request) {
        return restClient.post()
                .uri("/chat")
                .body(request)
                .retrieve()
                .body(AiResponse.class);
    }

    public record AiRequest(
            int user_id,
            int conversation_id,
            String message
    ) {}

    public record AiResponse(
            String intent,
            String selected_agent,
            Integer order_id,
            String response,
            boolean needs_human
    ) {}
}