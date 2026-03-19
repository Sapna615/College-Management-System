package com.college.service;

import com.college.model.Timetable;
import com.college.model.Student;
import com.college.model.User;
import com.college.repository.TimetableRepository;
import com.college.repository.StudentRepository;
import com.college.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public TimetableService(TimetableRepository timetableRepository, StudentRepository studentRepository, 
                           UserRepository userRepository) {
        this.timetableRepository = timetableRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    public Timetable createTimetable(Timetable timetable) {
        try {
            System.out.println("Creating timetable with data: " + timetable.getDayOfWeek() + ", " + timetable.getSubject());
            
            // Create a new timetable entity to avoid any issues with the incoming object
            Timetable newTimetable = new Timetable();
            newTimetable.setDayOfWeek(timetable.getDayOfWeek());
            newTimetable.setStartTime(timetable.getStartTime());
            newTimetable.setEndTime(timetable.getEndTime());
            newTimetable.setSubject(timetable.getSubject());
            newTimetable.setRoom(timetable.getRoom());
            newTimetable.setTeacherName(timetable.getTeacherName());
            newTimetable.setSemester(timetable.getSemester());
            
            // Set course and teacher to null to avoid database constraint issues
            newTimetable.setCourse(null);
            newTimetable.setTeacher(null);
            
            // If a specific student is mentioned, link them
            if (timetable.getStudent() != null && timetable.getStudent().getId() != null) {
                System.out.println("Linking to student ID: " + timetable.getStudent().getId());
                Student student = studentRepository.findById(timetable.getStudent().getId())
                        .orElseThrow(() -> new RuntimeException("Student not found"));
                newTimetable.setStudent(student);
            }
            
            Timetable savedTimetable = timetableRepository.save(newTimetable);
            System.out.println("Timetable saved with ID: " + savedTimetable.getId());
            
            // Return clean response object to avoid circular references
            Timetable response = new Timetable();
            response.setId(savedTimetable.getId());
            response.setDayOfWeek(savedTimetable.getDayOfWeek());
            response.setStartTime(savedTimetable.getStartTime());
            response.setEndTime(savedTimetable.getEndTime());
            response.setSubject(savedTimetable.getSubject());
            response.setRoom(savedTimetable.getRoom());
            response.setTeacherName(savedTimetable.getTeacherName());
            response.setSemester(savedTimetable.getSemester());
            
            // Include student info if present
            if (savedTimetable.getStudent() != null) {
                Student student = new Student();
                student.setId(savedTimetable.getStudent().getId());
                student.setRollNumber(savedTimetable.getStudent().getRollNumber());
                student.setDepartment(savedTimetable.getStudent().getDepartment());
                // Don't include user relationship to avoid circular refs
                response.setStudent(student);
            }
            
            System.out.println("Returning clean timetable response");
            return response;
            
        } catch (Exception e) {
            System.err.println("Error creating timetable: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create timetable: " + e.getMessage());
        }
    }

    public List<Timetable> getAllTimetables() {
        List<Timetable> timetables = timetableRepository.findAll();
        
        // Create clean response objects to avoid circular references
        return timetables.stream().map(timetable -> {
            Timetable response = new Timetable();
            response.setId(timetable.getId());
            response.setDayOfWeek(timetable.getDayOfWeek());
            response.setStartTime(timetable.getStartTime());
            response.setEndTime(timetable.getEndTime());
            response.setSubject(timetable.getSubject());
            response.setRoom(timetable.getRoom());
            response.setTeacherName(timetable.getTeacherName());
            response.setSemester(timetable.getSemester());
            
            // Include student info if present
            if (timetable.getStudent() != null) {
                Student student = new Student();
                student.setId(timetable.getStudent().getId());
                student.setRollNumber(timetable.getStudent().getRollNumber());
                student.setDepartment(timetable.getStudent().getDepartment());
                // Don't include user relationship to avoid circular refs
                response.setStudent(student);
            }
            
            return response;
        }).toList();
    }

    public Timetable getTimetableById(Long id) {
        Timetable timetable = timetableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timetable not found"));
        
        // Return clean response object to avoid circular references
        Timetable response = new Timetable();
        response.setId(timetable.getId());
        response.setDayOfWeek(timetable.getDayOfWeek());
        response.setStartTime(timetable.getStartTime());
        response.setEndTime(timetable.getEndTime());
        response.setSubject(timetable.getSubject());
        response.setRoom(timetable.getRoom());
        response.setTeacherName(timetable.getTeacherName());
        response.setSemester(timetable.getSemester());
        
        // Include student info if present
        if (timetable.getStudent() != null) {
            Student student = new Student();
            student.setId(timetable.getStudent().getId());
            student.setRollNumber(timetable.getStudent().getRollNumber());
            student.setDepartment(timetable.getStudent().getDepartment());
            // Don't include user relationship to avoid circular refs
            response.setStudent(student);
        }
        
        return response;
    }

    public Timetable updateTimetable(Long id, Timetable timetableDetails) {
        Timetable timetable = timetableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timetable not found"));
        
        timetable.setDayOfWeek(timetableDetails.getDayOfWeek());
        timetable.setStartTime(timetableDetails.getStartTime());
        timetable.setEndTime(timetableDetails.getEndTime());
        timetable.setSubject(timetableDetails.getSubject());
        timetable.setRoom(timetableDetails.getRoom());
        timetable.setTeacherName(timetableDetails.getTeacherName());
        timetable.setSemester(timetableDetails.getSemester());
        
        // Update student if specified
        if (timetableDetails.getStudent() != null && timetableDetails.getStudent().getId() != null) {
            Student student = studentRepository.findById(timetableDetails.getStudent().getId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            timetable.setStudent(student);
        }
        
        Timetable savedTimetable = timetableRepository.save(timetable);
        
        // Return clean response object
        Timetable response = new Timetable();
        response.setId(savedTimetable.getId());
        response.setDayOfWeek(savedTimetable.getDayOfWeek());
        response.setStartTime(savedTimetable.getStartTime());
        response.setEndTime(savedTimetable.getEndTime());
        response.setSubject(savedTimetable.getSubject());
        response.setRoom(savedTimetable.getRoom());
        response.setTeacherName(savedTimetable.getTeacherName());
        response.setSemester(savedTimetable.getSemester());
        
        // Include student info if present
        if (savedTimetable.getStudent() != null) {
            Student student = new Student();
            student.setId(savedTimetable.getStudent().getId());
            student.setRollNumber(savedTimetable.getStudent().getRollNumber());
            student.setDepartment(savedTimetable.getStudent().getDepartment());
            // Don't include user relationship to avoid circular refs
            response.setStudent(student);
        }
        
        return response;
    }

    public void deleteTimetable(Long id) {
        Timetable timetable = timetableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timetable not found"));
        timetableRepository.delete(timetable);
    }

    public List<Timetable> getMyTimetable() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
        
        // Get timetables for this student's semester
        List<Timetable> semesterTimetables = timetableRepository.findBySemester(student.getCurrentSemester());
        
        // Filter for timetables that are either:
        // 1. Assigned to this specific student, OR
        // 2. Not assigned to any specific student (for all students)
        return semesterTimetables.stream()
                .filter(t -> t.getStudent() == null || t.getStudent().getId().equals(student.getId()))
                .toList();
    }

    public List<Timetable> getTimetableBySemester(Integer semester) {
        return timetableRepository.findBySemester(semester);
    }
}
