package com.college.service;

import com.college.model.Course;
import com.college.model.Teacher;
import com.college.repository.CourseRepository;
import com.college.repository.TeacherRepository;
import com.college.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    public CourseService(CourseRepository courseRepository, TeacherRepository teacherRepository,
                       UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
    }

    public Course createCourse(Course course) {
        try {
            System.out.println("Creating course with data: " + course.getCourseCode() + ", " + course.getName());
            
            if (courseRepository.existsByCourseCode(course.getCourseCode())) {
                throw new RuntimeException("Course code already exists");
            }
            
            // Create a new course entity to avoid any issues with incoming object
            Course newCourse = new Course();
            newCourse.setCourseCode(course.getCourseCode());
            newCourse.setName(course.getName());
            newCourse.setDescription(course.getDescription());
            newCourse.setCredits(course.getCredits());
            newCourse.setDepartment(course.getDepartment());
            newCourse.setSemester(course.getSemester());
            newCourse.setTeacher(course.getTeacher());
            
            Course savedCourse = courseRepository.save(newCourse);
            System.out.println("Course saved with ID: " + savedCourse.getId());
            
            // Return clean response object to avoid circular references
            Course response = new Course();
            response.setId(savedCourse.getId());
            response.setCourseCode(savedCourse.getCourseCode());
            response.setName(savedCourse.getName());
            response.setDescription(savedCourse.getDescription());
            response.setCredits(savedCourse.getCredits());
            response.setDepartment(savedCourse.getDepartment());
            response.setSemester(savedCourse.getSemester());
            
            // Include teacher info if present
            if (savedCourse.getTeacher() != null) {
                Teacher teacher = new Teacher();
                teacher.setId(savedCourse.getTeacher().getId());
                teacher.setEmployeeId(savedCourse.getTeacher().getEmployeeId());
                teacher.setQualification(savedCourse.getTeacher().getQualification());
                teacher.setSpecialization(savedCourse.getTeacher().getSpecialization());
                teacher.setDepartment(savedCourse.getTeacher().getDepartment());
                response.setTeacher(teacher);
            }
            
            System.out.println("Returning clean course response");
            return response;
            
        } catch (Exception e) {
            System.err.println("Error creating course: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create course: " + e.getMessage());
        }
    }

    public Course getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Return clean response object to avoid circular references
        Course response = new Course();
        response.setId(course.getId());
        response.setCourseCode(course.getCourseCode());
        response.setName(course.getName());
        response.setDescription(course.getDescription());
        response.setCredits(course.getCredits());
        response.setDepartment(course.getDepartment());
        response.setSemester(course.getSemester());
        
        // Include teacher info if present
        if (course.getTeacher() != null) {
            Teacher teacher = new Teacher();
            teacher.setId(course.getTeacher().getId());
            teacher.setEmployeeId(course.getTeacher().getEmployeeId());
            teacher.setQualification(course.getTeacher().getQualification());
            teacher.setSpecialization(course.getTeacher().getSpecialization());
            teacher.setDepartment(course.getTeacher().getDepartment());
            response.setTeacher(teacher);
        }
        
        return response;
    }

    public List<Course> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        
        // Create clean response objects to avoid circular references
        return courses.stream().map(course -> {
            Course response = new Course();
            response.setId(course.getId());
            response.setCourseCode(course.getCourseCode());
            response.setName(course.getName());
            response.setDescription(course.getDescription());
            response.setCredits(course.getCredits());
            response.setDepartment(course.getDepartment());
            response.setSemester(course.getSemester());
            
            // Include teacher info if present
            if (course.getTeacher() != null) {
                Teacher teacher = new Teacher();
                teacher.setId(course.getTeacher().getId());
                teacher.setEmployeeId(course.getTeacher().getEmployeeId());
                teacher.setQualification(course.getTeacher().getQualification());
                teacher.setSpecialization(course.getTeacher().getSpecialization());
                teacher.setDepartment(course.getTeacher().getDepartment());
                response.setTeacher(teacher);
            }
            
            return response;
        }).toList();
    }

    public List<Course> getCoursesByDepartment(String department) {
        return courseRepository.findByDepartment(department);
    }

    public List<Course> getCoursesBySemester(Integer semester) {
        return courseRepository.findBySemester(semester);
    }

    public List<Course> getCoursesByTeacher(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId);
    }

    public Course updateCourse(Long id, Course courseDetails) {
        Course course = getCourseById(id);
        
        course.setCourseCode(courseDetails.getCourseCode());
        course.setName(courseDetails.getName());
        course.setDescription(courseDetails.getDescription());
        course.setCredits(courseDetails.getCredits());
        course.setDepartment(courseDetails.getDepartment());
        course.setSemester(courseDetails.getSemester());
        course.setTeacher(courseDetails.getTeacher());
        
        Course savedCourse = courseRepository.save(course);
        
        // Return clean response object
        Course response = new Course();
        response.setId(savedCourse.getId());
        response.setCourseCode(savedCourse.getCourseCode());
        response.setName(savedCourse.getName());
        response.setDescription(savedCourse.getDescription());
        response.setCredits(savedCourse.getCredits());
        response.setDepartment(savedCourse.getDepartment());
        response.setSemester(savedCourse.getSemester());
        
        // Include teacher info if present
        if (savedCourse.getTeacher() != null) {
            Teacher teacher = new Teacher();
            teacher.setId(savedCourse.getTeacher().getId());
            teacher.setEmployeeId(savedCourse.getTeacher().getEmployeeId());
            teacher.setQualification(savedCourse.getTeacher().getQualification());
            teacher.setSpecialization(savedCourse.getTeacher().getSpecialization());
            teacher.setDepartment(savedCourse.getTeacher().getDepartment());
            response.setTeacher(teacher);
        }
        
        return response;
    }

    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        courseRepository.delete(course);
    }

    public Course assignTeacher(Long courseId, Long teacherId) {
        Course course = getCourseById(courseId);
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        
        course.setTeacher(teacher);
        return courseRepository.save(course);
    }

    public List<Course> getMyCourses() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));
        
        return courseRepository.findByTeacherId(teacher.getId());
    }
}
