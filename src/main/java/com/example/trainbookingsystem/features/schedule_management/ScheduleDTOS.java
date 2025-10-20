package com.example.trainbookingsystem.features.schedule_management;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class ScheduleDTOS {

    public static class CreateScheduleDTO {
        private String fromCity;
        private String toCity;
        private LocalDate date;
        private LocalTime time;
        private String trainType;
        private String trainName;

        public CreateScheduleDTO() {}

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
    }

    public static class UpdateScheduleDTO {
        private String fromCity;
        private String toCity;
        private LocalDate date;
        private LocalTime time;
        private String trainType;
        private String trainName;

        public UpdateScheduleDTO() {}

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
    }

    public static class ScheduleResponseDTO {
        private Long id;
        private String fromCity;
        private String toCity;
        private LocalDate date;
        private LocalTime time;
        private String trainType;
        private String trainName;
        private Boolean deleteStatus;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ScheduleResponseDTO() {}

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
    }
}