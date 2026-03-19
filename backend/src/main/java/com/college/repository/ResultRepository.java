package com.college.repository;

import com.college.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    
    @Query("SELECT r FROM Result r WHERE r.student.id = :studentId")
    List<Result> findByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT r FROM Result r WHERE r.course.id = :courseId")
    List<Result> findByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT r FROM Result r WHERE r.student.id = :studentId AND r.semester = :semester")
    List<Result> findByStudentIdAndSemester(@Param("studentId") Long studentId, @Param("semester") Integer semester);
    
    @Query("SELECT r FROM Result r WHERE r.student.id = :studentId AND r.academicYear = :academicYear")
    List<Result> findByStudentIdAndAcademicYear(@Param("studentId") Long studentId, @Param("academicYear") String academicYear);
}
