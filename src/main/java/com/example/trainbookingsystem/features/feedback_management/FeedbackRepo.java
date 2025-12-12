package com.example.trainbookingsystem.features.feedback_management;

import com.example.trainbookingsystem.features.passenger_management.PassengerModel;
import com.example.trainbookingsystem.features.payment_management.PaymentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepo extends JpaRepository<FeedbackModel, Long> {

    List<FeedbackModel> findByDeleteStatus(Boolean deleteStatus);

    Optional<FeedbackModel> findByIdAndDeleteStatus(Long id, Boolean deleteStatus);

    List<FeedbackModel> findByCreatedByIdAndDeleteStatus(Long passengerId, Boolean deleteStatus);

    List<FeedbackModel> findByDeleteStatusOrderByCreatedAtDesc(Boolean deleteStatus);

    void deleteByCreatedBy(PassengerModel passenger);

    @Repository
    public interface PaymentRepo extends JpaRepository<PaymentModel, Long> {

        Optional<PaymentModel> findByBookingIdAndDeleteStatus(Long bookingId, Boolean deleteStatus);


        @Query("SELECT p FROM PaymentModel p WHERE p.booking.id = :bookingId")
        Optional<PaymentModel> findByBookingId(@Param("bookingId") Long bookingId);
    }
}