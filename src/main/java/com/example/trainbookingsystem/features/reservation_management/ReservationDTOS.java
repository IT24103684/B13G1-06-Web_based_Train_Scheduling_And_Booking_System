package com.example.trainbookingsystem.features.reservation_management;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class ReservationDTOS {

    public static class CreateReservationDTO {
        private Long bookingId;
        private Integer numOfAdultSeats;
        private Integer numOfChildrenSeats;
        private String trainBoxClass;
        private BigDecimal totalBill;
        private String status;

        public CreateReservationDTO() {}

        public Long getBookingId() {
            return bookingId;
        }

        public void setBookingId(Long bookingId) {
            this.bookingId = bookingId;
        }

        public Integer getNumOfAdultSeats() {
            return numOfAdultSeats;
        }

        public void setNumOfAdultSeats(Integer numOfAdultSeats) {
            this.numOfAdultSeats = numOfAdultSeats;
        }

        public Integer getNumOfChildrenSeats() {
            return numOfChildrenSeats;
        }

        public void setNumOfChildrenSeats(Integer numOfChildrenSeats) {
            this.numOfChildrenSeats = numOfChildrenSeats;
        }

        public String getTrainBoxClass() {
            return trainBoxClass;
        }

        public void setTrainBoxClass(String trainBoxClass) {
            this.trainBoxClass = trainBoxClass;
        }

        public BigDecimal getTotalBill() {
            return totalBill;
        }

        public void setTotalBill(BigDecimal totalBill) {
            this.totalBill = totalBill;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class UpdateReservationDTO {
        private Integer numOfAdultSeats;
        private Integer numOfChildrenSeats;
        private String trainBoxClass;
        private BigDecimal totalBill;
        private String status;

        public UpdateReservationDTO() {}

        public Integer getNumOfAdultSeats() {
            return numOfAdultSeats;
        }

        public void setNumOfAdultSeats(Integer numOfAdultSeats) {
            this.numOfAdultSeats = numOfAdultSeats;
        }

        public Integer getNumOfChildrenSeats() {
            return numOfChildrenSeats;
        }

        public void setNumOfChildrenSeats(Integer numOfChildrenSeats) {
            this.numOfChildrenSeats = numOfChildrenSeats;
        }

        public String getTrainBoxClass() {
            return trainBoxClass;
        }

        public void setTrainBoxClass(String trainBoxClass) {
            this.trainBoxClass = trainBoxClass;
        }

        public BigDecimal getTotalBill() {
            return totalBill;
        }

        public void setTotalBill(BigDecimal totalBill) {
            this.totalBill = totalBill;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class ReservationResponseDTO {
        private Long id;
        private BookingInfo booking;
        private Boolean deleteStatus;
        private Integer numOfAdultSeats;
        private Integer numOfChildrenSeats;
        private String trainBoxClass;
        private BigDecimal totalBill;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ReservationResponseDTO() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public BookingInfo getBooking() {
            return booking;
        }

        public void setBooking(BookingInfo booking) {
            this.booking = booking;
        }

        public Boolean getDeleteStatus() {
            return deleteStatus;
        }

        public void setDeleteStatus(Boolean deleteStatus) {
            this.deleteStatus = deleteStatus;
        }

        public Integer getNumOfAdultSeats() {
            return numOfAdultSeats;
        }

        public void setNumOfAdultSeats(Integer numOfAdultSeats) {
            this.numOfAdultSeats = numOfAdultSeats;
        }

        public Integer getNumOfChildrenSeats() {
            return numOfChildrenSeats;
        }

        public void setNumOfChildrenSeats(Integer numOfChildrenSeats) {
            this.numOfChildrenSeats = numOfChildrenSeats;
        }

        public String getTrainBoxClass() {
            return trainBoxClass;
        }

        public void setTrainBoxClass(String trainBoxClass) {
            this.trainBoxClass = trainBoxClass;
        }

        public BigDecimal getTotalBill() {
            return totalBill;
        }

        public void setTotalBill(BigDecimal totalBill) {
            this.totalBill = totalBill;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
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

    public static class BookingInfo {
        private Long id;
        private String additionalNotes;
        private PassengerInfo passenger;
        private ScheduleInfo schedule;

        public BookingInfo() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getAdditionalNotes() {
            return additionalNotes;
        }

        public void setAdditionalNotes(String additionalNotes) {
            this.additionalNotes = additionalNotes;
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