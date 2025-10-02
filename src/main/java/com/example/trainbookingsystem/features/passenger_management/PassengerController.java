package com.example.trainbookingsystem.features.passenger_management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/passengers")
public class PassengerController {

    @Autowired
    private PassengerService passengerService;

    @GetMapping
    public ResponseEntity<?> getAllPassengers() {
        try {
            List<PassengerDTOS.PassengerResponseDTO> passengers = passengerService.getAllPassengers();
            return ResponseEntity.ok(passengers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving passengers");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPassengerById(@PathVariable Long id) {
        try {
            Optional<PassengerDTOS.PassengerResponseDTO> passenger = passengerService.getPassengerById(id);
            if (passenger.isPresent()) {
                return ResponseEntity.ok(passenger.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Passenger not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving passenger");
        }
    }

    @PostMapping
    public ResponseEntity<?> createPassenger(@RequestBody PassengerDTOS.CreatePassengerDTO createDTO) {
        try {
            PassengerDTOS.PassengerResponseDTO passenger = passengerService.createPassenger(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(passenger);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating passenger");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePassenger(@PathVariable Long id, @RequestBody PassengerDTOS.UpdatePassengerDTO updateDTO) {
        try {
            Optional<PassengerDTOS.PassengerResponseDTO> passenger = passengerService.updatePassenger(id, updateDTO);
            if (passenger.isPresent()) {
                return ResponseEntity.ok(passenger.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Passenger not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating passenger");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePassenger(@PathVariable Long id) {
        try {
            boolean deleted = passengerService.deletePassenger(id);
            if (deleted) {
                return ResponseEntity.ok("Passenger deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Passenger not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting passenger");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody PassengerDTOS.PassengerLoginDTO loginDTO) {
        try {
            Optional<PassengerDTOS.PassengerResponseDTO> passenger = passengerService.login(loginDTO);
            if (passenger.isPresent()) {
                return ResponseEntity.ok(passenger.get());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during login");
        }
    }
}