package com.example.trainbookingsystem.features.reservation_management;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReservationViews {
    @GetMapping("/create-reservation")
    public  String createReservation(){
        return "reservation_management/create";
    }

    @GetMapping("/my-reservations")
    public  String myReservations(){
        return "reservation_management/userList";
    }

    @GetMapping("/edit-reservation")
    public  String editReservation(){
        return  "reservation_management/edit";
    }
    @GetMapping("/reservation-list")
    public  String adminList(){
        return "reservation_management/list";
    }
}