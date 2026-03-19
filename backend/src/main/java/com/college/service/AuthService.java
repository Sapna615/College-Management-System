package com.college.service;

import com.college.dto.*;
import com.college.model.Role;
import com.college.model.User;
import com.college.repository.UserRepository;
import com.college.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;
    private final StudentService studentService;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                    PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider,
                    EmailService emailService, StudentService studentService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
        this.studentService = studentService;
    }

    public JwtAuthResponse login(LoginRequest loginRequest) {
        // Find user by email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check password (simplified for now)
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate JWT token using the new String-based method
        String jwt = tokenProvider.generateToken(user.getEmail());

        RoleResponse roleResponse = new RoleResponse();
        roleResponse.setId(user.getId());
        roleResponse.setName(user.getName());
        roleResponse.setEmail(user.getEmail());
        roleResponse.setRole(user.getRole());
        roleResponse.setPhoneNumber(user.getPhoneNumber());
        roleResponse.setAddress(user.getAddress());

        return new JwtAuthResponse(jwt, roleResponse);
    }

    public String register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setAddress(registerRequest.getAddress());

        User savedUser = userRepository.save(user);

        // Create student or teacher record based on role
        if (registerRequest.getRole() == Role.STUDENT) {
            createStudentRecord(savedUser, registerRequest);
        } else if (registerRequest.getRole() == Role.TEACHER) {
            createTeacherRecord(savedUser, registerRequest);
        } else if (registerRequest.getRole() == Role.ADMIN) {
            createAdminRecord(savedUser, registerRequest);
        }

        return "User registered successfully";
    }

    private void createStudentRecord(User user, RegisterRequest request) {
        try {
            studentService.createStudent(user, request);
        } catch (Exception e) {
            System.err.println("Student record creation failed: " + e.getMessage());
            throw new RuntimeException("Failed to create student record: " + e.getMessage());
        }
    }

    private void createTeacherRecord(User user, RegisterRequest request) {
        // Implementation will be added in TeacherService
    }

    private void createAdminRecord(User user, RegisterRequest request) {
        // For admin, we don't need to create additional records
        // The user record with ADMIN role is sufficient
        System.out.println("Admin user created: " + user.getEmail());
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with this email"));

        String resetToken = UUID.randomUUID().toString();
        // Store reset token (you might want to add a resetToken field to User entity)
        // For now, we'll just log the reset link instead of sending email
        
        String resetLink = "http://localhost:5173/reset-password?token=" + resetToken;
        
        // Log the reset link for development (in production, you'd send this via email)
        System.out.println("=== PASSWORD RESET LINK ===");
        System.out.println("Email: " + user.getEmail());
        System.out.println("Reset Link: " + resetLink);
        System.out.println("=========================");
        
        // For demo purposes, we'll return the reset link in the response
        // In production, you'd only return a success message
        return "Password reset link: " + resetLink;
    }

    public String resetPassword(ResetPasswordRequest request) {
        // Validate token and reset password
        // This is a simplified implementation
        return "Password reset successfully";
    }
}
