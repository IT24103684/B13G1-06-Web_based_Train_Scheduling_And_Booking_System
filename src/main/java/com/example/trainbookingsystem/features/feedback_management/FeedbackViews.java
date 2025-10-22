package com.example.trainbookingsystem.features.feedback_management;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FeedbackViews {
    @GetMapping("/feedbacks")
    public String userFeedbacks(){
        return "feedback_management/userList";
    }

    @GetMapping("/feedback-list")
    public String adminFeedbacks(){
        return "feedback_management/list";
    }

    @GetMapping("/create-feedback")
    public String createFeedback(){
        return "feedback_management/create";
    }
}