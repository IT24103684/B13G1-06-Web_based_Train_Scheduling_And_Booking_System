package com.example.trainbookingsystem.features.passenger_management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PassengerService {

    @Autowired
    private PassengerRepo passengerRepo;

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

    public boolean deletePassenger(Long id) {
        Optional<PassengerModel> passenger = passengerRepo.findByIdAndDeleteStatus(id, false);
        if (passenger.isPresent()) {
            PassengerModel passengerModel = passenger.get();
            passengerModel.setDeleteStatus(true);
            passengerRepo.save(passengerModel);
            return true;
        }
        return false;
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