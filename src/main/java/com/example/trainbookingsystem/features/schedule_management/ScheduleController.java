package com.example.trainbookingsystem.features.schedule_management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

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
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        try {
            boolean deleted = scheduleService.deleteSchedule(id);
            if (deleted) {
                return ResponseEntity.ok("Schedule deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Schedule not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting schedule");
        }
    }
}