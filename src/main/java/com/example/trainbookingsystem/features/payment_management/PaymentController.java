package com.example.trainbookingsystem.features.payment_management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<?> getAllPayments() {
        try {
            List<PaymentDTOS.PaymentResponseDTO> payments = paymentService.getAllPayments();
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving payments");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        try {
            Optional<PaymentDTOS.PaymentResponseDTO> payment = paymentService.getPaymentById(id);
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving payment");
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getPaymentByBooking(@PathVariable Long bookingId) {
        try {
            Optional<PaymentDTOS.PaymentResponseDTO> payment = paymentService.getPaymentByBooking(bookingId);
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found for booking");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving payment by booking");
        }
    }

    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<?> getPaymentsByPassenger(@PathVariable Long passengerId) {
        try {
            List<PaymentDTOS.PaymentResponseDTO> payments = paymentService.getPaymentsByPassenger(passengerId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving passenger payments");
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getPaymentsByStatus(@PathVariable String status) {
        try {
            List<PaymentDTOS.PaymentResponseDTO> payments = paymentService.getPaymentsByStatus(status);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving payments by status");
        }
    }

    @GetMapping("/method/{method}")
    public ResponseEntity<?> getPaymentsByMethod(@PathVariable String method) {
        try {
            List<PaymentDTOS.PaymentResponseDTO> payments = paymentService.getPaymentsByMethod(method);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving payments by method");
        }
    }

    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody PaymentDTOS.CreatePaymentDTO createDTO) {
        try {
            PaymentDTOS.PaymentResponseDTO payment = paymentService.createPayment(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating payment");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePayment(@PathVariable Long id, @RequestBody PaymentDTOS.UpdatePaymentDTO updateDTO) {
        try {
            Optional<PaymentDTOS.PaymentResponseDTO> payment = paymentService.updatePayment(id, updateDTO);
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating payment");
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> markPaymentAsCompleted(@PathVariable Long id) {
        try {
            Optional<PaymentDTOS.PaymentResponseDTO> payment = paymentService.markPaymentAsCompleted(id);
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error completing payment");
        }
    }

    @PutMapping("/{id}/fail")
    public ResponseEntity<?> markPaymentAsFailed(@PathVariable Long id) {
        try {
            Optional<PaymentDTOS.PaymentResponseDTO> payment = paymentService.markPaymentAsFailed(id);
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error failing payment");
        }
    }

    @PutMapping("/{id}/refund")
    public ResponseEntity<?> processRefund(@PathVariable Long id) {
        try {
            Optional<PaymentDTOS.PaymentResponseDTO> payment = paymentService.processRefund(id);
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing refund");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        try {
            boolean deleted = paymentService.deletePayment(id);
            if (deleted) {
                return ResponseEntity.ok("Payment deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting payment");
        }
    }
}