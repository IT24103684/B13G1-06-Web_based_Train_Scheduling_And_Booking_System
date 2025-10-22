package com.example.trainbookingsystem.features.payment_management;

import com.example.trainbookingsystem.features.reservation_management.ReservationModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepo extends JpaRepository<PaymentModel, Long> {

    List<PaymentModel> findByDeleteStatus(Boolean deleteStatus);

    Optional<PaymentModel> findByIdAndDeleteStatus(Long id, Boolean deleteStatus);

    Optional<PaymentModel> findByBookingIdAndDeleteStatus(Long bookingId, Boolean deleteStatus);

    List<PaymentModel> findByBookingPassengerIdAndDeleteStatus(Long passengerId, Boolean deleteStatus);

    List<PaymentModel> findByPaymentStatusAndDeleteStatus(String paymentStatus, Boolean deleteStatus);

    List<PaymentModel> findByPaymentMethodAndDeleteStatus(String paymentMethod, Boolean deleteStatus);

    List<PaymentModel> findByDeleteStatusOrderByCreatedAtDesc(Boolean deleteStatus);

    Optional<PaymentModel> findByTransactionId(String transactionId);

    boolean existsByBookingIdAndDeleteStatus(Long bookingId, Boolean deleteStatus);

    // ADD THIS METHOD:
    @Query("SELECT p FROM PaymentModel p WHERE p.booking.id = :bookingId")
    Optional<PaymentModel> findByBookingId(@Param("bookingId") Long bookingId);
}