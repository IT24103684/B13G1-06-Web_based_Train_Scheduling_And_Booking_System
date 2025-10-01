package com.example.trainbookingsystem.features.feedback_management;

import java.time.LocalDateTime;

public class FeedbackDTOS {

    public static class CreateFeedbackDTO {
        private String title;
        private String message;
        private Integer numOfStars;
        private Long createdBy;

        public CreateFeedbackDTO() {}

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Integer getNumOfStars() {
            return numOfStars;
        }

        public void setNumOfStars(Integer numOfStars) {
            this.numOfStars = numOfStars;
        }

        public Long getCreatedBy() {
            return createdBy;
        }

        public void setCreatedBy(Long createdBy) {
            this.createdBy = createdBy;
        }
    }

    public static class UpdateFeedbackDTO {
        private String title;
        private String message;
        private Integer numOfStars;

        public UpdateFeedbackDTO() {}

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Integer getNumOfStars() {
            return numOfStars;
        }

        public void setNumOfStars(Integer numOfStars) {
            this.numOfStars = numOfStars;
        }
    }

    public static class FeedbackResponseDTO {
        private Long id;
        private String title;
        private String message;
        private Integer numOfStars;
        private Boolean deleteStatus;
        private PassengerInfo createdBy;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public FeedbackResponseDTO() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Integer getNumOfStars() {
            return numOfStars;
        }

        public void setNumOfStars(Integer numOfStars) {
            this.numOfStars = numOfStars;
        }

        public Boolean getDeleteStatus() {
            return deleteStatus;
        }

        public void setDeleteStatus(Boolean deleteStatus) {
            this.deleteStatus = deleteStatus;
        }

        public PassengerInfo getCreatedBy() {
            return createdBy;
        }

        public void setCreatedBy(PassengerInfo createdBy) {
            this.createdBy = createdBy;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public LocalDateTime getUpdatedAt() {
            return updatedAt;
        }

        public void setUpdatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
        }
    }

    public static class PassengerInfo {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;

        public PassengerInfo() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}