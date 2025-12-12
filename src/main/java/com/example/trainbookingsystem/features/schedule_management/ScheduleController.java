package com.example.trainbookingsystem.features.schedule_management;

import com.example.trainbookingsystem.patterns.observer.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/notifications")
    public ResponseEntity<List<String>> getNotifications() {
        System.out.println("📢 Notifications endpoint called");
        try {
            List<String> messages = notificationService.getMessages();
            System.out.println("📢 Returning " + messages.size() + " notifications: " + messages);

            // Ensure we always return a List, never null
            if (messages == null) {
                messages = new ArrayList<>();
            }

            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            System.err.println("❌ Error in notifications endpoint: " + e.getMessage());
            e.printStackTrace();
            // Return empty list instead of error
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllSchedules() {
        try {
            List<ScheduleDTOS.ScheduleResponseDTO> schedules = scheduleService.getAllSchedules();
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving schedules");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getScheduleById(@PathVariable Long id) {
        try {
            Optional<ScheduleDTOS.ScheduleResponseDTO> schedule = scheduleService.getScheduleById(id);
            if (schedule.isPresent()) {
                return ResponseEntity.ok(schedule.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Schedule not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving schedule");
        }
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<?> getSchedulesByDate(@PathVariable LocalDate date) {
        try {
            List<ScheduleDTOS.ScheduleResponseDTO> schedules = scheduleService.getSchedulesByDate(date);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving schedules by date");
        }
    }

    @GetMapping("/route")
    public ResponseEntity<?> getSchedulesByRoute(@RequestParam String fromCity, @RequestParam String toCity) {
        try {
            List<ScheduleDTOS.ScheduleResponseDTO> schedules = scheduleService.getSchedulesByRoute(fromCity, toCity);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving schedules by route");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> getSchedulesByRouteAndDate(@RequestParam String fromCity, @RequestParam String toCity, @RequestParam LocalDate date) {
        try {
            List<ScheduleDTOS.ScheduleResponseDTO> schedules = scheduleService.getSchedulesByRouteAndDate(fromCity, toCity, date);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving schedules by route and date");
        }
    }

    @PostMapping
    public ResponseEntity<?> createSchedule(@RequestBody ScheduleDTOS.CreateScheduleDTO createDTO) {
        try {
            ScheduleDTOS.ScheduleResponseDTO schedule = scheduleService.createSchedule(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(schedule);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating schedule");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable Long id, @RequestBody ScheduleDTOS.UpdateScheduleDTO updateDTO) {
        try {
            Optional<ScheduleDTOS.ScheduleResponseDTO> schedule = scheduleService.updateSchedule(id, updateDTO);
            if (schedule.isPresent()) {
                return ResponseEntity.ok(schedule.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Schedule not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating schedule");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id, @RequestParam(required = false) Boolean hardDelete) {
        try {
            boolean isHardDelete = Boolean.TRUE.equals(hardDelete);
            boolean deleted = scheduleService.deleteSchedule(id, isHardDelete);
            if (deleted) {
                String message = isHardDelete ?
                        "Schedule permanently deleted successfully" :
                        "Schedule soft deleted successfully";
                return ResponseEntity.ok(message);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Schedule not found");
            }
        } catch (ScheduleService.ScheduleException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting schedule");
        }
    }
}