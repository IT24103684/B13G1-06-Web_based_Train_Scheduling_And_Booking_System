package com.example.trainbookingsystem.features.passenger_management;

import com.example.trainbookingsystem.features.booking_management.BookingModel;
import com.example.trainbookingsystem.features.booking_management.BookingRepo;
import com.example.trainbookingsystem.features.feedback_management.FeedbackRepo;
import com.example.trainbookingsystem.features.reservation_management.ReservationRepo;
import com.example.trainbookingsystem.patterns.deletion.strategy.DeleteContext;
import com.example.trainbookingsystem.patterns.deletion.strategy.DeleteStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PassengerService {


    private static final int VERIFICATION_CODE_EXPIRY_MINUTES = 10;
    private static final int RESET_TOKEN_EXPIRY_HOURS = 1;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Autowired
    private PassengerRepo passengerRepo;

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private ReservationRepo reservationRepo;

    @Autowired
    private FeedbackRepo feedbackRepo;

    @Autowired
    private DeleteContext deleteContext;

    public List<PassengerDTOS.PassengerResponseDTO> getAllPassengers() {
        return passengerRepo.findByDeleteStatus(false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<PassengerDTOS.PassengerResponseDTO> getPassengerById(Long id) {
        return passengerRepo.findByIdAndDeleteStatus(id, false)
                .map(this::convertToResponseDTO);
    }

    public PassengerDTOS.PassengerResponseDTO createPassenger(PassengerDTOS.CreatePassengerDTO createDTO) {
        if (passengerRepo.existsByEmail(createDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        PassengerModel passenger = new PassengerModel(
                createDTO.getFirstName(),
                createDTO.getLastName(),
                createDTO.getEmail(),
                createDTO.getPassword(),
                createDTO.getContactNumber(),
                createDTO.getCity(),
                createDTO.getGender()
        );

        PassengerModel savedPassenger = passengerRepo.save(passenger);
        return convertToResponseDTO(savedPassenger);
    }

    public Optional<PassengerDTOS.PassengerResponseDTO> updatePassenger(Long id, PassengerDTOS.UpdatePassengerDTO updateDTO) {
        return passengerRepo.findByIdAndDeleteStatus(id, false)
                .map(passenger -> {
                    if (updateDTO.getFirstName() != null) {
                        passenger.setFirstName(updateDTO.getFirstName());
                    }
                    if (updateDTO.getLastName() != null) {
                        passenger.setLastName(updateDTO.getLastName());
                    }
                    if (updateDTO.getContactNumber() != null) {
                        passenger.setContactNumber(updateDTO.getContactNumber());
                    }
                    if (updateDTO.getCity() != null) {
                        passenger.setCity(updateDTO.getCity());
                    }
                    if (updateDTO.getGender() != null) {
                        passenger.setGender(updateDTO.getGender());
                    }
                    return convertToResponseDTO(passengerRepo.save(passenger));
                });
    }

    @Transactional
    public boolean deletePassenger(Long id, boolean keepData) {
        try {
            Optional<PassengerModel> passengerOpt = passengerRepo.findByIdAndDeleteStatus(id, false);
            if (passengerOpt.isPresent()) {
                PassengerModel passenger = passengerOpt.get();

                // Get the appropriate strategy
                DeleteStrategy strategy = deleteContext.getStrategy(keepData);

                // Execute the deletion strategy
                return strategy.delete(passenger, passengerRepo, bookingRepo,
                        reservationRepo, feedbackRepo);
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting passenger: " + e.getMessage(), e);
        }
    }

    public Optional<PassengerDTOS.PassengerResponseDTO> login(PassengerDTOS.PassengerLoginDTO loginDTO) {
        return passengerRepo.findByEmail(loginDTO.getEmail())
                .filter(passenger -> !passenger.getDeleteStatus())
                .filter(passenger -> passenger.getPassword().equals(loginDTO.getPassword()))
                .map(this::convertToResponseDTO);
    }

    public PassengerDTOS.PasswordResetResponse forgotPassword(PassengerDTOS.ForgotPasswordRequest request) {
        Optional<PassengerModel> passengerOpt = passengerRepo.findByEmail(request.getEmail());

        if (passengerOpt.isEmpty() || passengerOpt.get().getDeleteStatus()) {
            // Don't reveal if email exists for security
            return new PassengerDTOS.PasswordResetResponse("If the email exists, a verification code has been sent.");
        }

        PassengerModel passenger = passengerOpt.get();

        // Generate 6-digit verification code
        String verificationCode = generateVerificationCode();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(VERIFICATION_CODE_EXPIRY_MINUTES);

        passenger.setVerificationCode(verificationCode);
        passenger.setVerificationCodeExpiry(expiryTime);
        passengerRepo.save(passenger);

        // Send email
        sendVerificationEmail(passenger.getEmail(), verificationCode);

        return new PassengerDTOS.PasswordResetResponse("If the email exists, a verification code has been sent.");
    }

    public PassengerDTOS.PasswordResetResponse verifyResetCode(PassengerDTOS.VerifyCodeRequest request) {
        Optional<PassengerModel> passengerOpt = passengerRepo.findByEmail(request.getEmail());

        if (passengerOpt.isEmpty() || passengerOpt.get().getDeleteStatus()) {
            throw new RuntimeException("Invalid verification code");
        }

        PassengerModel passenger = passengerOpt.get();

        // Check if code matches and is not expired
        if (passenger.getVerificationCode() == null ||
                !passenger.getVerificationCode().equals(request.getCode()) ||
                passenger.getVerificationCodeExpiry() == null ||
                passenger.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired verification code");
        }

        // Generate reset token
        String resetToken = generateResetToken();
        LocalDateTime tokenExpiry = LocalDateTime.now().plusHours(RESET_TOKEN_EXPIRY_HOURS);

        passenger.setResetToken(resetToken);
        passenger.setResetTokenExpiry(tokenExpiry);
        passenger.setVerificationCode(null); // Clear verification code after use
        passenger.setVerificationCodeExpiry(null);
        passengerRepo.save(passenger);

        return new PassengerDTOS.PasswordResetResponse("Code verified successfully", resetToken);
    }

    public PassengerDTOS.PasswordResetResponse resetPassword(PassengerDTOS.ResetPasswordRequest request) {
        Optional<PassengerModel> passengerOpt = passengerRepo.findByResetToken(request.getToken());

        if (passengerOpt.isEmpty() || passengerOpt.get().getDeleteStatus()) {
            throw new RuntimeException("Invalid reset token");
        }

        PassengerModel passenger = passengerOpt.get();

        // Check if token is expired
        if (passenger.getResetTokenExpiry() == null ||
                passenger.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        // Update password
        passenger.setPassword(request.getNewPassword());
        passenger.setResetToken(null);
        passenger.setResetTokenExpiry(null);
        passengerRepo.save(passenger);

        return new PassengerDTOS.PasswordResetResponse("Password reset successfully");
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }

    private void sendVerificationEmail(String toEmail, String verificationCode) {
        try {
            if (mailSender == null) {
                // Log for development purposes
                System.out.println("Verification code for " + toEmail + ": " + verificationCode);
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Verification Code - Train Booking System");
            message.setText(
                    "Dear Passenger,\n\n" +
                            "Your verification code for password reset is: " + verificationCode + "\n\n" +
                            "This code will expire in " + VERIFICATION_CODE_EXPIRY_MINUTES + " minutes.\n\n" +
                            "If you didn't request this reset, please ignore this email.\n\n" +
                            "Best regards,\nTrain Booking System Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            // Log the error but don't throw to the user
            System.err.println("Failed to send email: " + e.getMessage());
            // In development, print the code to console
            System.out.println("Verification code for " + toEmail + ": " + verificationCode);
        }
    }

    private PassengerDTOS.PassengerResponseDTO convertToResponseDTO(PassengerModel passenger) {
        PassengerDTOS.PassengerResponseDTO responseDTO = new PassengerDTOS.PassengerResponseDTO();
        responseDTO.setId(passenger.getId());
        responseDTO.setFirstName(passenger.getFirstName());
        responseDTO.setLastName(passenger.getLastName());
        responseDTO.setEmail(passenger.getEmail());
        responseDTO.setDeleteStatus(passenger.getDeleteStatus());
        responseDTO.setContactNumber(passenger.getContactNumber());
        responseDTO.setCity(passenger.getCity());
        responseDTO.setGender(passenger.getGender());
        responseDTO.setCreatedAt(passenger.getCreatedAt());
        responseDTO.setUpdatedAt(passenger.getUpdatedAt());
        return responseDTO;
    }
}