package com.college.controller;

import com.college.model.Result;
import com.college.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/results")
@CrossOrigin(origins = "http://localhost:5173")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Result> createResult(@RequestBody Result result) {
        Result createdResult = resultService.createResult(result);
        return ResponseEntity.ok(createdResult);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Result>> getAllResults() {
        List<Result> results = resultService.getAllResults();
        return ResponseEntity.ok(results);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or @resultService.isResultOwner(#studentId, authentication.name)")
    public ResponseEntity<List<Result>> getResultsByStudent(@PathVariable Long studentId) {
        List<Result> results = resultService.getResultsByStudent(studentId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<Result>> getResultsByCourse(@PathVariable Long courseId) {
        List<Result> results = resultService.getResultsByCourse(courseId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/student/{studentId}/semester/{semester}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or @resultService.isResultOwner(#studentId, authentication.name)")
    public ResponseEntity<List<Result>> getResultsByStudentAndSemester(@PathVariable Long studentId, @PathVariable Integer semester) {
        List<Result> results = resultService.getResultsByStudentAndSemester(studentId, semester);
        return ResponseEntity.ok(results);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Result> updateResult(@PathVariable Long id, @RequestBody Result resultDetails) {
        Result updatedResult = resultService.updateResult(id, resultDetails);
        return ResponseEntity.ok(updatedResult);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteResult(@PathVariable Long id) {
        resultService.deleteResult(id);
        return ResponseEntity.ok("Result deleted successfully");
    }

    @GetMapping("/my-results")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Result>> getMyResults() {
        List<Result> results = resultService.getMyResults();
        return ResponseEntity.ok(results);
    }

    // Teacher-specific endpoints
    @GetMapping("/teacher/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<Result>> getAllResultsForTeacher() {
        List<Result> results = resultService.getAllResults();
        return ResponseEntity.ok(results);
    }

    @GetMapping("/teacher/course/{courseId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<Result>> getResultsByCourseForTeacher(@PathVariable Long courseId) {
        List<Result> results = resultService.getResultsByCourse(courseId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/teacher/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<Result>> getResultsByStudentForTeacher(@PathVariable Long studentId) {
        List<Result> results = resultService.getResultsByStudent(studentId);
        return ResponseEntity.ok(results);
    }
}
