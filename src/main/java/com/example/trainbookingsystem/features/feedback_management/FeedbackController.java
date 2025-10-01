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

    @PostMapping
    public ResponseEntity<?> createFeedback(@RequestBody FeedbackDTOS.CreateFeedbackDTO createDTO) {
        try {
            FeedbackDTOS.FeedbackResponseDTO feedback = feedbackService.createFeedback(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(feedback);
        } catch (RuntimeException e) {
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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating feedback");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        try {
            boolean deleted = feedbackService.deleteFeedback(id);
            if (deleted) {
                return ResponseEntity.ok("Feedback deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Feedback not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting feedback");
        }
    }
}