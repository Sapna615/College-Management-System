package com.college.service;

import com.college.dto.RegisterRequest;
import com.college.model.Student;
import com.college.model.User;
import com.college.model.Role;
import com.college.repository.StudentRepository;
import com.college.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Student createStudent(User user, RegisterRequest request) {
        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new RuntimeException("Roll number already exists");
        }

        Student student = new Student();
        student.setRollNumber(request.getRollNumber());
        student.setUser(user);
        student.setEnrollmentDate(LocalDate.now());
        student.setCurrentSemester(request.getCurrentSemester() != null ? request.getCurrentSemester() : 1);
        student.setDepartment(request.getDepartment());

        if (request.getDateOfBirth() != null) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                student.setDateOfBirth(LocalDate.parse(request.getDateOfBirth(), formatter));
            } catch (Exception e) {
                // Handle date parsing error
            }
        }

        return studentRepository.save(student);
    }

    public Student createStudent(Student student) {
        try {
            System.out.println("Creating student with data: " + student.getRollNumber() + ", " + student.getUser().getName());
            
            if (studentRepository.existsByRollNumber(student.getRollNumber())) {
                throw new RuntimeException("Roll number already exists");
            }
            
            // First, create and save the User
            User user = student.getUser();
            if (user.getEmail() != null && userRepository.existsByEmail(user.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            
            // Set user role to STUDENT if not set
            if (user.getRole() == null) {
                user.setRole(Role.STUDENT);
            }
            
            // Encode password if provided
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            
            User savedUser = userRepository.save(user);
            System.out.println("User saved with ID: " + savedUser.getId());
            
            // Then create the student with the saved User
            Student newStudent = new Student();
            newStudent.setRollNumber(student.getRollNumber());
            newStudent.setDepartment(student.getDepartment());
            newStudent.setCurrentSemester(student.getCurrentSemester());
            newStudent.setDateOfBirth(student.getDateOfBirth());
            newStudent.setUser(savedUser); // Use the saved user
            newStudent.setEnrollmentDate(LocalDate.now());
            
            Student savedStudent = studentRepository.save(newStudent);
            System.out.println("Student saved with ID: " + savedStudent.getId());
            
            // Return clean response object to avoid circular references
            Student response = new Student();
            response.setId(savedStudent.getId());
            response.setRollNumber(savedStudent.getRollNumber());
            response.setDepartment(savedStudent.getDepartment());
            response.setCurrentSemester(savedStudent.getCurrentSemester());
            response.setDateOfBirth(savedStudent.getDateOfBirth());
            response.setEnrollmentDate(savedStudent.getEnrollmentDate());
            
            // Include user info for admin display
            if (savedStudent.getUser() != null) {
                User userResponse = new User();
                userResponse.setId(savedStudent.getUser().getId());
                userResponse.setName(savedStudent.getUser().getName());
                userResponse.setEmail(savedStudent.getUser().getEmail());
                userResponse.setPhoneNumber(savedStudent.getUser().getPhoneNumber());
                userResponse.setRole(savedStudent.getUser().getRole());
                response.setUser(userResponse);
            }
            
            System.out.println("Returning clean student response");
            return response;
            
        } catch (Exception e) {
            System.err.println("Error creating student: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create student: " + e.getMessage());
        }
    }

    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Create a clean response object to avoid circular references
        Student response = new Student();
        response.setId(student.getId());
        response.setRollNumber(student.getRollNumber());
        response.setDepartment(student.getDepartment());
        response.setCurrentSemester(student.getCurrentSemester());
        response.setDateOfBirth(student.getDateOfBirth());
        response.setEnrollmentDate(student.getEnrollmentDate());
        
        // Include user info for admin display
        if (student.getUser() != null) {
            User user = new User();
            user.setId(student.getUser().getId());
            user.setName(student.getUser().getName());
            user.setEmail(student.getUser().getEmail());
            user.setPhoneNumber(student.getUser().getPhoneNumber());
            user.setRole(student.getUser().getRole());
            // Don't include password or sensitive data
            response.setUser(user);
        }
        
        return response;
    }

    public List<Student> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        
        // Create clean response objects to avoid circular references
        return students.stream().map(student -> {
            Student response = new Student();
            response.setId(student.getId());
            response.setRollNumber(student.getRollNumber());
            response.setDepartment(student.getDepartment());
            response.setCurrentSemester(student.getCurrentSemester());
            response.setDateOfBirth(student.getDateOfBirth());
            response.setEnrollmentDate(student.getEnrollmentDate());
            
            // Include user info for admin display
            if (student.getUser() != null) {
                User user = new User();
                user.setId(student.getUser().getId());
                user.setName(student.getUser().getName());
                user.setEmail(student.getUser().getEmail());
                user.setPhoneNumber(student.getUser().getPhoneNumber());
                user.setRole(student.getUser().getRole());
                // Don't include password or sensitive data
                response.setUser(user);
            }
            
            return response;
        }).toList();
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setRollNumber(studentDetails.getRollNumber());
        student.setDepartment(studentDetails.getDepartment());
        student.setCurrentSemester(studentDetails.getCurrentSemester());
        student.setDateOfBirth(studentDetails.getDateOfBirth());

        Student savedStudent = studentRepository.save(student);
        
        // Return clean response object
        Student response = new Student();
        response.setId(savedStudent.getId());
        response.setRollNumber(savedStudent.getRollNumber());
        response.setDepartment(savedStudent.getDepartment());
        response.setCurrentSemester(savedStudent.getCurrentSemester());
        response.setDateOfBirth(savedStudent.getDateOfBirth());
        response.setEnrollmentDate(savedStudent.getEnrollmentDate());
        
        // Include user info for admin display
        if (savedStudent.getUser() != null) {
            User user = new User();
            user.setId(savedStudent.getUser().getId());
            user.setName(savedStudent.getUser().getName());
            user.setEmail(savedStudent.getUser().getEmail());
            user.setPhoneNumber(savedStudent.getUser().getPhoneNumber());
            user.setRole(savedStudent.getUser().getRole());
            response.setUser(user);
        }
        
        return response;
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        studentRepository.delete(student);
    }

    public Student getCurrentStudentProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        Student student = getStudentByUserId(user.getId());
        
        // Create a clean response object to avoid circular references
        Student response = new Student();
        response.setId(student.getId());
        response.setRollNumber(student.getRollNumber());
        response.setDepartment(student.getDepartment());
        response.setCurrentSemester(student.getCurrentSemester());
        response.setDateOfBirth(student.getDateOfBirth());
        response.setEnrollmentDate(student.getEnrollmentDate());
        
        return response;
    }

    public List<Student> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department);
    }

    public List<Student> getStudentsBySemester(Integer semester) {
        return studentRepository.findByCurrentSemester(semester);
    }

    public boolean isStudentOwner(Long studentId, String username) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) return false;
        return student.getUser().getEmail().equals(username);
    }

    public Student createStudentForCurrentUser(Student student) {
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        // Set the user for the student
        student.setUser(currentUser);
        student.setEnrollmentDate(LocalDate.now());
        
        // Check if student already exists for this user
        if (studentRepository.findByUserId(currentUser.getId()).isPresent()) {
            throw new RuntimeException("Student profile already exists for this user");
        }
        
        // Save and return a clean student object without circular references
        Student savedStudent = studentRepository.save(student);
        
        // Create a clean response object to avoid circular references
        Student response = new Student();
        response.setId(savedStudent.getId());
        response.setRollNumber(savedStudent.getRollNumber());
        response.setDepartment(savedStudent.getDepartment());
        response.setCurrentSemester(savedStudent.getCurrentSemester());
        response.setDateOfBirth(savedStudent.getDateOfBirth());
        response.setEnrollmentDate(savedStudent.getEnrollmentDate());
        
        return response;
    }
}
