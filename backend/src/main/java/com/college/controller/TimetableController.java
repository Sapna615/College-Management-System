package com.college.controller;

import com.college.model.Timetable;
import com.college.service.TimetableService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/timetables")
@CrossOrigin(origins = "http://localhost:5173")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<Timetable>> getAllTimetables() {
        List<Timetable> timetables = timetableService.getAllTimetables();
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Timetable> getTimetableById(@PathVariable Long id) {
        Timetable timetable = timetableService.getTimetableById(id);
        return ResponseEntity.ok(timetable);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Timetable> createTimetable(@RequestBody Timetable timetable) {
        Timetable createdTimetable = timetableService.createTimetable(timetable);
        return ResponseEntity.ok(createdTimetable);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Timetable> updateTimetable(@PathVariable Long id, @RequestBody Timetable timetableDetails) {
        Timetable updatedTimetable = timetableService.updateTimetable(id, timetableDetails);
        return ResponseEntity.ok(updatedTimetable);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteTimetable(@PathVariable Long id) {
        timetableService.deleteTimetable(id);
        return ResponseEntity.ok("Timetable deleted successfully");
    }

    @GetMapping("/my-timetable")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Timetable>> getMyTimetable() {
        List<Timetable> timetables = timetableService.getMyTimetable();
        return ResponseEntity.ok(timetables);
    }

    @GetMapping("/semester/{semester}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<Timetable>> getTimetableBySemester(@PathVariable Integer semester) {
        List<Timetable> timetables = timetableService.getTimetableBySemester(semester);
        return ResponseEntity.ok(timetables);
    }
}
