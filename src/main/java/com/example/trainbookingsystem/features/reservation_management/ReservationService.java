package com.example.trainbookingsystem.features.reservation_management;

import com.example.trainbookingsystem.features.booking_management.BookingModel;
import com.example.trainbookingsystem.features.booking_management.BookingRepo;
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

    // Add status validation method
    // In ReservationService.java - REPLACE the isValidStatusTransition method
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

    public ReservationDTOS.ReservationResponseDTO createReservation(ReservationDTOS.CreateReservationDTO createDTO) {
        Optional<BookingModel> booking = bookingRepo.findByIdAndDeleteStatus(createDTO.getBookingId(), false);
        if (!booking.isPresent()) {
            throw new RuntimeException("Booking not found");
        }

        if (reservationRepo.existsByBookingIdAndDeleteStatus(createDTO.getBookingId(), false)) {
            throw new RuntimeException("Reservation already exists for this booking");
        }

        // Validate initial status
        String initialStatus = createDTO.getStatus() != null ? createDTO.getStatus() : "PENDING";
        if (!List.of("PENDING", "CANCELLED", "COMPLETED").contains(initialStatus)) {
            throw new RuntimeException("Invalid initial status. Only PENDING, CANCELLED, or COMPLETED are allowed");
        }

        ReservationModel reservation = new ReservationModel(
                booking.get(),
                createDTO.getNumOfAdultSeats(),
                createDTO.getNumOfChildrenSeats(),
                createDTO.getTrainBoxClass(),
                createDTO.getTotalBill(),
                initialStatus
        );

        ReservationModel savedReservation = reservationRepo.save(reservation);
        return convertToResponseDTO(savedReservation);
    }

    public Optional<ReservationDTOS.ReservationResponseDTO> updateReservation(Long id, ReservationDTOS.UpdateReservationDTO updateDTO) {
        return reservationRepo.findByIdAndDeleteStatus(id, false)
                .map(reservation -> {
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
                    if (updateDTO.getTrainBoxClass() != null) {
                        reservation.setTrainBoxClass(updateDTO.getTrainBoxClass());
                    }
                    if (updateDTO.getTotalBill() != null) {
                        reservation.setTotalBill(updateDTO.getTotalBill());
                    }
                    if (updateDTO.getStatus() != null) {
                        reservation.setStatus(updateDTO.getStatus());
                    }

                    return convertToResponseDTO(reservationRepo.save(reservation));
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

            reservationModel.setDeleteStatus(true);
            reservationRepo.save(reservationModel);
            return true;
        }
        return false;
    }

    private ReservationDTOS.ReservationResponseDTO convertToResponseDTO(ReservationModel reservation) {
        ReservationDTOS.ReservationResponseDTO responseDTO = new ReservationDTOS.ReservationResponseDTO();
        responseDTO.setId(reservation.getId());
        responseDTO.setDeleteStatus(reservation.getDeleteStatus());
        responseDTO.setNumOfAdultSeats(reservation.getNumOfAdultSeats());
        responseDTO.setNumOfChildrenSeats(reservation.getNumOfChildrenSeats());
        responseDTO.setTrainBoxClass(reservation.getTrainBoxClass());
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
        bookingInfo.setSchedule(scheduleInfo);

        responseDTO.setBooking(bookingInfo);

        return responseDTO;
    }
}