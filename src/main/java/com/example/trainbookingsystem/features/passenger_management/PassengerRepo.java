package com.example.trainbookingsystem.features.passenger_management;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PassengerRepo extends JpaRepository<PassengerModel, Long> {

    Optional<PassengerModel> findByEmail(String email);

    boolean existsByEmail(String email);

    List<PassengerModel> findByDeleteStatus(Boolean deleteStatus);

    Optional<PassengerModel> findByIdAndDeleteStatus(Long id, Boolean deleteStatus);

    Optional<PassengerModel> findByResetToken(String resetToken);
}