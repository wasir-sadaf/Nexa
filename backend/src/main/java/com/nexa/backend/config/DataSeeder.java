package com.nexa.backend.config;

import com.nexa.backend.entity.SupportTicket;
import com.nexa.backend.entity.User;
import com.nexa.backend.repository.SupportTicketRepository;
import com.nexa.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, SupportTicketRepository ticketRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = userRepository.save(new User("Admin User", "admin@nexa.com", "password123", User.Role.ADMIN));
                User agent = userRepository.save(new User("Support Agent", "agent@nexa.com", "password123", User.Role.SUPPORT_AGENT));
                User customer = userRepository.save(new User("Regular Customer", "customer@nexa.com", "password123", User.Role.CUSTOMER));

                System.out.println("✅ Database seeded with default users!");

                // Create a test ticket linked to the customer
                SupportTicket ticket = new SupportTicket();
                ticket.setCustomer(customer);
                ticket.setSubject("Cannot connect to database");
                ticket.setDescription("I am getting a connection timeout error when trying to boot up.");
                ticket.setStatus(SupportTicket.Status.OPEN);
                ticket.setPriority(SupportTicket.Priority.HIGH);
                ticketRepository.save(ticket);

                System.out.println("✅ Database seeded with test ticket!");
            }
        };
    }
}