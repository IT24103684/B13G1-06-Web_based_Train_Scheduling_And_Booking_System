package com.example.trainbookingsystem.features.reservation_management;

import com.example.trainbookingsystem.features.booking_management.BookingModel;
import com.example.trainbookingsystem.features.booking_management.BookingRepo;
import com.example.trainbookingsystem.features.schedule_management.ScheduleModel;
import com.example.trainbookingsystem.features.schedule_management.ScheduleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepo reservationRepo;

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private ScheduleRepo scheduleRepo;

    // Add status validation method
    private boolean isValidStatusTransition(String currentStatus, String newStatus) {
        if (currentStatus.equals(newStatus)) {
            return true; // No change is always allowed
        }

        // Only allow PENDING, CANCELLED, COMPLETED
        if (!List.of("PENDING", "CANCELLED", "COMPLETED").contains(newStatus)) {
            return false;
        }

        // Define allowed status transitions
        switch (currentStatus) {
            case "PENDING":
                return newStatus.equals("CANCELLED") || newStatus.equals("COMPLETED");
            case "CANCELLED":
                // Allow CANCELLED to be changed to PENDING or COMPLETED (admin functionality)
                return newStatus.equals("PENDING") || newStatus.equals("COMPLETED");
            case "COMPLETED":
                // Allow COMPLETED to be changed to PENDING or CANCELLED (admin functionality)
                return newStatus.equals("PENDING") || newStatus.equals("CANCELLED");
            default:
                return false;
        }
    }

    private boolean canDeleteReservation(String status) {
        // Only allow deletion of non-PAID reservations
        return !"PAID".equals(status);
    }

    public List<ReservationDTOS.ReservationResponseDTO> getAllReservations() {
        return reservationRepo.findByDeleteStatusOrderByCreatedAtDesc(false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<ReservationDTOS.ReservationResponseDTO> getReservationById(Long id) {
        return reservationRepo.findByIdAndDeleteStatus(id, false)
                .map(this::convertToResponseDTO);
    }

    public Optional<ReservationDTOS.ReservationResponseDTO> getReservationByBooking(Long bookingId) {
        return reservationRepo.findByBookingIdAndDeleteStatus(bookingId, false)
                .map(this::convertToResponseDTO);
    }

    public List<ReservationDTOS.ReservationResponseDTO> getReservationsByPassenger(Long passengerId) {
        return reservationRepo.findByBookingPassengerIdAndDeleteStatus(passengerId, false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationDTOS.ReservationResponseDTO> getReservationsByStatus(String status) {
        return reservationRepo.findByStatusAndDeleteStatus(status, false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // UPDATE createReservation method with seat availability validation
    public ReservationDTOS.ReservationResponseDTO createReservation(ReservationDTOS.CreateReservationDTO createDTO) {
        Optional<BookingModel> booking = bookingRepo.findByIdAndDeleteStatus(createDTO.getBookingId(), false);
        if (!booking.isPresent()) {
            throw new RuntimeException("Booking not found");
        }

        BookingModel bookingModel = booking.get();

        // VALIDATE SEAT COUNT CONSISTENCY
        if (!createDTO.isValidSeatCount(bookingModel.getSeatCount())) {
            throw new RuntimeException("Reservation seat count (" + createDTO.getTotalSeats() +
                    ") exceeds booking seat count (" + bookingModel.getSeatCount() + ")");
        }

        // VALIDATE SEAT AVAILABILITY
        validateSeatAvailability(bookingModel.getSchedule(), bookingModel.getClassType(), createDTO.getTotalSeats());

        if (reservationRepo.existsByBookingIdAndDeleteStatus(createDTO.getBookingId(), false)) {
            throw new RuntimeException("Reservation already exists for this booking");
        }

        // Validate initial status
        String initialStatus = createDTO.getStatus() != null ? createDTO.getStatus() : "PENDING";
        if (!List.of("PENDING", "CANCELLED", "COMPLETED").contains(initialStatus)) {
            throw new RuntimeException("Invalid initial status. Only PENDING, CANCELLED, or COMPLETED are allowed");
        }

        // UPDATE CONSTRUCTOR CALL - Remove trainBoxClass
        ReservationModel reservation = new ReservationModel(
                bookingModel,
                createDTO.getNumOfAdultSeats(),
                createDTO.getNumOfChildrenSeats(),
                createDTO.getTotalBill(),
                initialStatus
        );

        ReservationModel savedReservation = reservationRepo.save(reservation);

        // UPDATE SCHEDULE AVAILABILITY
        updateScheduleAvailability(bookingModel.getSchedule(), bookingModel.getClassType(), createDTO.getTotalSeats());

        return convertToResponseDTO(savedReservation);
    }

    // ADD SEAT AVAILABILITY VALIDATION METHOD
    private void validateSeatAvailability(ScheduleModel schedule, String classType, Integer seatCount) {
        int availableSeats = getAvailableSeatsByClass(schedule, classType);

        if (seatCount <= 0) {
            throw new RuntimeException("Seat count must be greater than 0");
        }

        if (seatCount > availableSeats) {
            throw new RuntimeException("Not enough seats available in " + classType + " class. Available: " + availableSeats);
        }
    }

    private int getAvailableSeatsByClass(ScheduleModel schedule, String classType) {
        switch (classType.toUpperCase()) {
            case "ECONOMY":
                return schedule.getAvailableEconomySeats();
            case "BUSINESS":
                return schedule.getAvailableBusinessSeats();
            case "FIRST_CLASS":
                return schedule.getAvailableFirstClassSeats();
            case "LUXURY":
                return schedule.getAvailableLuxurySeats();
            default:
                throw new RuntimeException("Invalid class type: " + classType);
        }
    }

    private void updateScheduleAvailability(ScheduleModel schedule, String classType, Integer seatCount) {
        switch (classType.toUpperCase()) {
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

    // UPDATE updateReservation method with seat validation
    // UPDATE updateReservation method with seat validation
    public Optional<ReservationDTOS.ReservationResponseDTO> updateReservation(Long id, ReservationDTOS.UpdateReservationDTO updateDTO) {
        return reservationRepo.findByIdAndDeleteStatus(id, false)
                .map(reservation -> {
                    BookingModel booking = reservation.getBooking();

                    // STORE CURRENT TOTAL SEATS BEFORE ANY CHANGES
                    Integer currentTotalSeats = reservation.getTotalSeats();

                    // VALIDATE SEAT COUNT IF UPDATING SEATS
                    if ((updateDTO.getNumOfAdultSeats() != null || updateDTO.getNumOfChildrenSeats() != null)) {
                        Integer newTotalSeats = updateDTO.getTotalSeats();

                        // If seat count is changing, validate availability
                        if (!newTotalSeats.equals(currentTotalSeats)) {
                            // Check if new seat count exceeds booking limit
                            if (newTotalSeats > booking.getSeatCount()) {
                                throw new RuntimeException("Reservation seat count (" + newTotalSeats +
                                        ") exceeds booking seat count (" + booking.getSeatCount() + ")");
                            }

                            // Validate seat availability for the difference
                            int seatDifference = newTotalSeats - currentTotalSeats;
                            if (seatDifference > 0) {
                                validateSeatAvailability(booking.getSchedule(), booking.getClassType(), seatDifference);
                            }
                        }
                    }

                    // Validate status transition if status is being updated
                    if (updateDTO.getStatus() != null && !updateDTO.getStatus().equals(reservation.getStatus())) {
                        if (!isValidStatusTransition(reservation.getStatus(), updateDTO.getStatus())) {
                            throw new RuntimeException("Invalid status transition from " + reservation.getStatus() + " to " + updateDTO.getStatus());
                        }
                    }

                    // Apply updates
                    if (updateDTO.getNumOfAdultSeats() != null) {
                        reservation.setNumOfAdultSeats(updateDTO.getNumOfAdultSeats());
                    }
                    if (updateDTO.getNumOfChildrenSeats() != null) {
                        reservation.setNumOfChildrenSeats(updateDTO.getNumOfChildrenSeats());
                    }
                    // REMOVE trainBoxClass update
                    if (updateDTO.getTotalBill() != null) {
                        reservation.setTotalBill(updateDTO.getTotalBill());
                    }
                    if (updateDTO.getStatus() != null) {
                        reservation.setStatus(updateDTO.getStatus());
                    }

                    ReservationModel updatedReservation = reservationRepo.save(reservation);

                    // UPDATE SCHEDULE AVAILABILITY IF SEATS CHANGED
                    if (updateDTO.getNumOfAdultSeats() != null || updateDTO.getNumOfChildrenSeats() != null) {
                        Integer newTotalSeats = updatedReservation.getTotalSeats();
                        int seatDifference = newTotalSeats - currentTotalSeats;

                        if (seatDifference != 0) {
                            updateScheduleAvailability(booking.getSchedule(), booking.getClassType(), seatDifference);
                        }
                    }

                    return convertToResponseDTO(updatedReservation);
                });
    }

    public boolean deleteReservation(Long id) {
        Optional<ReservationModel> reservation = reservationRepo.findByIdAndDeleteStatus(id, false);
        if (reservation.isPresent()) {
            ReservationModel reservationModel = reservation.get();

            // Check if reservation can be deleted
            if (!canDeleteReservation(reservationModel.getStatus())) {
                throw new RuntimeException("Cannot delete PAID reservations");
            }

            // RESTORE SEAT AVAILABILITY WHEN DELETING RESERVATION
            BookingModel booking = reservationModel.getBooking();
            Integer totalSeats = reservationModel.getTotalSeats();
            updateScheduleAvailability(booking.getSchedule(), booking.getClassType(), -totalSeats);

            reservationModel.setDeleteStatus(true);
            reservationRepo.save(reservationModel);
            return true;
        }
        return false;
    }

    // UPDATE convertToResponseDTO to include class type
    private ReservationDTOS.ReservationResponseDTO convertToResponseDTO(ReservationModel reservation) {
        ReservationDTOS.ReservationResponseDTO responseDTO = new ReservationDTOS.ReservationResponseDTO();
        responseDTO.setId(reservation.getId());
        responseDTO.setDeleteStatus(reservation.getDeleteStatus());
        responseDTO.setNumOfAdultSeats(reservation.getNumOfAdultSeats());
        responseDTO.setNumOfChildrenSeats(reservation.getNumOfChildrenSeats());
        responseDTO.setClassType(reservation.getClassType()); // ADD CLASS TYPE
        responseDTO.setTotalBill(reservation.getTotalBill());
        responseDTO.setStatus(reservation.getStatus());
        responseDTO.setCreatedAt(reservation.getCreatedAt());
        responseDTO.setUpdatedAt(reservation.getUpdatedAt());

        ReservationDTOS.BookingInfo bookingInfo = new ReservationDTOS.BookingInfo();
        bookingInfo.setId(reservation.getBooking().getId());
        bookingInfo.setAdditionalNotes(reservation.getBooking().getAdditionalNotes());

        ReservationDTOS.PassengerInfo passengerInfo = new ReservationDTOS.PassengerInfo();
        passengerInfo.setId(reservation.getBooking().getPassenger().getId());
        passengerInfo.setFirstName(reservation.getBooking().getPassenger().getFirstName());
        passengerInfo.setLastName(reservation.getBooking().getPassenger().getLastName());
        passengerInfo.setEmail(reservation.getBooking().getPassenger().getEmail());
        passengerInfo.setContactNumber(reservation.getBooking().getPassenger().getContactNumber());
        bookingInfo.setPassenger(passengerInfo);

        ReservationDTOS.ScheduleInfo scheduleInfo = new ReservationDTOS.ScheduleInfo();
        scheduleInfo.setId(reservation.getBooking().getSchedule().getId());
        scheduleInfo.setFromCity(reservation.getBooking().getSchedule().getFromCity());
        scheduleInfo.setToCity(reservation.getBooking().getSchedule().getToCity());
        scheduleInfo.setDate(reservation.getBooking().getSchedule().getDate());
        scheduleInfo.setTime(reservation.getBooking().getSchedule().getTime());
        scheduleInfo.setTrainType(reservation.getBooking().getSchedule().getTrainType());
        scheduleInfo.setTrainName(reservation.getBooking().getSchedule().getTrainName());

        // ADD CLASS AVAILABILITY TO SCHEDULE INFO
        scheduleInfo.setAvailableEconomySeats(reservation.getBooking().getSchedule().getAvailableEconomySeats());
        scheduleInfo.setAvailableBusinessSeats(reservation.getBooking().getSchedule().getAvailableBusinessSeats());
        scheduleInfo.setAvailableFirstClassSeats(reservation.getBooking().getSchedule().getAvailableFirstClassSeats());
        scheduleInfo.setAvailableLuxurySeats(reservation.getBooking().getSchedule().getAvailableLuxurySeats());

        bookingInfo.setSchedule(scheduleInfo);

        responseDTO.setBooking(bookingInfo);

        return responseDTO;
    }
}