package com.example.trainbookingsystem.features.reservation_management;

import com.example.trainbookingsystem.features.booking_management.BookingModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepo extends JpaRepository<ReservationModel, Long> {

    List<ReservationModel> findByDeleteStatus(Boolean deleteStatus);

    Optional<ReservationModel> findByIdAndDeleteStatus(Long id, Boolean deleteStatus);

    Optional<ReservationModel> findByBookingIdAndDeleteStatus(Long bookingId, Boolean deleteStatus);

    List<ReservationModel> findByBookingPassengerIdAndDeleteStatus(Long passengerId, Boolean deleteStatus);

    List<ReservationModel> findByStatusAndDeleteStatus(String status, Boolean deleteStatus);

    List<ReservationModel> findByDeleteStatusOrderByCreatedAtDesc(Boolean deleteStatus);

    boolean existsByBookingIdAndDeleteStatus(Long bookingId, Boolean deleteStatus);

    void deleteByBooking(BookingModel booking);

    @Query("SELECT r FROM ReservationModel r WHERE r.booking.id = :bookingId")
    Optional<ReservationModel> findByBookingId(@Param("bookingId") Long bookingId);
}