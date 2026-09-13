INSERT INTO users (name, email, password_hash, role) VALUES
('John Doe', 'john@example.com', 'hashed_password_1', 'CUSTOMER'),
('Sarah Ahmed', 'sarah@example.com', 'hashed_password_2', 'CUSTOMER'),
('Mike Wilson', 'mike@example.com', 'hashed_password_3', 'CUSTOMER'),
('Support Agent One', 'agent1@nexa.com', 'hashed_password_4', 'SUPPORT_AGENT'),
('Support Agent Two', 'agent2@nexa.com', 'hashed_password_5', 'SUPPORT_AGENT'),
('System Admin', 'admin@nexa.com', 'hashed_password_6', 'ADMIN');


INSERT INTO orders (customer_id, status, total_amount) VALUES
(1, 'DELIVERED', 1250.00),
(1, 'SHIPPED', 2499.00),
(2, 'PROCESSING', 799.00),
(2, 'CANCELLED', 1500.00),
(3, 'PENDING', 3200.00);


INSERT INTO conversations (customer_id, status) VALUES
(1, 'CLOSED'),
(1, 'ACTIVE'),
(2, 'ESCALATED'),
(3, 'ACTIVE');


INSERT INTO messages (conversation_id, sender_type, content) VALUES
(1, 'CUSTOMER', 'Where is my order?'),
(1, 'AI', 'Your order #1 has been delivered.'),
(2, 'CUSTOMER', 'Can you tell me the status of my second order?'),
(2, 'AI', 'Your order #2 has been shipped and is currently in transit.'),
(3, 'CUSTOMER', 'I was charged twice for my order.'),
(3, 'AI', 'I understand. I will escalate this issue to a support agent.'),
(4, 'CUSTOMER', 'What is the status of my order?');


INSERT INTO support_tickets (
    customer_id,
    conversation_id,
    assigned_agent_id,
    subject,
    description,
    status,
    priority,
    ai_summary
) VALUES
(
    2,
    3,
    4,
    'Duplicate payment',
    'Customer reports being charged twice for the same order.',
    'OPEN',
    'HIGH',
    'Customer reports a possible duplicate payment and requires human investigation.'
);