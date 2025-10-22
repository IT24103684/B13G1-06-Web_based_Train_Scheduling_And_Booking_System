package com.example.trainbookingsystem.features.payment_management;

import org.springframework.data.jpa.repository.JpaRepository;
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
}