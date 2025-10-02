package com.example.trainbookingsystem.features.feedback_management;

import com.example.trainbookingsystem.features.passenger_management.PassengerModel;
import com.example.trainbookingsystem.features.passenger_management.PassengerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepo feedbackRepo;

    @Autowired
    private PassengerRepo passengerRepo;

    public List<FeedbackDTOS.FeedbackResponseDTO> getAllFeedbacks() {
        return feedbackRepo.findByDeleteStatusOrderByCreatedAtDesc(false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<FeedbackDTOS.FeedbackResponseDTO> getFeedbackById(Long id) {
        return feedbackRepo.findByIdAndDeleteStatus(id, false)
                .map(this::convertToResponseDTO);
    }

    public List<FeedbackDTOS.FeedbackResponseDTO> getFeedbacksByPassenger(Long passengerId) {
        return feedbackRepo.findByCreatedByIdAndDeleteStatus(passengerId, false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public FeedbackDTOS.FeedbackResponseDTO createFeedback(FeedbackDTOS.CreateFeedbackDTO createDTO) {
        Optional<PassengerModel> passenger = passengerRepo.findByIdAndDeleteStatus(createDTO.getCreatedBy(), false);
        if (!passenger.isPresent()) {
            throw new RuntimeException("Passenger not found");
        }

        FeedbackModel feedback = new FeedbackModel(
                createDTO.getTitle(),
                createDTO.getMessage(),
                createDTO.getNumOfStars(),
                passenger.get()
        );

        FeedbackModel savedFeedback = feedbackRepo.save(feedback);
        return convertToResponseDTO(savedFeedback);
    }

    public Optional<FeedbackDTOS.FeedbackResponseDTO> updateFeedback(Long id, FeedbackDTOS.UpdateFeedbackDTO updateDTO) {
        return feedbackRepo.findByIdAndDeleteStatus(id, false)
                .map(feedback -> {
                    if (updateDTO.getTitle() != null) {
                        feedback.setTitle(updateDTO.getTitle());
                    }
                    if (updateDTO.getMessage() != null) {
                        feedback.setMessage(updateDTO.getMessage());
                    }
                    if (updateDTO.getNumOfStars() != null) {
                        feedback.setNumOfStars(updateDTO.getNumOfStars());
                    }
                    return convertToResponseDTO(feedbackRepo.save(feedback));
                });
    }

    public boolean deleteFeedback(Long id) {
        Optional<FeedbackModel> feedback = feedbackRepo.findByIdAndDeleteStatus(id, false);
        if (feedback.isPresent()) {
            FeedbackModel feedbackModel = feedback.get();
            feedbackModel.setDeleteStatus(true);
            feedbackRepo.save(feedbackModel);
            return true;
        }
        return false;
    }

    private FeedbackDTOS.FeedbackResponseDTO convertToResponseDTO(FeedbackModel feedback) {
        FeedbackDTOS.FeedbackResponseDTO responseDTO = new FeedbackDTOS.FeedbackResponseDTO();
        responseDTO.setId(feedback.getId());
        responseDTO.setTitle(feedback.getTitle());
        responseDTO.setMessage(feedback.getMessage());
        responseDTO.setNumOfStars(feedback.getNumOfStars());
        responseDTO.setDeleteStatus(feedback.getDeleteStatus());
        responseDTO.setCreatedAt(feedback.getCreatedAt());
        responseDTO.setUpdatedAt(feedback.getUpdatedAt());

        FeedbackDTOS.PassengerInfo passengerInfo = new FeedbackDTOS.PassengerInfo();
        passengerInfo.setId(feedback.getCreatedBy().getId());
        passengerInfo.setFirstName(feedback.getCreatedBy().getFirstName());
        passengerInfo.setLastName(feedback.getCreatedBy().getLastName());
        passengerInfo.setEmail(feedback.getCreatedBy().getEmail());
        responseDTO.setCreatedBy(passengerInfo);

        return responseDTO;
    }
}