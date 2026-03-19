package com.college.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("Click the link below to reset your password:\n" + resetLink +
                "\n\nThis link will expire in 24 hours.");
        message.setFrom("noreply@college.com");

        mailSender.send(message);
    }

    public void sendWelcomeEmail(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to College Management System");
        message.setText("Dear " + name + ",\n\nWelcome to College Management System! " +
                "Your account has been created successfully.\n\nThank you!");
        message.setFrom("noreply@college.com");

        mailSender.send(message);
    }
}
