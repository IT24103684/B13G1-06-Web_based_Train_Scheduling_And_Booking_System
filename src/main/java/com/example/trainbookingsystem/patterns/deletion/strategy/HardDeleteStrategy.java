package com.example.trainbookingsystem.patterns.deletion.strategy;

import com.example.trainbookingsystem.features.passenger_management.PassengerModel;
import com.example.trainbookingsystem.features.passenger_management.PassengerRepo;
import com.example.trainbookingsystem.features.booking_management.BookingRepo;
import com.example.trainbookingsystem.features.booking_management.BookingModel;
import com.example.trainbookingsystem.features.reservation_management.ReservationRepo;
import com.example.trainbookingsystem.features.feedback_management.FeedbackRepo;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class HardDeleteStrategy implements DeleteStrategy {

    @Override
    public boolean delete(PassengerModel passenger, PassengerRepo passengerRepo,
                          BookingRepo bookingRepo, ReservationRepo reservationRepo,
                          FeedbackRepo feedbackRepo) {
        // Delete related entities
        List<BookingModel> bookings = bookingRepo.findByPassenger(passenger);
        for (BookingModel booking : bookings) {
            reservationRepo.deleteByBooking(booking);
        }
        bookingRepo.deleteAll(bookings);
        feedbackRepo.deleteByCreatedBy(passenger);

        // Delete passenger
        passengerRepo.delete(passenger);
        return true;
    }
}