-- Inject Mock Users
INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES
                                                                         (1, 'Alice Customer', 'alice@email.com', 'dummyhash1', 'CUSTOMER', NOW()),
                                                                         (2, 'Bob Agent', 'bob@nexa.com', 'dummyhash2', 'SUPPORT_AGENT', NOW());

-- Inject a Mock Order for Alice
INSERT INTO orders (id, customer_id, status, total_amount, created_at) VALUES
    (1, 1, 'PROCESSING', 120.50, NOW());

-- Inject a Mock Conversation
INSERT INTO conversations (id, customer_id, status, created_at, updated_at) VALUES
    (1, 1, 'ACTIVE', NOW(), NOW());

-- Inject Mock Messages into that Conversation
INSERT INTO messages (id, conversation_id, sender_type, content, created_at) VALUES
                                                                                 (1, 1, 'CUSTOMER', 'Hi, I need help with my order!', NOW()),
                                                                                 (2, 1, 'AI', 'Hello Alice! I see your order is currently PROCESSING. How can I help?', NOW());



-- Inject a Support Ticket (Escalating Alice's issue to Bob)
INSERT INTO support_tickets (id, customer_id, conversation_id, assigned_agent_id, subject, description, status, priority, ai_summary, created_at, updated_at) VALUES
    (1, 1, 1, 2, 'Order Processing Delay', 'Customer is requesting an update on why their order is still processing.', 'OPEN', 'MEDIUM', 'Customer inquired about order #1 status. Order is currently marked as PROCESSING. Escalated to human agent for timeline estimate.', NOW(), NOW());

-- Inject an Admin User
INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES
    (3, 'Charlie Admin', 'charlie@nexa.com', 'dummyhash3', 'ADMIN', NOW());

-- Inject a second, older completed order for Alice
INSERT INTO orders (id, customer_id, status, total_amount, created_at) VALUES
    (2, 1, 'DELIVERED', 45.00, '2026-08-15 10:00:00');

-- Inject a closed conversation
INSERT INTO conversations (id, customer_id, status, created_at, updated_at) VALUES
    (2, 1, 'CLOSED', '2026-08-16 14:00:00', '2026-08-16 14:15:00');

-- Inject messages for the closed conversation
INSERT INTO messages (id, conversation_id, sender_type, content, created_at) VALUES
                                                                                 (3, 2, 'CUSTOMER', 'My package arrived safely, thank you!', '2026-08-16 14:05:00'),
                                                                                 (4, 2, 'AI', 'You are very welcome! Have a great day.', '2026-08-16 14:06:00');