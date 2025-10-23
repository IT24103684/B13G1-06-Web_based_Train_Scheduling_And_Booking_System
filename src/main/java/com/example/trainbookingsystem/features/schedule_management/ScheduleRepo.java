package com.example.trainbookingsystem.features.schedule_management;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepo extends JpaRepository<ScheduleModel, Long> {

    // New method with pessimistic locking for concurrent booking safety
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ScheduleModel s WHERE s.id = :id")
    Optional<ScheduleModel> findByIdWithLock(@Param("id") Long id);

    List<ScheduleModel> findByDeleteStatus(Boolean deleteStatus);

    Optional<ScheduleModel> findByIdAndDeleteStatus(Long id, Boolean deleteStatus);

    List<ScheduleModel> findByDateAndDeleteStatus(LocalDate date, Boolean deleteStatus);

    List<ScheduleModel> findByFromCityAndToCityAndDeleteStatus(String fromCity, String toCity, Boolean deleteStatus);

    List<ScheduleModel> findByFromCityAndToCityAndDateAndDeleteStatus(String fromCity, String toCity, LocalDate date, Boolean deleteStatus);

    List<ScheduleModel> findByDeleteStatusOrderByDateAscTimeAsc(Boolean deleteStatus);
}