package com.example.trainbookingsystem.features.booking_management;

import com.example.trainbookingsystem.features.passenger_management.PassengerModel;
import com.example.trainbookingsystem.features.passenger_management.PassengerRepo;
import com.example.trainbookingsystem.features.schedule_management.ScheduleModel;
import com.example.trainbookingsystem.features.schedule_management.ScheduleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        // Update schedule availability
        updateScheduleAvailability(schedule.get(), createDTO.getClassType(), createDTO.getSeatCount());

        return convertToResponseDTO(savedBooking);
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
    public boolean deleteBooking(Long id) {
        Optional<BookingModel> booking = bookingRepo.findByIdAndDeleteStatus(id, false);
        if (booking.isPresent()) {
            // Soft delete - set deleteStatus to true
            booking.get().setDeleteStatus(true);
            bookingRepo.save(booking.get());

            // Restore seats to schedule
            restoreSeatsToSchedule(booking.get());
            return true;
        }
        return false;
    }

    private void restoreSeatsToSchedule(BookingModel booking) {
        ScheduleModel schedule = booking.getSchedule();
        String classType = booking.getClassType();
        Integer seatCount = booking.getSeatCount();

        String normalizedClassType = classType.toUpperCase();
        switch (normalizedClassType) {
            case "ECONOMY":
                schedule.setAvailableEconomySeats(schedule.getAvailableEconomySeats() + seatCount);
                break;
            case "BUSINESS":
                schedule.setAvailableBusinessSeats(schedule.getAvailableBusinessSeats() + seatCount);
                break;
            case "FIRST_CLASS":
                schedule.setAvailableFirstClassSeats(schedule.getAvailableFirstClassSeats() + seatCount);
                break;
            case "LUXURY":
                schedule.setAvailableLuxurySeats(schedule.getAvailableLuxurySeats() + seatCount);
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