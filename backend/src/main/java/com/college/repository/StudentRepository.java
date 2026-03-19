package com.college.repository;

import com.college.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    List<Student> findByDepartment(String department);
    List<Student> findByCurrentSemester(Integer semester);
    boolean existsByRollNumber(String rollNumber);
    Optional<Student> findByUserId(Long userId);
}
