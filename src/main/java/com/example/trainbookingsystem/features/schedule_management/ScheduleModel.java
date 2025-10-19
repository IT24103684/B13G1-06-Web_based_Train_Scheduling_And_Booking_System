package com.example.trainbookingsystem.features.schedule_management;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "schedules")
public class ScheduleModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "from_city", nullable = false, length = 100)
    private String fromCity;

    @Column(name = "to_city", nullable = false, length = 100)
    private String toCity;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "time", nullable = false)
    private LocalTime time;

    @Column(name = "train_type", nullable = false, length = 50)
    private String trainType;

    @Column(name = "train_name", nullable = false, length = 100)
    private String trainName;

    @Column(name = "available_economy_seats", nullable = false)
    private Integer availableEconomySeats = 50;

    @Column(name = "available_business_seats", nullable = false)
    private Integer availableBusinessSeats = 30;

    @Column(name = "available_first_class_seats", nullable = false)
    private Integer availableFirstClassSeats = 20;

    @Column(name = "available_luxury_seats", nullable = false)
    private Integer availableLuxurySeats = 10;

    @Column(name = "delete_status", nullable = false)
    private Boolean deleteStatus = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public ScheduleModel() {}

    public ScheduleModel(String fromCity, String toCity, LocalDate date, LocalTime time,
                         String trainType, String trainName) {
        this.fromCity = fromCity;
        this.toCity = toCity;
        this.date = date;
        this.time = time;
        this.trainType = trainType;
        this.trainName = trainName;
        this.availableEconomySeats = 50;
        this.availableBusinessSeats = 30;
        this.availableFirstClassSeats = 20;
        this.availableLuxurySeats = 10;
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

    public String getFromCity() {
        return fromCity;
    }

    public void setFromCity(String fromCity) {
        this.fromCity = fromCity;
    }

    public String getToCity() {
        return toCity;
    }

    public void setToCity(String toCity) {
        this.toCity = toCity;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public String getTrainType() {
        return trainType;
    }

    public void setTrainType(String trainType) {
        this.trainType = trainType;
    }

    public String getTrainName() {
        return trainName;
    }

    public void setTrainName(String trainName) {
        this.trainName = trainName;
    }

    public Boolean getDeleteStatus() {
        return deleteStatus;
    }

    public void setDeleteStatus(Boolean deleteStatus) {
        this.deleteStatus = deleteStatus;
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

    public Integer getAvailableEconomySeats() {
        return availableEconomySeats;
    }

    public void setAvailableEconomySeats(Integer availableEconomySeats) {
        this.availableEconomySeats = availableEconomySeats;
    }

    public Integer getAvailableBusinessSeats() {
        return availableBusinessSeats;
    }

    public void setAvailableBusinessSeats(Integer availableBusinessSeats) {
        this.availableBusinessSeats = availableBusinessSeats;
    }

    public Integer getAvailableFirstClassSeats() {
        return availableFirstClassSeats;
    }

    public void setAvailableFirstClassSeats(Integer availableFirstClassSeats) {
        this.availableFirstClassSeats = availableFirstClassSeats;
    }

    public Integer getAvailableLuxurySeats() {
        return availableLuxurySeats;
    }

    public void setAvailableLuxurySeats(Integer availableLuxurySeats) {
        this.availableLuxurySeats = availableLuxurySeats;
    }
}