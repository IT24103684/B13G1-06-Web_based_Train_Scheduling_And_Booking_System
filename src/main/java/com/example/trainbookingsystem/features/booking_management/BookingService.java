package com.example.trainbookingsystem.features.booking_management;

import com.example.trainbookingsystem.features.passenger_management.PassengerModel;
import com.example.trainbookingsystem.features.passenger_management.PassengerRepo;
import com.example.trainbookingsystem.features.payment_management.PaymentModel;
import com.example.trainbookingsystem.features.payment_management.PaymentRepo;
import com.example.trainbookingsystem.features.reservation_management.ReservationModel;
import com.example.trainbookingsystem.features.reservation_management.ReservationRepo;
import com.example.trainbookingsystem.features.schedule_management.ScheduleModel;
import com.example.trainbookingsystem.features.schedule_management.ScheduleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private PassengerRepo passengerRepo;

    @Autowired
    private ScheduleRepo scheduleRepo;

    @Autowired
    private ReservationRepo reservationRepo;

    @Autowired
    private PaymentRepo paymentRepo;

    @Transactional
    public BookingDTOS.BookingResponseDTO createBooking(BookingDTOS.CreateBookingDTO createDTO) {
        // Validate passenger exists and is active
        Optional<PassengerModel> passenger = passengerRepo.findByIdAndDeleteStatus(createDTO.getPassengerId(), false);
        if (!passenger.isPresent()) {
            throw new BookingException("Passenger not found");
        }

        // Use pessimistic locking to prevent concurrent bookings
        Optional<ScheduleModel> schedule = scheduleRepo.findByIdWithLock(createDTO.getScheduleId());
        if (!schedule.isPresent() || schedule.get().getDeleteStatus()) {
            throw new BookingException("Schedule not found");
        }

        // Validate seat availability
        validateSeatAvailability(schedule.get(), createDTO.getClassType(), createDTO.getSeatCount());

        // Create and save booking
        BookingModel booking = new BookingModel(
                passenger.get(),
                schedule.get(),
                createDTO.getSeatCount(),
                createDTO.getClassType(),
                createDTO.getAdditionalNotes()
        );

        BookingModel savedBooking = bookingRepo.save(booking);

        updateScheduleAvailability(schedule.get(), createDTO.getClassType(), createDTO.getSeatCount());

        return convertToResponseDTO(savedBooking);
    }

    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredBookings() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(24);
        List<BookingModel> expiredBookings = bookingRepo.findExpiredBookingsWithoutReservations(cutoffTime);

        for (BookingModel booking : expiredBookings) {
            restoreSeatsToSchedule(booking);
            booking.setDeleteStatus(true);
            bookingRepo.save(booking);
        }
    }

    private void validateSeatAvailability(ScheduleModel schedule, String classType, Integer seatCount) {
        // Validate seat count
        if (seatCount == null || seatCount <= 0) {
            throw new BookingException("Seat count must be greater than 0");
        }

        if (seatCount > 6) {
            throw new BookingException("Maximum 6 seats allowed per booking");
        }

        // Validate class type
        if (classType == null || classType.trim().isEmpty()) {
            throw new BookingException("Class type is required");
        }

        // Validate seat availability
        int availableSeats = getAvailableSeatsByClass(schedule, classType);
        if (seatCount > availableSeats) {
            throw new SeatUnavailableException("Not enough seats available in " + classType + " class. Available: " + availableSeats);
        }
    }

    private int getAvailableSeatsByClass(ScheduleModel schedule, String classType) {
        String normalizedClassType = classType.toUpperCase();
        switch (normalizedClassType) {
            case "ECONOMY":
                return schedule.getAvailableEconomySeats();
            case "BUSINESS":
                return schedule.getAvailableBusinessSeats();
            case "FIRST_CLASS":
                return schedule.getAvailableFirstClassSeats();
            case "LUXURY":
                return schedule.getAvailableLuxurySeats();
            default:
                throw new BookingException("Invalid class type: " + classType);
        }
    }

    private void updateScheduleAvailability(ScheduleModel schedule, String classType, Integer seatCount) {
        String normalizedClassType = classType.toUpperCase();
        switch (normalizedClassType) {
            case "ECONOMY":
                schedule.setAvailableEconomySeats(schedule.getAvailableEconomySeats() - seatCount);
                break;
            case "BUSINESS":
                schedule.setAvailableBusinessSeats(schedule.getAvailableBusinessSeats() - seatCount);
                break;
            case "FIRST_CLASS":
                schedule.setAvailableFirstClassSeats(schedule.getAvailableFirstClassSeats() - seatCount);
                break;
            case "LUXURY":
                schedule.setAvailableLuxurySeats(schedule.getAvailableLuxurySeats() - seatCount);
                break;
        }
        scheduleRepo.save(schedule);
    }

    @Transactional(readOnly = true)
    public List<BookingDTOS.BookingResponseDTO> getAllBookings() {
        return bookingRepo.findByDeleteStatusFalse().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<BookingDTOS.BookingResponseDTO> getBookingById(Long id) {
        return bookingRepo.findByIdAndDeleteStatus(id, false)
                .map(this::convertToResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<BookingDTOS.BookingResponseDTO> getBookingsByPassenger(Long passengerId) {
        return bookingRepo.findByPassengerIdAndDeleteStatusFalse(passengerId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTOS.BookingResponseDTO> getBookingsBySchedule(Long scheduleId) {
        return bookingRepo.findByScheduleIdAndDeleteStatusFalse(scheduleId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<BookingDTOS.BookingResponseDTO> updateBooking(Long id, BookingDTOS.UpdateBookingDTO updateDTO) {
        return bookingRepo.findByIdAndDeleteStatus(id, false).map(booking -> {
            if (updateDTO.getAdditionalNotes() != null) {
                booking.setAdditionalNotes(updateDTO.getAdditionalNotes());
            }
            BookingModel updated = bookingRepo.save(booking);
            return convertToResponseDTO(updated);
        });
    }

    @Transactional
    public boolean deleteBooking(Long id, boolean hardDelete) {
        Optional<BookingModel> booking = bookingRepo.findByIdAndDeleteStatus(id, false);
        if (booking.isPresent()) {
            BookingModel bookingModel = booking.get();

            if (hardDelete) {
                // HARD DELETE - Remove completely from database
                return hardDeleteBooking(bookingModel);
            } else {
                // SOFT DELETE - Keep data with delete status
                return softDeleteBooking(bookingModel);
            }
        }
        return false;
    }

    @Transactional
    protected boolean softDeleteBooking(BookingModel bookingModel) {
        try {
            // 1. FIND AND SOFT DELETE PAYMENT (if exists)
            Optional<PaymentModel> payment = paymentRepo.findByBookingIdAndDeleteStatus(bookingModel.getId(), false);
            if (payment.isPresent()) {
                PaymentModel paymentModel = payment.get();
                paymentModel.setDeleteStatus(true);
                paymentRepo.save(paymentModel);
            }

            // 2. FIND AND SOFT DELETE RESERVATION (if exists)
            Optional<ReservationModel> reservation = reservationRepo.findByBookingIdAndDeleteStatus(bookingModel.getId(), false);
            if (reservation.isPresent()) {
                ReservationModel reservationModel = reservation.get();

                // RESTORE SEATS from reservation
                restoreSeatsFromReservation(reservationModel);

                // Soft delete reservation
                reservationModel.setDeleteStatus(true);
                reservationRepo.save(reservationModel);
            } else {
                // 3. NO RESERVATION - Restore seats from booking directly
                restoreSeatsToSchedule(bookingModel);
            }

            // 4. SOFT DELETE THE BOOKING
            bookingModel.setDeleteStatus(true);
            bookingRepo.save(bookingModel);

            return true;
        } catch (Exception e) {
            throw new BookingException("Failed to soft delete booking: " + e.getMessage());
        }
    }

    @Transactional
    protected boolean hardDeleteBooking(BookingModel bookingModel) {
        try {
            // 1. HARD DELETE PAYMENT (if exists)
            Optional<PaymentModel> payment = paymentRepo.findByBookingId(bookingModel.getId());
            payment.ifPresent(paymentRepo::delete);

            // 2. HARD DELETE RESERVATION (if exists)
            Optional<ReservationModel> reservation = reservationRepo.findByBookingId(bookingModel.getId());
            if (reservation.isPresent()) {
                ReservationModel reservationModel = reservation.get();

                // RESTORE SEATS from reservation before deleting
                restoreSeatsFromReservation(reservationModel);

                reservationRepo.delete(reservationModel);
            } else {
                // 3. NO RESERVATION - Restore seats from booking directly
                restoreSeatsToSchedule(bookingModel);
            }

            // 4. HARD DELETE THE BOOKING
            bookingRepo.delete(bookingModel);

            return true;
        } catch (Exception e) {
            throw new BookingException("Failed to hard delete booking: " + e.getMessage());
        }
    }

    // Backward compatibility - default to soft delete
    @Transactional
    public boolean deleteBooking(Long id) {
        return deleteBooking(id, false);
    }

    private void restoreSeatsFromReservation(ReservationModel reservation) {
        BookingModel booking = reservation.getBooking();
        Integer totalSeats = reservation.getTotalSeats();
        restoreSeatsToSchedule(booking.getSchedule(), booking.getClassType(), totalSeats);
    }

    private void restoreSeatsToSchedule(BookingModel booking) {
        restoreSeatsToSchedule(booking.getSchedule(), booking.getClassType(), booking.getSeatCount());
    }

    private void restoreSeatsToSchedule(ScheduleModel schedule, String classType, Integer seatCount) {
        switch (classType.toUpperCase()) {
            case "ECONOMY":
                int newEconomy = schedule.getAvailableEconomySeats() + seatCount;
                schedule.setAvailableEconomySeats(Math.min(newEconomy, 50));
                break;
            case "BUSINESS":
                int newBusiness = schedule.getAvailableBusinessSeats() + seatCount;
                schedule.setAvailableBusinessSeats(Math.min(newBusiness, 30));
                break;
            case "FIRST_CLASS":
                int newFirstClass = schedule.getAvailableFirstClassSeats() + seatCount;
                schedule.setAvailableFirstClassSeats(Math.min(newFirstClass, 20));
                break;
            case "LUXURY":
                int newLuxury = schedule.getAvailableLuxurySeats() + seatCount;
                schedule.setAvailableLuxurySeats(Math.min(newLuxury, 10));
                break;
        }
        scheduleRepo.save(schedule);
    }

    private BookingDTOS.BookingResponseDTO convertToResponseDTO(BookingModel booking) {
        BookingDTOS.BookingResponseDTO responseDTO = new BookingDTOS.BookingResponseDTO();
        responseDTO.setId(booking.getId());
        responseDTO.setSeatCount(booking.getSeatCount());
        responseDTO.setClassType(booking.getClassType());
        responseDTO.setAdditionalNotes(booking.getAdditionalNotes());
        responseDTO.setDeleteStatus(booking.getDeleteStatus());
        responseDTO.setCreatedAt(booking.getCreatedAt());
        responseDTO.setUpdatedAt(booking.getUpdatedAt());

        // Passenger info
        BookingDTOS.PassengerInfo passengerInfo = new BookingDTOS.PassengerInfo();
        passengerInfo.setId(booking.getPassenger().getId());
        passengerInfo.setFirstName(booking.getPassenger().getFirstName());
        passengerInfo.setLastName(booking.getPassenger().getLastName());
        passengerInfo.setEmail(booking.getPassenger().getEmail());
        passengerInfo.setContactNumber(booking.getPassenger().getContactNumber());
        responseDTO.setPassenger(passengerInfo);

        // Schedule info
        BookingDTOS.ScheduleInfo scheduleInfo = new BookingDTOS.ScheduleInfo();
        scheduleInfo.setId(booking.getSchedule().getId());
        scheduleInfo.setFromCity(booking.getSchedule().getFromCity());
        scheduleInfo.setToCity(booking.getSchedule().getToCity());
        scheduleInfo.setDate(booking.getSchedule().getDate());
        scheduleInfo.setTime(booking.getSchedule().getTime());
        scheduleInfo.setTrainType(booking.getSchedule().getTrainType());
        scheduleInfo.setTrainName(booking.getSchedule().getTrainName());

        // Class availability
        scheduleInfo.setAvailableEconomySeats(booking.getSchedule().getAvailableEconomySeats());
        scheduleInfo.setAvailableBusinessSeats(booking.getSchedule().getAvailableBusinessSeats());
        scheduleInfo.setAvailableFirstClassSeats(booking.getSchedule().getAvailableFirstClassSeats());
        scheduleInfo.setAvailableLuxurySeats(booking.getSchedule().getAvailableLuxurySeats());

        responseDTO.setSchedule(scheduleInfo);

        return responseDTO;
    }

    // Custom Exception Classes
    public static class BookingException extends RuntimeException {
        public BookingException(String message) {
            super(message);
        }
    }

    public static class SeatUnavailableException extends BookingException {
        public SeatUnavailableException(String message) {
            super(message);
        }
    }
}