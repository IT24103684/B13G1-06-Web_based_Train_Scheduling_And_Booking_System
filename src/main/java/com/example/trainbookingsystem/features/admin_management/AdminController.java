package com.example.trainbookingsystem.features.admin_management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    public ResponseEntity<?> getAllAdmins() {
        try {
            List<AdminDTOS.AdminResponseDTO> admins = adminService.getAllAdmins();
            return ResponseEntity.ok(admins);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving admins");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        try {
            Optional<AdminDTOS.AdminResponseDTO> admin = adminService.getAdminById(id);
            if (admin.isPresent()) {
                return ResponseEntity.ok(admin.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving admin");
        }
    }

    @PostMapping
    public ResponseEntity<?> createAdmin(@RequestBody AdminDTOS.CreateAdminDTO createDTO) {
        try {
            AdminDTOS.AdminResponseDTO admin = adminService.createAdmin(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating admin");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody AdminDTOS.UpdateAdminDTO updateDTO) {
        try {
            Optional<AdminDTOS.AdminResponseDTO> admin = adminService.updateAdmin(id, updateDTO);
            if (admin.isPresent()) {
                return ResponseEntity.ok(admin.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating admin");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        try {
            boolean deleted = adminService.deleteAdmin(id);
            if (deleted) {
                return ResponseEntity.ok("Admin deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting admin");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminDTOS.AdminLoginDTO loginDTO) {
        try {
            Optional<AdminDTOS.AdminResponseDTO> admin = adminService.login(loginDTO);
            if (admin.isPresent()) {
                return ResponseEntity.ok(admin.get());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during login");
        }
    }
}