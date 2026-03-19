package com.college.service;

import com.college.model.User;
import com.college.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        try {
            System.out.println("Fetching all users for dashboard");
            List<User> users = userRepository.findAll();
            
            // Create clean response list to avoid circular references
            return users.stream().map(user -> {
                User cleanUser = new User();
                cleanUser.setId(user.getId());
                cleanUser.setName(user.getName());
                cleanUser.setEmail(user.getEmail());
                cleanUser.setRole(user.getRole());
                cleanUser.setPhoneNumber(user.getPhoneNumber());
                cleanUser.setAddress(user.getAddress());
                // Don't include student/teacher references to avoid circular references
                return cleanUser;
            }).collect(java.util.stream.Collectors.toList());
            
        } catch (Exception e) {
            System.err.println("Error fetching all users: " + e.getMessage());
            throw new RuntimeException("Failed to fetch users: " + e.getMessage());
        }
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);

        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setAddress(userDetails.getAddress());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        // Create a clean response object to avoid circular references
        User response = new User();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setAddress(user.getAddress());
        response.setRole(user.getRole());
        
        return response;
    }

    public boolean isOwner(Long userId, String username) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        return user.getEmail().equals(username);
    }

    public User updateCurrentUser(User userDetails) {
        // Get current authenticated user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        // Update only allowed fields
        currentUser.setName(userDetails.getName());
        currentUser.setPhoneNumber(userDetails.getPhoneNumber());
        currentUser.setAddress(userDetails.getAddress());
        
        // Save and return a clean user object without circular references
        User savedUser = userRepository.save(currentUser);
        
        // Create a clean response object to avoid circular references
        User response = new User();
        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setPhoneNumber(savedUser.getPhoneNumber());
        response.setAddress(savedUser.getAddress());
        response.setRole(savedUser.getRole());
        
        return response;
    }
}
