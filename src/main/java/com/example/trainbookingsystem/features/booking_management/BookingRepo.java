package com.example.trainbookingsystem.features.booking_management;

import com.example.trainbookingsystem.features.passenger_management.PassengerModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepo extends JpaRepository<BookingModel, Long> {

    @Query("SELECT b FROM BookingModel b WHERE b.passenger.id = :passengerId AND b.deleteStatus = false")
    List<BookingModel> findByPassengerIdAndDeleteStatusFalse(@Param("passengerId") Long passengerId);

    @Query("SELECT b FROM BookingModel b WHERE b.schedule.id = :scheduleId AND b.deleteStatus = false")
    List<BookingModel> findByScheduleIdAndDeleteStatusFalse(@Param("scheduleId") Long scheduleId);

    List<BookingModel> findByDeleteStatus(Boolean deleteStatus);

    Optional<BookingModel> findByIdAndDeleteStatus(Long id, Boolean deleteStatus);

    List<BookingModel> findByPassengerIdAndDeleteStatus(Long passengerId, Boolean deleteStatus);

    List<BookingModel> findByScheduleIdAndDeleteStatus(Long scheduleId, Boolean deleteStatus);

    List<BookingModel> findByDeleteStatusOrderByCreatedAtDesc(Boolean deleteStatus);

    List<BookingModel> findByPassengerIdAndDeleteStatusOrderByCreatedAtDesc(Long passengerId, Boolean deleteStatus);

    List<BookingModel> findByPassenger(PassengerModel passenger);

    List<BookingModel> findByDeleteStatusFalse();

    @Query("SELECT b FROM BookingModel b WHERE b.deleteStatus = false AND b.createdAt < :cutoffTime AND NOT EXISTS (SELECT r FROM ReservationModel r WHERE r.booking = b AND r.deleteStatus = false)")
    List<BookingModel> findExpiredBookingsWithoutReservations(@Param("cutoffTime") LocalDateTime cutoffTime);

    List<BookingModel> findByCreatedAtBeforeAndDeleteStatus(LocalDateTime createdAt, Boolean deleteStatus);

    @Query("SELECT b FROM BookingModel b WHERE b.createdAt < :cutoffTime AND NOT EXISTS (SELECT r FROM ReservationModel r WHERE r.booking = b)")
    List<BookingModel> findBookingsWithoutReservations(@Param("cutoffTime") LocalDateTime cutoffTime);

    @Query("SELECT b FROM BookingModel b WHERE b.schedule.id = :scheduleId")
    List<BookingModel> findByScheduleId(@Param("scheduleId") Long scheduleId);

    @Query("SELECT COUNT(b) FROM BookingModel b WHERE b.schedule.id = :scheduleId AND b.deleteStatus = false")
    int countActiveBookingsByScheduleId(@Param("scheduleId") Long scheduleId);
}
