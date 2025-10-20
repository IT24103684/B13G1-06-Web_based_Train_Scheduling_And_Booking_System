package com.example.trainbookingsystem.features.reservation_management;

import com.example.trainbookingsystem.features.booking_management.BookingModel;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class ReservationModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private BookingModel booking;

    @Column(name = "delete_status", nullable = false)
    private Boolean deleteStatus = false;

    @Column(name = "num_of_adult_seats", nullable = false)
    private Integer numOfAdultSeats;

    @Column(name = "num_of_children_seats", nullable = false)
    private Integer numOfChildrenSeats;

    @Column(name = "train_box_class", nullable = false)
    private String trainBoxClass;

    @Column(name = "total_bill", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalBill;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public ReservationModel() {}

    public ReservationModel(BookingModel booking, Integer numOfAdultSeats, Integer numOfChildrenSeats, String trainBoxClass, BigDecimal totalBill, String status) {
        this.booking = booking;
        this.numOfAdultSeats = numOfAdultSeats;
        this.numOfChildrenSeats = numOfChildrenSeats;
        this.trainBoxClass = trainBoxClass;
        this.totalBill = totalBill;
        this.status = status;
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

    public BookingModel getBooking() {
        return booking;
    }

    public void setBooking(BookingModel booking) {
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