package com.nexa.backend.repository;

import com.nexa.backend.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    List<Conversation> findByCustomerId(Long customerId);
}