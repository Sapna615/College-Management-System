package com.college.controller;

import com.college.model.Attendance;
import com.college.model.Student;
import com.college.model.Course;
import com.college.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/mark")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Attendance> markAttendance(@RequestBody Attendance attendance) {
        Attendance markedAttendance = attendanceService.markAttendance(attendance);
        
        // Create clean response to avoid lazy loading issues
        Attendance response = new Attendance();
        response.setId(markedAttendance.getId());
        response.setDate(markedAttendance.getDate());
        response.setPresent(markedAttendance.getPresent());
        response.setMarkedBy(markedAttendance.getMarkedBy());
        
        // Include basic student and course info without lazy loading
        if (markedAttendance.getStudent() != null) {
            Student student = new Student();
            student.setId(markedAttendance.getStudent().getId());
            response.setStudent(student);
        }
        
        if (markedAttendance.getCourse() != null) {
            Course course = new Course();
            course.setId(markedAttendance.getCourse().getId());
            course.setCourseCode(markedAttendance.getCourse().getCourseCode());
            course.setName(markedAttendance.getCourse().getName());
            response.setCourse(course);
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or @attendanceService.isAttendanceOwner(#studentId, authentication.name)")
    public ResponseEntity<List<Attendance>> getAttendanceByStudent(@PathVariable Long studentId) {
        List<Attendance> attendances = attendanceService.getAttendanceByStudent(studentId);
        return ResponseEntity.ok(attendances);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<Attendance>> getAttendanceByCourse(@PathVariable Long courseId) {
        List<Attendance> attendances = attendanceService.getAttendanceByCourse(courseId);
        return ResponseEntity.ok(attendances);
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or @attendanceService.isAttendanceOwner(#studentId, authentication.name)")
    public ResponseEntity<List<Attendance>> getAttendanceByStudentAndCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        List<Attendance> attendances = attendanceService.getAttendanceByStudentAndCourse(studentId, courseId);
        return ResponseEntity.ok(attendances);
    }

    @GetMapping("/date/{date}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Attendance> attendances = attendanceService.getAttendanceByDate(date);
        
        // Create clean response to avoid lazy loading issues
        List<Attendance> cleanAttendances = attendances.stream().map(att -> {
            Attendance response = new Attendance();
            response.setId(att.getId());
            response.setDate(att.getDate());
            response.setPresent(att.getPresent());
            response.setMarkedBy(att.getMarkedBy());
            
            // Include basic student and course info without lazy loading
            if (att.getStudent() != null) {
                Student student = new Student();
                student.setId(att.getStudent().getId());
                response.setStudent(student);
            }
            
            if (att.getCourse() != null) {
                Course course = new Course();
                course.setId(att.getCourse().getId());
                course.setCourseCode(att.getCourse().getCourseCode());
                course.setName(att.getCourse().getName());
                response.setCourse(course);
            }
            
            return response;
        }).toList();
        
        return ResponseEntity.ok(cleanAttendances);
    }

    @GetMapping("/student/{studentId}/range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or @attendanceService.isAttendanceOwner(#studentId, authentication.name)")
    public ResponseEntity<List<Attendance>> getStudentAttendanceInRange(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Attendance> attendances = attendanceService.getStudentAttendanceInRange(studentId, startDate, endDate);
        return ResponseEntity.ok(attendances);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Attendance> updateAttendance(@PathVariable Long id, @RequestBody Attendance attendanceDetails) {
        Attendance updatedAttendance = attendanceService.updateAttendance(id, attendanceDetails);
        return ResponseEntity.ok(updatedAttendance);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok("Attendance deleted successfully");
    }

    @GetMapping("/my-attendance")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Attendance>> getMyAttendance() {
        List<Attendance> attendances = attendanceService.getMyAttendance();
        
        // Create clean response to avoid lazy loading issues
        List<Attendance> cleanAttendances = attendances.stream().map(att -> {
            Attendance response = new Attendance();
            response.setId(att.getId());
            response.setDate(att.getDate());
            response.setPresent(att.getPresent());
            response.setMarkedBy(att.getMarkedBy());
            
            // Include basic student and course info without lazy loading
            if (att.getStudent() != null) {
                Student student = new Student();
                student.setId(att.getStudent().getId());
                response.setStudent(student);
            }
            
            if (att.getCourse() != null) {
                Course course = new Course();
                course.setId(att.getCourse().getId());
                course.setCourseCode(att.getCourse().getCourseCode());
                course.setName(att.getCourse().getName());
                response.setCourse(course);
            }
            
            return response;
        }).toList();
        
        return ResponseEntity.ok(cleanAttendances);
    }

    @GetMapping("/student/{studentId}/course/{courseId}/percentage")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or @attendanceService.isAttendanceOwner(#studentId, authentication.name)")
    public ResponseEntity<Double> getAttendancePercentage(@PathVariable Long studentId, @PathVariable Long courseId) {
        Double percentage = attendanceService.calculateAttendancePercentage(studentId, courseId);
        return ResponseEntity.ok(percentage);
    }
}
