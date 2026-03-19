package com.college.repository;

import com.college.model.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    List<Timetable> findByStudentId(Long studentId);
    List<Timetable> findBySemester(Integer semester);
    List<Timetable> findByDayOfWeek(String dayOfWeek);
    List<Timetable> findByStudentIdAndSemester(Long studentId, Integer semester);
}
