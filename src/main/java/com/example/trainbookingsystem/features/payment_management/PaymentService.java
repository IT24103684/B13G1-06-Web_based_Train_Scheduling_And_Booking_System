package com.example.trainbookingsystem.features.payment_management;

import com.example.trainbookingsystem.features.booking_management.BookingModel;
import com.example.trainbookingsystem.features.booking_management.BookingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private BookingRepo bookingRepo;

    public List<PaymentDTOS.PaymentResponseDTO> getAllPayments() {
        return paymentRepo.findByDeleteStatusOrderByCreatedAtDesc(false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<PaymentDTOS.PaymentResponseDTO> getPaymentById(Long id) {
        return paymentRepo.findByIdAndDeleteStatus(id, false)
                .map(this::convertToResponseDTO);
    }

    public Optional<PaymentDTOS.PaymentResponseDTO> getPaymentByBooking(Long bookingId) {
        return paymentRepo.findByBookingIdAndDeleteStatus(bookingId, false)
                .map(this::convertToResponseDTO);
    }

    public List<PaymentDTOS.PaymentResponseDTO> getPaymentsByPassenger(Long passengerId) {
        return paymentRepo.findByBookingPassengerIdAndDeleteStatus(passengerId, false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTOS.PaymentResponseDTO> getPaymentsByStatus(String paymentStatus) {
        return paymentRepo.findByPaymentStatusAndDeleteStatus(paymentStatus, false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTOS.PaymentResponseDTO> getPaymentsByMethod(String paymentMethod) {
        return paymentRepo.findByPaymentMethodAndDeleteStatus(paymentMethod, false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public PaymentDTOS.PaymentResponseDTO createPayment(PaymentDTOS.CreatePaymentDTO createDTO) {
        Optional<BookingModel> booking = bookingRepo.findByIdAndDeleteStatus(createDTO.getBookingId(), false);
        if (!booking.isPresent()) {
            throw new RuntimeException("Booking not found");
        }

        if (paymentRepo.existsByBookingIdAndDeleteStatus(createDTO.getBookingId(), false)) {
            throw new RuntimeException("Payment already exists for this booking");
        }

        if (paymentRepo.findByTransactionId(createDTO.getTransactionId()).isPresent()) {
            throw new RuntimeException("Transaction ID already exists");
        }

        PaymentModel payment = new PaymentModel(
                booking.get(),
                createDTO.getAmount(),
                createDTO.getPaymentMethod(),
                createDTO.getPaymentStatus(),
                createDTO.getTransactionId()
        );

        PaymentModel savedPayment = paymentRepo.save(payment);
        return convertToResponseDTO(savedPayment);
    }

    public Optional<PaymentDTOS.PaymentResponseDTO> updatePayment(Long id, PaymentDTOS.UpdatePaymentDTO updateDTO) {
        return paymentRepo.findByIdAndDeleteStatus(id, false)
                .map(payment -> {
                    if (updateDTO.getAmount() != null) {
                        payment.setAmount(updateDTO.getAmount());
                    }
                    if (updateDTO.getPaymentMethod() != null) {
                        payment.setPaymentMethod(updateDTO.getPaymentMethod());
                    }
                    if (updateDTO.getPaymentStatus() != null) {
                        payment.setPaymentStatus(updateDTO.getPaymentStatus());

                        if ("COMPLETED".equals(updateDTO.getPaymentStatus()) && payment.getPaidAt() == null) {
                            payment.markAsCompleted(updateDTO.getPaidAt() != null ? updateDTO.getPaidAt() : java.time.LocalDateTime.now());
                        }
                    }
                    if (updateDTO.getTransactionId() != null) {
                        payment.setTransactionId(updateDTO.getTransactionId());
                    }
                    if (updateDTO.getPaidAt() != null) {
                        payment.setPaidAt(updateDTO.getPaidAt());
                    }
                    return convertToResponseDTO(paymentRepo.save(payment));
                });
    }

    public boolean deletePayment(Long id) {
        Optional<PaymentModel> payment = paymentRepo.findByIdAndDeleteStatus(id, false);
        if (payment.isPresent()) {
            PaymentModel paymentModel = payment.get();
            paymentModel.setDeleteStatus(true);
            paymentRepo.save(paymentModel);
            return true;
        }
        return false;
    }

    public Optional<PaymentDTOS.PaymentResponseDTO> markPaymentAsCompleted(Long id) {
        return paymentRepo.findByIdAndDeleteStatus(id, false)
                .map(payment -> {
                    payment.markAsCompleted(java.time.LocalDateTime.now());
                    return convertToResponseDTO(paymentRepo.save(payment));
                });
    }

    public Optional<PaymentDTOS.PaymentResponseDTO> markPaymentAsFailed(Long id) {
        return paymentRepo.findByIdAndDeleteStatus(id, false)
                .map(payment -> {
                    payment.markAsFailed();
                    return convertToResponseDTO(paymentRepo.save(payment));
                });
    }

    public Optional<PaymentDTOS.PaymentResponseDTO> processRefund(Long id) {
        return paymentRepo.findByIdAndDeleteStatus(id, false)
                .map(payment -> {
                    payment.processRefund();
                    return convertToResponseDTO(paymentRepo.save(payment));
                });
    }

    private PaymentDTOS.PaymentResponseDTO convertToResponseDTO(PaymentModel payment) {
        PaymentDTOS.PaymentResponseDTO responseDTO = new PaymentDTOS.PaymentResponseDTO();
        responseDTO.setId(payment.getId());
        responseDTO.setAmount(payment.getAmount());
        responseDTO.setPaymentMethod(payment.getPaymentMethod());
        responseDTO.setPaymentStatus(payment.getPaymentStatus());
        responseDTO.setTransactionId(payment.getTransactionId());
        responseDTO.setPaidAt(payment.getPaidAt());
        responseDTO.setDeleteStatus(payment.getDeleteStatus());
        responseDTO.setCreatedAt(payment.getCreatedAt());
        responseDTO.setUpdatedAt(payment.getUpdatedAt());

        PaymentDTOS.BookingInfo bookingInfo = new PaymentDTOS.BookingInfo();
        bookingInfo.setId(payment.getBooking().getId());
        bookingInfo.setAdditionalNotes(payment.getBooking().getAdditionalNotes());

        PaymentDTOS.PassengerInfo passengerInfo = new PaymentDTOS.PassengerInfo();
        passengerInfo.setId(payment.getBooking().getPassenger().getId());
        passengerInfo.setFirstName(payment.getBooking().getPassenger().getFirstName());
        passengerInfo.setLastName(payment.getBooking().getPassenger().getLastName());
        passengerInfo.setEmail(payment.getBooking().getPassenger().getEmail());
        passengerInfo.setContactNumber(payment.getBooking().getPassenger().getContactNumber());
        bookingInfo.setPassenger(passengerInfo);

        PaymentDTOS.ScheduleInfo scheduleInfo = new PaymentDTOS.ScheduleInfo();
        scheduleInfo.setId(payment.getBooking().getSchedule().getId());
        scheduleInfo.setFromCity(payment.getBooking().getSchedule().getFromCity());
        scheduleInfo.setToCity(payment.getBooking().getSchedule().getToCity());
        scheduleInfo.setDate(payment.getBooking().getSchedule().getDate());
        scheduleInfo.setTime(payment.getBooking().getSchedule().getTime());
        scheduleInfo.setTrainType(payment.getBooking().getSchedule().getTrainType());
        scheduleInfo.setTrainName(payment.getBooking().getSchedule().getTrainName());
        bookingInfo.setSchedule(scheduleInfo);

        responseDTO.setBooking(bookingInfo);

        return responseDTO;
    }
}