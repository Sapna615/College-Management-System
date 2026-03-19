package com.college.service;

import com.college.dto.RegisterRequest;
import com.college.model.Teacher;
import com.college.model.User;
import com.college.model.Role;
import com.college.repository.TeacherRepository;
import com.college.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherService(TeacherRepository teacherRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Teacher createTeacher(User user, RegisterRequest request) {
        if (teacherRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists");
        }

        Teacher teacher = new Teacher();
        teacher.setEmployeeId(request.getEmployeeId());
        teacher.setUser(user);
        teacher.setQualification(request.getQualification());
        teacher.setExperienceYears(request.getExperienceYears());
        teacher.setSpecialization(request.getSpecialization());
        teacher.setDepartment(request.getDepartment());

        return teacherRepository.save(teacher);
    }

    public Teacher createTeacher(Teacher teacher) {
        try {
            System.out.println("Creating teacher with data: " + teacher.getEmployeeId() + ", " + teacher.getUser().getName());
            
            if (teacherRepository.existsByEmployeeId(teacher.getEmployeeId())) {
                throw new RuntimeException("Employee ID already exists");
            }
            
            // First, create and save the User
            User user = teacher.getUser();
            if (user.getEmail() != null && userRepository.existsByEmail(user.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            
            // Set user role to TEACHER if not set
            if (user.getRole() == null) {
                user.setRole(Role.TEACHER);
            }
            
            // Encode password if provided
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            
            User savedUser = userRepository.save(user);
            System.out.println("User saved with ID: " + savedUser.getId());
            
            // Now create the teacher with the saved user
            Teacher newTeacher = new Teacher();
            newTeacher.setEmployeeId(teacher.getEmployeeId());
            newTeacher.setQualification(teacher.getQualification());
            newTeacher.setExperienceYears(teacher.getExperienceYears());
            newTeacher.setSpecialization(teacher.getSpecialization());
            newTeacher.setDepartment(teacher.getDepartment());
            newTeacher.setUser(savedUser); // Use the saved user
            
            Teacher savedTeacher = teacherRepository.save(newTeacher);
            System.out.println("Teacher saved with ID: " + savedTeacher.getId());
            
            // Return clean response object to avoid circular references
            Teacher response = new Teacher();
            response.setId(savedTeacher.getId());
            response.setEmployeeId(savedTeacher.getEmployeeId());
            response.setQualification(savedTeacher.getQualification());
            response.setExperienceYears(savedTeacher.getExperienceYears());
            response.setSpecialization(savedTeacher.getSpecialization());
            response.setDepartment(savedTeacher.getDepartment());
            
            // Include user info for admin display
            if (savedTeacher.getUser() != null) {
                User userResponse = new User();
                userResponse.setId(savedTeacher.getUser().getId());
                userResponse.setName(savedTeacher.getUser().getName());
                userResponse.setEmail(savedTeacher.getUser().getEmail());
                userResponse.setPhoneNumber(savedTeacher.getUser().getPhoneNumber());
                userResponse.setRole(savedTeacher.getUser().getRole());
                response.setUser(userResponse);
            }
            
            System.out.println("Returning clean teacher response");
            return response;
            
        } catch (Exception e) {
            System.err.println("Error creating teacher: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create teacher: " + e.getMessage());
        }
    }

    public Teacher getTeacherByUserId(Long userId) {
        return teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
    }

    public Teacher getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        
        // Return clean response object to avoid circular references
        Teacher response = new Teacher();
        response.setId(teacher.getId());
        response.setEmployeeId(teacher.getEmployeeId());
        response.setQualification(teacher.getQualification());
        response.setExperienceYears(teacher.getExperienceYears());
        response.setSpecialization(teacher.getSpecialization());
        response.setDepartment(teacher.getDepartment());
        
        // Include user info for admin display
        if (teacher.getUser() != null) {
            User user = new User();
            user.setId(teacher.getUser().getId());
            user.setName(teacher.getUser().getName());
            user.setEmail(teacher.getUser().getEmail());
            user.setPhoneNumber(teacher.getUser().getPhoneNumber());
            user.setRole(teacher.getUser().getRole());
            response.setUser(user);
        }
        
        return response;
    }

    public List<Teacher> getAllTeachers() {
        List<Teacher> teachers = teacherRepository.findAll();
        
        // Create clean response objects to avoid circular references
        return teachers.stream().map(teacher -> {
            Teacher response = new Teacher();
            response.setId(teacher.getId());
            response.setEmployeeId(teacher.getEmployeeId());
            response.setQualification(teacher.getQualification());
            response.setExperienceYears(teacher.getExperienceYears());
            response.setSpecialization(teacher.getSpecialization());
            response.setDepartment(teacher.getDepartment());
            
            // Include user info for admin display
            if (teacher.getUser() != null) {
                User user = new User();
                user.setId(teacher.getUser().getId());
                user.setName(teacher.getUser().getName());
                user.setEmail(teacher.getUser().getEmail());
                user.setPhoneNumber(teacher.getUser().getPhoneNumber());
                user.setRole(teacher.getUser().getRole());
                response.setUser(user);
            }
            
            return response;
        }).toList();
    }

    public Teacher updateTeacher(Long id, Teacher teacherDetails) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        teacher.setEmployeeId(teacherDetails.getEmployeeId());
        teacher.setQualification(teacherDetails.getQualification());
        teacher.setExperienceYears(teacherDetails.getExperienceYears());
        teacher.setSpecialization(teacherDetails.getSpecialization());
        teacher.setDepartment(teacherDetails.getDepartment());

        Teacher savedTeacher = teacherRepository.save(teacher);
        
        // Return clean response object
        Teacher response = new Teacher();
        response.setId(savedTeacher.getId());
        response.setEmployeeId(savedTeacher.getEmployeeId());
        response.setQualification(savedTeacher.getQualification());
        response.setExperienceYears(savedTeacher.getExperienceYears());
        response.setSpecialization(savedTeacher.getSpecialization());
        response.setDepartment(savedTeacher.getDepartment());
        
        // Include user info for admin display
        if (savedTeacher.getUser() != null) {
            User user = new User();
            user.setId(savedTeacher.getUser().getId());
            user.setName(savedTeacher.getUser().getName());
            user.setEmail(savedTeacher.getUser().getEmail());
            user.setPhoneNumber(savedTeacher.getUser().getPhoneNumber());
            user.setRole(savedTeacher.getUser().getRole());
            response.setUser(user);
        }
        
        return response;
    }

    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        teacherRepository.delete(teacher);
    }

    public Teacher getCurrentTeacherProfile() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Current user not found"));
            
            Teacher teacher = getTeacherByUserId(user.getId());
            System.out.println("Fetching teacher profile for user: " + user.getId() + ", teacher ID: " + teacher.getId());
            
            // Return clean response object to avoid circular references
            Teacher cleanTeacher = new Teacher();
            cleanTeacher.setId(teacher.getId());
            cleanTeacher.setEmployeeId(teacher.getEmployeeId());
            cleanTeacher.setDepartment(teacher.getDepartment());
            cleanTeacher.setSpecialization(teacher.getSpecialization());
            cleanTeacher.setQualification(teacher.getQualification());
            cleanTeacher.setExperienceYears(teacher.getExperienceYears());
            
            // Include minimal user info (no circular references)
            if (teacher.getUser() != null) {
                User userResponse = new User();
                userResponse.setId(teacher.getUser().getId());
                userResponse.setName(teacher.getUser().getName());
                userResponse.setEmail(teacher.getUser().getEmail());
                userResponse.setRole(teacher.getUser().getRole());
                userResponse.setPhoneNumber(teacher.getUser().getPhoneNumber());
                userResponse.setAddress(teacher.getUser().getAddress());
                cleanTeacher.setUser(userResponse);
            }
            
            return cleanTeacher;
            
        } catch (Exception e) {
            System.err.println("Error fetching teacher profile: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch teacher profile: " + e.getMessage());
        }
    }

    public List<Teacher> getTeachersByDepartment(String department) {
        return teacherRepository.findByDepartment(department);
    }

    public List<Teacher> getTeachersBySpecialization(String specialization) {
        return teacherRepository.findBySpecialization(specialization);
    }

    public boolean isTeacherOwner(Long teacherId, String email) {
        Teacher teacher = teacherRepository.findById(teacherId).orElse(null);
        if (teacher == null) return false;
        return teacher.getUser().getEmail().equals(email);
    }
}
