package com.college.service;

import com.college.model.Result;
import com.college.model.Student;
import com.college.model.Course;
import com.college.model.User;
import com.college.repository.ResultRepository;
import com.college.repository.StudentRepository;
import com.college.repository.CourseRepository;
import com.college.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public ResultService(ResultRepository resultRepository, StudentRepository studentRepository,
                       CourseRepository courseRepository, UserRepository userRepository) {
        this.resultRepository = resultRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public Result createResult(Result result) {
        try {
            System.out.println("Creating result with data: studentId=" + result.getStudentId() + ", courseId=" + result.getCourseId() + ", marks=" + result.getMarks());
            
            // Handle both ID-based and object-based input
            Student student;
            Course course;
            
            if (result.getStudent() != null) {
                // If student object is provided
                student = studentRepository.findById(result.getStudent().getId())
                        .orElseThrow(() -> new RuntimeException("Student not found"));
            } else if (result.getStudentId() != null) {
                // If studentId is provided (from frontend)
                student = studentRepository.findById(result.getStudentId())
                        .orElseThrow(() -> new RuntimeException("Student not found"));
            } else {
                throw new RuntimeException("Student or studentId must be provided");
            }
            
            if (result.getCourse() != null) {
                // If course object is provided
                course = courseRepository.findById(result.getCourse().getId())
                        .orElseThrow(() -> new RuntimeException("Course not found"));
            } else if (result.getCourseId() != null) {
                // If courseId is provided (from frontend)
                course = courseRepository.findById(result.getCourseId())
                        .orElseThrow(() -> new RuntimeException("Course not found"));
            } else {
                throw new RuntimeException("Course or courseId must be provided");
            }

            // Create new result object to avoid issues
            Result newResult = new Result();
            newResult.setStudent(student);
            newResult.setCourse(course);
            newResult.setMarks(result.getMarks());
            newResult.setGrade(result.getGrade());
            newResult.setSemester(result.getSemester());
            newResult.setExamType(result.getExamType());
            
            Result savedResult = resultRepository.save(newResult);
            System.out.println("Result saved with ID: " + savedResult.getId());
            
            // Return clean response object to avoid circular references
            Result response = new Result();
            response.setId(savedResult.getId());
            response.setMarks(savedResult.getMarks());
            response.setGrade(savedResult.getGrade());
            response.setSemester(savedResult.getSemester());
            response.setExamType(savedResult.getExamType());
            
            // Include minimal student info for display (no circular references)
            if (savedResult.getStudent() != null) {
                Student studentResponse = new Student();
                studentResponse.setId(savedResult.getStudent().getId());
                studentResponse.setRollNumber(savedResult.getStudent().getRollNumber());
                
                // Only include minimal user info (no student reference back)
                if (savedResult.getStudent().getUser() != null) {
                    User userResponse = new User();
                    userResponse.setId(savedResult.getStudent().getUser().getId());
                    userResponse.setName(savedResult.getStudent().getUser().getName());
                    userResponse.setEmail(savedResult.getStudent().getUser().getEmail());
                    // Don't set student reference to avoid circular reference
                    studentResponse.setUser(userResponse);
                }
                response.setStudent(studentResponse);
            }
            
            // Include minimal course info for display (no result references back)
            if (savedResult.getCourse() != null) {
                Course courseResponse = new Course();
                courseResponse.setId(savedResult.getCourse().getId());
                courseResponse.setName(savedResult.getCourse().getName());
                courseResponse.setCourseCode(savedResult.getCourse().getCourseCode());
                courseResponse.setDepartment(savedResult.getCourse().getDepartment());
                // Don't include teacher or results to avoid circular references
                response.setCourse(courseResponse);
            }
            
            return response;
            
        } catch (Exception e) {
            System.err.println("Error creating result: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create result: " + e.getMessage());
        }
    }

    public List<Result> getAllResults() {
        try {
            System.out.println("Fetching all results");
            List<Result> results = resultRepository.findAll();
            
            // Create clean response list to avoid circular references
            return results.stream().map(result -> {
                Result cleanResult = new Result();
                cleanResult.setId(result.getId());
                cleanResult.setMarks(result.getMarks());
                cleanResult.setGrade(result.getGrade());
                cleanResult.setSemester(result.getSemester());
                cleanResult.setExamType(result.getExamType());
                
                // Include minimal student info
                if (result.getStudent() != null) {
                    Student studentResponse = new Student();
                    studentResponse.setId(result.getStudent().getId());
                    studentResponse.setRollNumber(result.getStudent().getRollNumber());
                    
                    if (result.getStudent().getUser() != null) {
                        User userResponse = new User();
                        userResponse.setId(result.getStudent().getUser().getId());
                        userResponse.setName(result.getStudent().getUser().getName());
                        userResponse.setEmail(result.getStudent().getUser().getEmail());
                        studentResponse.setUser(userResponse);
                    }
                    cleanResult.setStudent(studentResponse);
                }
                
                // Include minimal course info
                if (result.getCourse() != null) {
                    Course courseResponse = new Course();
                    courseResponse.setId(result.getCourse().getId());
                    courseResponse.setName(result.getCourse().getName());
                    courseResponse.setCourseCode(result.getCourse().getCourseCode());
                    courseResponse.setDepartment(result.getCourse().getDepartment());
                    cleanResult.setCourse(courseResponse);
                }
                
                return cleanResult;
            }).collect(java.util.stream.Collectors.toList());
            
        } catch (Exception e) {
            System.err.println("Error fetching all results: " + e.getMessage());
            throw new RuntimeException("Failed to fetch results: " + e.getMessage());
        }
    }

    public List<Result> getResultsByStudent(Long studentId) {
        return resultRepository.findByStudentId(studentId);
    }

    public List<Result> getResultsByCourse(Long courseId) {
        return resultRepository.findByCourseId(courseId);
    }

    public List<Result> getResultsByStudentAndSemester(Long studentId, Integer semester) {
        return resultRepository.findByStudentIdAndSemester(studentId, semester);
    }

    public Result updateResult(Long id, Result resultDetails) {
        try {
            System.out.println("Updating result with ID: " + id);
            Result result = resultRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Result not found"));

            result.setExamType(resultDetails.getExamType());
            result.setMarks(resultDetails.getMarks());
            result.setMaxMarks(resultDetails.getMaxMarks());
            result.setSemester(resultDetails.getSemester());
            result.setAcademicYear(resultDetails.getAcademicYear());

            Result savedResult = resultRepository.save(result);
            System.out.println("Result updated successfully");

            // Return clean response object to avoid circular references
            Result response = new Result();
            response.setId(savedResult.getId());
            response.setMarks(savedResult.getMarks());
            response.setGrade(savedResult.getGrade());
            response.setSemester(savedResult.getSemester());
            response.setExamType(savedResult.getExamType());
            
            // Include minimal student info (no circular references)
            if (savedResult.getStudent() != null) {
                Student studentResponse = new Student();
                studentResponse.setId(savedResult.getStudent().getId());
                studentResponse.setRollNumber(savedResult.getStudent().getRollNumber());
                
                if (savedResult.getStudent().getUser() != null) {
                    User userResponse = new User();
                    userResponse.setId(savedResult.getStudent().getUser().getId());
                    userResponse.setName(savedResult.getStudent().getUser().getName());
                    userResponse.setEmail(savedResult.getStudent().getUser().getEmail());
                    studentResponse.setUser(userResponse);
                }
                response.setStudent(studentResponse);
            }
            
            // Include minimal course info (no circular references)
            if (savedResult.getCourse() != null) {
                Course courseResponse = new Course();
                courseResponse.setId(savedResult.getCourse().getId());
                courseResponse.setName(savedResult.getCourse().getName());
                courseResponse.setCourseCode(savedResult.getCourse().getCourseCode());
                courseResponse.setDepartment(savedResult.getCourse().getDepartment());
                response.setCourse(courseResponse);
            }
            
            return response;
            
        } catch (Exception e) {
            System.err.println("Error updating result: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update result: " + e.getMessage());
        }
    }

    public void deleteResult(Long id) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Result not found"));
        resultRepository.delete(result);
    }

    public List<Result> getMyResults() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            var user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Current user not found"));
            
            Student student = studentRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Student profile not found"));
            
            List<Result> results = resultRepository.findByStudentId(student.getId());
            System.out.println("Fetching results for student: " + student.getId() + ", found " + results.size() + " results");
            
            // Create clean response list to avoid circular references
            return results.stream().map(result -> {
                Result cleanResult = new Result();
                cleanResult.setId(result.getId());
                cleanResult.setMarks(result.getMarks());
                cleanResult.setGrade(result.getGrade());
                cleanResult.setSemester(result.getSemester());
                cleanResult.setExamType(result.getExamType());
                
                // Include minimal course info (no circular references)
                if (result.getCourse() != null) {
                    Course courseResponse = new Course();
                    courseResponse.setId(result.getCourse().getId());
                    courseResponse.setName(result.getCourse().getName());
                    courseResponse.setCourseCode(result.getCourse().getCourseCode());
                    courseResponse.setDepartment(result.getCourse().getDepartment());
                    cleanResult.setCourse(courseResponse);
                }
                
                return cleanResult;
            }).collect(java.util.stream.Collectors.toList());
            
        } catch (Exception e) {
            System.err.println("Error fetching student results: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch student results: " + e.getMessage());
        }
    }

    public boolean isResultOwner(Long studentId, String email) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) return false;
        return student.getUser().getEmail().equals(email);
    }
}
