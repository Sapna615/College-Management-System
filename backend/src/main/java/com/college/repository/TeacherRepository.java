package com.college.repository;

import com.college.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByEmployeeId(String employeeId);
    List<Teacher> findByDepartment(String department);
    List<Teacher> findBySpecialization(String specialization);
    boolean existsByEmployeeId(String employeeId);
    Optional<Teacher> findByUserId(Long userId);
}
