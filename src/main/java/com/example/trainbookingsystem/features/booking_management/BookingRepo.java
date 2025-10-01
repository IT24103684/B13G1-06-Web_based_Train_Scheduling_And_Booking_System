package com.example.trainbookingsystem.features.booking_management;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepo extends JpaRepository<BookingModel, Long> {

    List<BookingModel> findByDeleteStatus(Boolean deleteStatus);

    Optional<BookingModel> findByIdAndDeleteStatus(Long id, Boolean deleteStatus);

    List<BookingModel> findByPassengerIdAndDeleteStatus(Long passengerId, Boolean deleteStatus);

    List<BookingModel> findByScheduleIdAndDeleteStatus(Long scheduleId, Boolean deleteStatus);

    List<BookingModel> findByDeleteStatusOrderByCreatedAtDesc(Boolean deleteStatus);

    List<BookingModel> findByPassengerIdAndDeleteStatusOrderByCreatedAtDesc(Long passengerId, Boolean deleteStatus);
}