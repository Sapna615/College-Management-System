package com.college.service;

import com.college.model.Attendance;
import com.college.model.Student;
import com.college.model.Course;
import com.college.repository.AttendanceRepository;
import com.college.repository.StudentRepository;
import com.college.repository.CourseRepository;
import com.college.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, StudentRepository studentRepository,
                           CourseRepository courseRepository, UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public Attendance markAttendance(Attendance attendance) {
        Student student = studentRepository.findById(attendance.getStudent().getId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(attendance.getCourse().getId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        attendance.setStudent(student);
        attendance.setCourse(course);
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getAttendanceByCourse(Long courseId) {
        return attendanceRepository.findByCourseId(courseId);
    }

    public List<Attendance> getAttendanceByStudentAndCourse(Long studentId, Long courseId) {
        return attendanceRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    public List<Attendance> getStudentAttendanceInRange(Long studentId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByStudentIdAndDateBetween(studentId, startDate, endDate);
    }

    public Attendance updateAttendance(Long id, Attendance attendanceDetails) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));

        attendance.setDate(attendanceDetails.getDate());
        attendance.setPresent(attendanceDetails.getPresent());
        attendance.setMarkedBy(attendanceDetails.getMarkedBy());

        return attendanceRepository.save(attendance);
    }

    public void deleteAttendance(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));
        attendanceRepository.delete(attendance);
    }

    public List<Attendance> getMyAttendance() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
        
        return attendanceRepository.findByStudentId(student.getId());
    }

    public double calculateAttendancePercentage(Long studentId, Long courseId) {
        List<Attendance> attendances = getAttendanceByStudentAndCourse(studentId, courseId);
        if (attendances.isEmpty()) {
            return 0.0;
        }

        long presentCount = attendances.stream()
                .mapToLong(a -> a.getPresent() ? 1 : 0)
                .sum();

        return (double) presentCount / attendances.size() * 100;
    }

    public boolean isAttendanceOwner(Long studentId, String email) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) return false;
        return student.getUser().getEmail().equals(email);
    }
}
