package com.example.trainbookingsystem.features.booking_management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        try {
            List<BookingDTOS.BookingResponseDTO> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving bookings");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            Optional<BookingDTOS.BookingResponseDTO> booking = bookingService.getBookingById(id);
            if (booking.isPresent()) {
                return ResponseEntity.ok(booking.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving booking");
        }
    }

    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<?> getBookingsByPassenger(@PathVariable Long passengerId) {
        try {
            List<BookingDTOS.BookingResponseDTO> bookings = bookingService.getBookingsByPassenger(passengerId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving passenger bookings");
        }
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<?> getBookingsBySchedule(@PathVariable Long scheduleId) {
        try {
            List<BookingDTOS.BookingResponseDTO> bookings = bookingService.getBookingsBySchedule(scheduleId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving schedule bookings");
        }
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingDTOS.CreateBookingDTO createDTO) {
        try {
            BookingDTOS.BookingResponseDTO booking = bookingService.createBooking(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating booking");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody BookingDTOS.UpdateBookingDTO updateDTO) {
        try {
            Optional<BookingDTOS.BookingResponseDTO> booking = bookingService.updateBooking(id, updateDTO);
            if (booking.isPresent()) {
                return ResponseEntity.ok(booking.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating booking");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "false") boolean permanent) {

        try {
            boolean deleted = bookingService.deleteBooking(id, permanent);
            if (deleted) {
                String message = permanent ?
                        "Booking permanently deleted" :
                        "Booking moved to trash";
                return ResponseEntity.ok().body(
                        Map.of("message", message, "permanent", permanent)
                );
            }
            return ResponseEntity.notFound().build();
        } catch (BookingService.BookingException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting booking");
        }
    }
}