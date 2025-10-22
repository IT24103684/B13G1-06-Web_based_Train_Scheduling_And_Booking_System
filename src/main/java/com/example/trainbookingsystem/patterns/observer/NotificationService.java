package com.example.trainbookingsystem.patterns.observer;

import com.example.trainbookingsystem.features.schedule_management.ScheduleModel;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService implements ScheduleObserver {
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final List<String> messages = new ArrayList<>();

    public List<String> getMessages() {
        logger.info("🔔 Getting notifications - current count: {}", messages.size());

        // Always return a new ArrayList, never the original or null
        List<String> result = new ArrayList<>(messages);
        logger.info("🔔 Returning {} notifications", result.size());
        return result;
    }

    private void addMessage(String message) {
        String formattedMessage = LocalDateTime.now() + " - " + message;
        messages.add(0, formattedMessage);
        if (messages.size() > 50) {
            messages.remove(messages.size() - 1);
        }
        logger.info("🔔 Notification: {}", message);
    }

    @Override
    public void onScheduleDelete(ScheduleModel schedule, String deleteType) {
        String message = String.format(
                "Schedule CANCELLED: %s from %s to %s on %s (%s delete)",
                schedule.getTrainName(),
                schedule.getFromCity(),
                schedule.getToCity(),
                schedule.getDate(),
                "hard".equals(deleteType) ? "PERMANENT" : "soft"
        );
        addMessage(message);

        logger.info("Schedule {} deleted (Type: {})", schedule.getId(), deleteType);
    }

    @Override
    public void onScheduleUpdate(ScheduleModel schedule) {
        String message = String.format(
                "Schedule UPDATED: %s from %s to %s - New time: %s",
                schedule.getTrainName(),
                schedule.getFromCity(),
                schedule.getToCity(),
                schedule.getTime()
        );
        addMessage(message);

        logger.info("Schedule {} updated", schedule.getId());
    }

    @Override
    public void onScheduleCreate(ScheduleModel schedule) {
        String message = String.format(
                "NEW Schedule: %s from %s to %s on %s at %s",
                schedule.getTrainName(),
                schedule.getFromCity(),
                schedule.getToCity(),
                schedule.getDate(),
                schedule.getTime()
        );
        addMessage(message);

        logger.info("New schedule {} created", schedule.getId());
    }

    public void clearMessages() {
        messages.clear();
    }
}