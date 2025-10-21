package com.example.trainbookingsystem.features.feedback_management;

import com.example.trainbookingsystem.features.passenger_management.PassengerModel;
import com.example.trainbookingsystem.features.passenger_management.PassengerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
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
            throw new FeedbackException("Passenger not found");
        }


        if (createDTO.getNumOfStars() != null &&
                (createDTO.getNumOfStars() < 1 || createDTO.getNumOfStars() > 5)) {
            throw new FeedbackException("Rating must be between 1 and 5 stars");
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

                        if (updateDTO.getNumOfStars() < 1 || updateDTO.getNumOfStars() > 5) {
                            throw new FeedbackException("Rating must be between 1 and 5 stars");
                        }
                        feedback.setNumOfStars(updateDTO.getNumOfStars());
                    }
                    return convertToResponseDTO(feedbackRepo.save(feedback));
                });
    }

    @Transactional
    public boolean deleteFeedback(Long id, boolean hardDelete) {
        Optional<FeedbackModel> feedback = feedbackRepo.findByIdAndDeleteStatus(id, false);
        if (feedback.isPresent()) {
            FeedbackModel feedbackModel = feedback.get();

            if (hardDelete) {

                return hardDeleteFeedback(feedbackModel);
            } else {

                return softDeleteFeedback(feedbackModel);
            }
        }
        return false;
    }

    @Transactional
    protected boolean softDeleteFeedback(FeedbackModel feedbackModel) {
        try {

            feedbackModel.setDeleteStatus(true);
            feedbackRepo.save(feedbackModel);
            return true;
        } catch (Exception e) {
            throw new FeedbackException("Failed to soft delete feedback: " + e.getMessage());
        }
    }

    @Transactional
    protected boolean hardDeleteFeedback(FeedbackModel feedbackModel) {
        try {

            feedbackRepo.delete(feedbackModel);
            return true;
        } catch (Exception e) {
            throw new FeedbackException("Failed to hard delete feedback: " + e.getMessage());
        }
    }


    public boolean deleteFeedback(Long id) {
        return deleteFeedback(id, false);
    }


    public List<FeedbackDTOS.FeedbackResponseDTO> getDeletedFeedbacks() {
        return feedbackRepo.findByDeleteStatusOrderByCreatedAtDesc(true).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }


    public boolean restoreFeedback(Long id) {
        Optional<FeedbackModel> feedback = feedbackRepo.findByIdAndDeleteStatus(id, true);
        if (feedback.isPresent()) {
            FeedbackModel feedbackModel = feedback.get();
            feedbackModel.setDeleteStatus(false);
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


    public static class FeedbackException extends RuntimeException {
        public FeedbackException(String message) {
            super(message);
        }
    }

    public static class InvalidRatingException extends FeedbackException {
        public InvalidRatingException(String message) {
            super(message);
        }
    }
}