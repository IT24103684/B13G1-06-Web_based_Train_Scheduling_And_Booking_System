package com.example.trainbookingsystem.features.booking_management;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BookingViews {
    @GetMapping("/create-booking")
    public  String createBooking(){
        return "booking_management/create";
    }

    @GetMapping("/my-bookings")
    public  String myBookings(){
        return "booking_management/userList";
    }

    @GetMapping("/edit-booking")
    public  String editBooking(){
        return  "booking_management/edit";
    }
    @GetMapping("/booking-list")
    public  String adminList(){
        return "booking_management/list";
    }
}