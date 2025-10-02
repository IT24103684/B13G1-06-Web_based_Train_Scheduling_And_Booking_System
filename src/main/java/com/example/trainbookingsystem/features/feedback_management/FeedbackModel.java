package com.example.trainbookingsystem.features.feedback_management;

import com.example.trainbookingsystem.features.passenger_management.PassengerModel;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
public class FeedbackModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "num_of_stars", nullable = false)
    private Integer numOfStars;

    @Column(name = "delete_status", nullable = false)
    private Boolean deleteStatus = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private PassengerModel createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public FeedbackModel() {}

    public FeedbackModel(String title, String message, Integer numOfStars, PassengerModel createdBy) {
        this.title = title;
        this.message = message;
        this.numOfStars = numOfStars;
        this.createdBy = createdBy;
        this.deleteStatus = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

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

    public PassengerModel getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(PassengerModel createdBy) {
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