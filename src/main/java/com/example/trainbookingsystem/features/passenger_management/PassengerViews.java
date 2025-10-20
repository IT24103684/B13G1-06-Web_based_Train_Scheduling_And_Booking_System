package com.example.trainbookingsystem.features.passenger_management;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PassengerViews {
    @GetMapping("/login")
    public  String login(){
        return "passenger_management/login";
    }

    @GetMapping("/profile")
    public  String profile(){
        return "passenger_management/profile";
    }

    @GetMapping("/register")
    public  String register(){
        return "passenger_management/register";
    }

    @GetMapping("/user-list")
    public  String userList(){
        return "passenger_management/adminList";
    }

    @GetMapping("/passenger-list")
    public String passengerList(){
        return "passenger_management/list";
    }
}