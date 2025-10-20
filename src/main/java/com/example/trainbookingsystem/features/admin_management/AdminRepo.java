package com.example.trainbookingsystem.features.admin_management;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepo extends JpaRepository<AdminModel, Long> {

    Optional<AdminModel> findByEmail(String email);

    boolean existsByEmail(String email);
}
