package com.example.trainbookingsystem.features.admin_management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private AdminRepo adminRepo;

    public List<AdminDTOS.AdminResponseDTO> getAllAdmins() {
        return adminRepo.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<AdminDTOS.AdminResponseDTO> getAdminById(Long id) {
        return adminRepo.findById(id)
                .map(this::convertToResponseDTO);
    }

    public AdminDTOS.AdminResponseDTO createAdmin(AdminDTOS.CreateAdminDTO createDTO) {
        if (adminRepo.existsByEmail(createDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        AdminModel admin = new AdminModel(
                createDTO.getName(),
                createDTO.getEmail(),
                createDTO.getPassword(),
                createDTO.getDescription(),
                createDTO.getContactNumber()
        );

        AdminModel savedAdmin = adminRepo.save(admin);
        return convertToResponseDTO(savedAdmin);
    }

    public Optional<AdminDTOS.AdminResponseDTO> updateAdmin(Long id, AdminDTOS.UpdateAdminDTO updateDTO) {
        return adminRepo.findById(id)
                .map(admin -> {
                    if (updateDTO.getName() != null) {
                        admin.setName(updateDTO.getName());
                    }
                    if (updateDTO.getDescription() != null) {
                        admin.setDescription(updateDTO.getDescription());
                    }
                    if (updateDTO.getContactNumber() != null) {
                        admin.setContactNumber(updateDTO.getContactNumber());
                    }
                    return convertToResponseDTO(adminRepo.save(admin));
                });
    }

    public boolean deleteAdmin(Long id) {
        if (adminRepo.existsById(id)) {
            adminRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<AdminDTOS.AdminResponseDTO> login(AdminDTOS.AdminLoginDTO loginDTO) {
        return adminRepo.findByEmail(loginDTO.getEmail())
                .filter(admin -> admin.getPassword().equals(loginDTO.getPassword()))
                .map(this::convertToResponseDTO);
    }

    private AdminDTOS.AdminResponseDTO convertToResponseDTO(AdminModel admin) {
        AdminDTOS.AdminResponseDTO responseDTO = new AdminDTOS.AdminResponseDTO();
        responseDTO.setId(admin.getId());
        responseDTO.setName(admin.getName());
        responseDTO.setEmail(admin.getEmail());
        responseDTO.setDescription(admin.getDescription());
        responseDTO.setContactNumber(admin.getContactNumber());
        responseDTO.setCreatedAt(admin.getCreatedAt());
        responseDTO.setUpdatedAt(admin.getUpdatedAt());
        return responseDTO;
    }
}
