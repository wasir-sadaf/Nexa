package com.nexa.backend.repository;

import com.nexa.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByRole(User.Role role);
}