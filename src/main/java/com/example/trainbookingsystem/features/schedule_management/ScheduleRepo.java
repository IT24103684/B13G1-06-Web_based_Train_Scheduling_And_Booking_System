package com.example.trainbookingsystem.features.schedule_management;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepo extends JpaRepository<ScheduleModel, Long> {

    List<ScheduleModel> findByDeleteStatus(Boolean deleteStatus);

    Optional<ScheduleModel> findByIdAndDeleteStatus(Long id, Boolean deleteStatus);

    List<ScheduleModel> findByDateAndDeleteStatus(LocalDate date, Boolean deleteStatus);

    List<ScheduleModel> findByFromCityAndToCityAndDeleteStatus(String fromCity, String toCity, Boolean deleteStatus);

    List<ScheduleModel> findByFromCityAndToCityAndDateAndDeleteStatus(String fromCity, String toCity, LocalDate date, Boolean deleteStatus);

    List<ScheduleModel> findByDeleteStatusOrderByDateAscTimeAsc(Boolean deleteStatus);
}