package com.example.trainbookingsystem.patterns.observer;

import com.example.trainbookingsystem.features.schedule_management.ScheduleModel;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AuditService implements ScheduleObserver {
    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);

    @Override
    public void onScheduleDelete(ScheduleModel schedule, String deleteType) {
        String auditEntry = String.format(
                "SCHEDULE_DELETE | ID: %d | Route: %s-%s | Date: %s | Type: %s | Time: %s",
                schedule.getId(),
                schedule.getFromCity(),
                schedule.getToCity(),
                schedule.getDate(),
                deleteType,
                java.time.LocalDateTime.now()
        );

        logger.info("📊 Audit: {}", auditEntry);

        // TODO: Save to audit log database
        // auditRepository.save(new AuditLog("SCHEDULE_DELETE", schedule.getId(), auditEntry));
    }

    @Override
    public void onScheduleUpdate(ScheduleModel schedule) {
        String auditEntry = String.format(
                "SCHEDULE_UPDATE | ID: %d | Route: %s-%s | Train: %s | Time: %s",
                schedule.getId(),
                schedule.getFromCity(),
                schedule.getToCity(),
                schedule.getTrainName(),
                java.time.LocalDateTime.now()
        );

        logger.info("📊 Audit: {}", auditEntry);

        // TODO: Save to audit log
    }

    @Override
    public void onScheduleCreate(ScheduleModel schedule) {
        String auditEntry = String.format(
                "SCHEDULE_CREATE | ID: %d | Route: %s-%s | Train: %s | Date: %s",
                schedule.getId(),
                schedule.getFromCity(),
                schedule.getToCity(),
                schedule.getTrainName(),
                schedule.getDate()
        );

        logger.info("📊 Audit: {}", auditEntry);

        // TODO: Save to audit log
    }
}