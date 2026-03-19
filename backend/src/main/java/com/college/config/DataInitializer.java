package com.college.config;

import com.college.model.Role;
import com.college.model.User;
import com.college.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@college.com")) {
            User admin = new User();
            admin.setName("System Administrator");
            admin.setEmail("admin@college.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            admin.setPhoneNumber("1234567890");
            admin.setAddress("College Office");

            userRepository.save(admin);
            System.out.println("Default admin user created successfully!");
        }
    }
}
