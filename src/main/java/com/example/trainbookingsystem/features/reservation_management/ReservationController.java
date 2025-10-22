package com.example.trainbookingsystem.features.reservation_management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping
    public ResponseEntity<?> getAllReservations() {
        try {
            List<ReservationDTOS.ReservationResponseDTO> reservations = reservationService.getAllReservations();
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving reservations");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable Long id) {
        try {
            Optional<ReservationDTOS.ReservationResponseDTO> reservation = reservationService.getReservationById(id);
            if (reservation.isPresent()) {
                return ResponseEntity.ok(reservation.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving reservation");
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getReservationByBooking(@PathVariable Long bookingId) {
        try {
            Optional<ReservationDTOS.ReservationResponseDTO> reservation = reservationService.getReservationByBooking(bookingId);
            if (reservation.isPresent()) {
                return ResponseEntity.ok(reservation.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found for booking");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving reservation by booking");
        }
    }

    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<?> getReservationsByPassenger(@PathVariable Long passengerId) {
        try {
            List<ReservationDTOS.ReservationResponseDTO> reservations = reservationService.getReservationsByPassenger(passengerId);
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving passenger reservations");
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getReservationsByStatus(@PathVariable String status) {
        try {
            List<ReservationDTOS.ReservationResponseDTO> reservations = reservationService.getReservationsByStatus(status);
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving reservations by status");
        }
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationDTOS.CreateReservationDTO createDTO) {
        try {
            ReservationDTOS.ReservationResponseDTO reservation = reservationService.createReservation(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating reservation");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable Long id, @RequestBody ReservationDTOS.UpdateReservationDTO updateDTO) {
        try {
            Optional<ReservationDTOS.ReservationResponseDTO> reservation = reservationService.updateReservation(id, updateDTO);
            if (reservation.isPresent()) {
                return ResponseEntity.ok(reservation.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating reservation");
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        try {
            Optional<ReservationDTOS.ReservationResponseDTO> reservation = reservationService.cancelReservation(id);
            if (reservation.isPresent()) {
                return ResponseEntity.ok(reservation.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error cancelling reservation");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        try {
            boolean deleted = reservationService.deleteReservation(id);
            if (deleted) {
                return ResponseEntity.ok("Reservation deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting reservation");
        }
    }
}