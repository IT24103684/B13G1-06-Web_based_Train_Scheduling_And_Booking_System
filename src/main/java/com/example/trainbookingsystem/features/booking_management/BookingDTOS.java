package com.example.trainbookingsystem.features.booking_management;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingDTOS {

    public static class CreateBookingDTO {
        private Long passengerId;
        private Long scheduleId;
        private Integer seatCount;
        private String additionalNotes;

        public CreateBookingDTO() {}

        public Integer getSeatCount() {
            return seatCount;
        }

        public void setSeatCount(Integer seatCount) {
            this.seatCount = seatCount;
        }


        public Long getPassengerId() {
            return passengerId;
        }

        public void setPassengerId(Long passengerId) {
            this.passengerId = passengerId;
        }

        public Long getScheduleId() {
            return scheduleId;
        }

        public void setScheduleId(Long scheduleId) {
            this.scheduleId = scheduleId;
        }

        public String getAdditionalNotes() {
            return additionalNotes;
        }

        public void setAdditionalNotes(String additionalNotes) {
            this.additionalNotes = additionalNotes;
        }
    }

    public static class UpdateBookingDTO {
        private String additionalNotes;

        public UpdateBookingDTO() {}

        public String getAdditionalNotes() {
            return additionalNotes;
        }

        public void setAdditionalNotes(String additionalNotes) {
            this.additionalNotes = additionalNotes;
        }
    }

    public static class BookingResponseDTO {
        private Long id;
        private PassengerInfo passenger;
        private ScheduleInfo schedule;
        private String additionalNotes;
        private Boolean deleteStatus;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public BookingResponseDTO() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public PassengerInfo getPassenger() {
            return passenger;
        }

        public void setPassenger(PassengerInfo passenger) {
            this.passenger = passenger;
        }

        public ScheduleInfo getSchedule() {
            return schedule;
        }

        public void setSchedule(ScheduleInfo schedule) {
            this.schedule = schedule;
        }

        public String getAdditionalNotes() {
            return additionalNotes;
        }

        public void setAdditionalNotes(String additionalNotes) {
            this.additionalNotes = additionalNotes;
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

    public static class PassengerInfo {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String contactNumber;

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

        public String getContactNumber() {
            return contactNumber;
        }

        public void setContactNumber(String contactNumber) {
            this.contactNumber = contactNumber;
        }
    }

    public static class ScheduleInfo {
        private Long id;
        private String fromCity;
        private String toCity;
        private LocalDate date;
        private LocalTime time;
        private String trainType;
        private String trainName;

        public ScheduleInfo() {}

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
    }
}