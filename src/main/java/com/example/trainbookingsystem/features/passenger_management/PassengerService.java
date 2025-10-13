package com.example.trainbookingsystem.features.passenger_management;

import com.example.trainbookingsystem.features.booking_management.BookingModel;
import com.example.trainbookingsystem.features.booking_management.BookingRepo;
import com.example.trainbookingsystem.features.feedback_management.FeedbackRepo;
import com.example.trainbookingsystem.features.reservation_management.ReservationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PassengerService {

    @Autowired
    private PassengerRepo passengerRepo;

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private ReservationRepo reservationRepo;

    @Autowired
    private FeedbackRepo feedbackRepo;

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

                if (keepData) {
                    passenger.setDeleteStatus(true);
                    passengerRepo.save(passenger);
                } else {

                    List<BookingModel> bookings = bookingRepo.findByPassenger(passenger);
                    for (BookingModel booking : bookings) {
                        reservationRepo.deleteByBooking(booking);
                    }

                    bookingRepo.deleteAll(bookings);

                    feedbackRepo.deleteByCreatedBy(passenger);

                    passengerRepo.delete(passenger);
                }
                return true;
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