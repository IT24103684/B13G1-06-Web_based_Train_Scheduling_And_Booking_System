package com.example.trainbookingsystem.features.schedule_management;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ScheduleViews {
    @GetMapping("/schedule-list")
    public  String adminList(){
        return "schedule_management/list";
    }
    @GetMapping("/schedule-list-user")
    public  String userList(){
        return "schedule_management/userList";
    }
    @GetMapping("/create-schedule")
    public  String createSchedule(){
        return "schedule_management/create";
    }
    @GetMapping("/edit-schedule")
    public  String editSchedule(){
        return "schedule_management/edit";
    }
}