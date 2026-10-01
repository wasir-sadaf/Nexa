-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'SUPPORT_AGENT', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')
        NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) REFERENCES users(id)
);


-- ============================================
-- CONVERSATIONS
-- ============================================
CREATE TABLE conversations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    status ENUM('ACTIVE', 'CLOSED', 'ESCALATED')
        NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_conversations_customer
        FOREIGN KEY (customer_id) REFERENCES users(id)
);


-- ============================================
-- MESSAGES
-- ============================================
CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_type ENUM('CUSTOMER', 'AI', 'HUMAN')
        NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_messages_conversation
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
        ON DELETE CASCADE
);


-- ============================================
-- SUPPORT TICKETS
-- ============================================
CREATE TABLE support_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    conversation_id BIGINT NOT NULL,
    assigned_agent_id BIGINT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')
        NOT NULL DEFAULT 'OPEN',
    priority ENUM('LOW', 'MEDIUM', 'HIGH')
        NOT NULL DEFAULT 'MEDIUM',
    ai_summary TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tickets_customer
        FOREIGN KEY (customer_id) REFERENCES users(id),

    CONSTRAINT fk_tickets_conversation
        FOREIGN KEY (conversation_id) REFERENCES conversations(id),

    CONSTRAINT fk_tickets_agent
        FOREIGN KEY (assigned_agent_id) REFERENCES users(id)
);