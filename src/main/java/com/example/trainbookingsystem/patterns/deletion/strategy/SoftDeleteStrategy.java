package com.example.trainbookingsystem.patterns.deletion.strategy;

import com.example.trainbookingsystem.features.passenger_management.PassengerModel;
import com.example.trainbookingsystem.features.passenger_management.PassengerRepo;
import com.example.trainbookingsystem.features.booking_management.BookingRepo;
import com.example.trainbookingsystem.features.reservation_management.ReservationRepo;
import com.example.trainbookingsystem.features.feedback_management.FeedbackRepo;
import org.springframework.stereotype.Component;


@Component
public class SoftDeleteStrategy implements DeleteStrategy {

    @Override
    public boolean delete(PassengerModel passenger, PassengerRepo passengerRepo,
                          BookingRepo bookingRepo, ReservationRepo reservationRepo,
                          FeedbackRepo feedbackRepo) {
        passenger.setDeleteStatus(true);
        passengerRepo.save(passenger);
        return true;
    }
}