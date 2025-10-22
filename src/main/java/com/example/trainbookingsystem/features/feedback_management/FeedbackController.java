package com.example.trainbookingsystem.features.feedback_management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public ResponseEntity<?> getAllFeedbacks() {
        try {
            List<FeedbackDTOS.FeedbackResponseDTO> feedbacks = feedbackService.getAllFeedbacks();
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving feedbacks");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFeedbackById(@PathVariable Long id) {
        try {
            Optional<FeedbackDTOS.FeedbackResponseDTO> feedback = feedbackService.getFeedbackById(id);
            if (feedback.isPresent()) {
                return ResponseEntity.ok(feedback.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Feedback not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving feedback");
        }
    }

    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<?> getFeedbacksByPassenger(@PathVariable Long passengerId) {
        try {
            List<FeedbackDTOS.FeedbackResponseDTO> feedbacks = feedbackService.getFeedbacksByPassenger(passengerId);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving passenger feedbacks");
        }
    }


    @GetMapping("/deleted")
    public ResponseEntity<?> getDeletedFeedbacks() {
        try {
            List<FeedbackDTOS.FeedbackResponseDTO> deletedFeedbacks = feedbackService.getDeletedFeedbacks();
            return ResponseEntity.ok(deletedFeedbacks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving deleted feedbacks");
        }
    }

    @PostMapping
    public ResponseEntity<?> createFeedback(@RequestBody FeedbackDTOS.CreateFeedbackDTO createDTO) {
        try {
            FeedbackDTOS.FeedbackResponseDTO feedback = feedbackService.createFeedback(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(feedback);
        } catch (FeedbackService.FeedbackException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating feedback");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeedback(@PathVariable Long id, @RequestBody FeedbackDTOS.UpdateFeedbackDTO updateDTO) {
        try {
            Optional<FeedbackDTOS.FeedbackResponseDTO> feedback = feedbackService.updateFeedback(id, updateDTO);
            if (feedback.isPresent()) {
                return ResponseEntity.ok(feedback.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Feedback not found");
            }
        } catch (FeedbackService.FeedbackException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating feedback");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id,
                                            @RequestParam(defaultValue = "false") boolean hardDelete) {
        try {
            boolean deleted = feedbackService.deleteFeedback(id, hardDelete);
            if (deleted) {
                String message = hardDelete ? "Feedback permanently deleted" : "Feedback soft deleted successfully";
                return ResponseEntity.ok(message);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Feedback not found");
            }
        } catch (FeedbackService.FeedbackException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting feedback");
        }
    }


    @DeleteMapping("/soft/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        return deleteFeedback(id, false);
    }


    @PutMapping("/{id}/restore")
    public ResponseEntity<?> restoreFeedback(@PathVariable Long id) {
        try {
            boolean restored = feedbackService.restoreFeedback(id);
            if (restored) {
                return ResponseEntity.ok("Feedback restored successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Deleted feedback not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error restoring feedback");
        }
    }
}