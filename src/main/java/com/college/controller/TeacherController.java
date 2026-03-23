package com.college.controller;

import com.college.model.Teacher;
import com.college.model.User;
import com.college.service.TeacherService;
import com.college.repository.TeacherRepository;
import com.college.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teachers")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherController {

    private final TeacherService teacherService;
    private final UserRepository userRepository;

    public TeacherController(TeacherService teacherService, UserRepository userRepository) {
        this.teacherService = teacherService;
        this.userRepository = userRepository;
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        List<Teacher> teachers = teacherService.getAllTeachers();
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @teacherService.isTeacherOwner(#id, authentication.name)")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long id) {
        Teacher teacher = teacherService.getTeacherById(id);
        return ResponseEntity.ok(teacher);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Teacher> createTeacher(@RequestBody Teacher teacher) {
        Teacher createdTeacher = teacherService.createTeacher(teacher);
        return ResponseEntity.ok(createdTeacher);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @teacherService.isTeacherOwner(#id, authentication.name)")
    public ResponseEntity<Teacher> updateTeacher(@PathVariable Long id, @RequestBody Teacher teacherDetails) {
        Teacher updatedTeacher = teacherService.updateTeacher(id, teacherDetails);
        return ResponseEntity.ok(updatedTeacher);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.ok("Teacher deleted successfully");
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Teacher> getCurrentTeacherProfile() {
        Teacher teacher = teacherService.getCurrentTeacherProfile();
        return ResponseEntity.ok(teacher);
    }

    @GetMapping("/department/{department}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Teacher>> getTeachersByDepartment(@PathVariable String department) {
        List<Teacher> teachers = teacherService.getTeachersByDepartment(department);
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/specialization/{specialization}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Teacher>> getTeachersBySpecialization(@PathVariable String specialization) {
        List<Teacher> teachers = teacherService.getTeachersBySpecialization(specialization);
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/all-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getAllUsers() {
        StringBuilder result = new StringBuilder();
        result.append("=== ALL REGISTERED USERS ===\n\n");
        
        // Get all users via direct query
        List<User> users = userRepository.findAll();
        
        result.append("USERS TABLE:\n");
        result.append("ID\tNAME\t\tEMAIL\t\t\tROLE\t\tPHONE\n");
        result.append("---\t---\t\t---\t\t---\t\t-----\n");
        
        for (User user : users) {
            result.append(user.getId()).append("\t");
            result.append(user.getName()).append("\t\t");
            result.append(user.getEmail()).append("\t\t");
            result.append(user.getRole()).append("\t\t");
            result.append(user.getPhoneNumber()).append("\n");
        }
        
        result.append("\n");
        result.append("=== TOTAL USERS: ").append(users.size()).append(" ===\n");
        
        return ResponseEntity.ok(result.toString());
    }
}
