package com.example.trainbookingsystem.features.payment_management;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PaymentViews {

    @GetMapping("/create-payment")
    public String createPayment() {
        return "payment_management/create";
    }

    @GetMapping("/my-payments")
    public String myPayments() {
        return "payment_management/userList";
    }

    @GetMapping("/edit-payment")
    public String editPayment() {
        return "payment_management/edit";
    }

    @GetMapping("/payment-list")
    public String adminList() {
        return "payment_management/list";
    }

    @GetMapping("/payment-details")
    public String paymentDetails() {
        return "payment_management/details";
    }
}