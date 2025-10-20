package com.example.trainbookingsystem.features.admin_management;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminViews {
    @GetMapping("/")
    public  String home(){
        return "index";
    }
    @GetMapping("/admin-login")
    public  String adminLogin(){
        return "admin_management/admin_login";
    }
    @GetMapping("/admin-dashboard")
    public  String adminDashboard(){
        return "admin_management/dashboard";
    }
    @GetMapping("/create-admin")
    public  String createAdmin(){
        return "admin_management/create";
    }
    @GetMapping("/edit-admin")
    public  String editAdmin(){
        return "admin_management/edit";
    }
    @GetMapping("/admin-list")
    public  String adminList(){
        return "admin_management/list";
    }

}