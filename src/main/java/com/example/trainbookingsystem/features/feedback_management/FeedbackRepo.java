package com.example.trainbookingsystem.features.feedback_management;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepo extends JpaRepository<FeedbackModel, Long> {

    List<FeedbackModel> findByDeleteStatus(Boolean deleteStatus);

    Optional<FeedbackModel> findByIdAndDeleteStatus(Long id, Boolean deleteStatus);

    List<FeedbackModel> findByCreatedByIdAndDeleteStatus(Long passengerId, Boolean deleteStatus);

    List<FeedbackModel> findByDeleteStatusOrderByCreatedAtDesc(Boolean deleteStatus);
}