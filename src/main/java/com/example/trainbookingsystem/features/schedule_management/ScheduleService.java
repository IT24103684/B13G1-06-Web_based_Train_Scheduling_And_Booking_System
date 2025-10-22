package com.example.trainbookingsystem.features.schedule_management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepo scheduleRepo;

    public List<ScheduleDTOS.ScheduleResponseDTO> getAllSchedules() {
        return scheduleRepo.findByDeleteStatusOrderByDateAscTimeAsc(false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<ScheduleDTOS.ScheduleResponseDTO> getScheduleById(Long id) {
        return scheduleRepo.findByIdAndDeleteStatus(id, false)
                .map(this::convertToResponseDTO);
    }

    public List<ScheduleDTOS.ScheduleResponseDTO> getSchedulesByDate(LocalDate date) {
        return scheduleRepo.findByDateAndDeleteStatus(date, false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ScheduleDTOS.ScheduleResponseDTO> getSchedulesByRoute(String fromCity, String toCity) {
        return scheduleRepo.findByFromCityAndToCityAndDeleteStatus(fromCity, toCity, false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ScheduleDTOS.ScheduleResponseDTO> getSchedulesByRouteAndDate(String fromCity, String toCity, LocalDate date) {
        return scheduleRepo.findByFromCityAndToCityAndDateAndDeleteStatus(fromCity, toCity, date, false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public ScheduleDTOS.ScheduleResponseDTO createSchedule(ScheduleDTOS.CreateScheduleDTO createDTO) {
        ScheduleModel schedule = new ScheduleModel(
                createDTO.getFromCity(),
                createDTO.getToCity(),
                createDTO.getDate(),
                createDTO.getTime(),
                createDTO.getTrainType(),
                createDTO.getTrainName()
        );

        if (createDTO.getAvailableEconomySeats() != null) {
            schedule.setAvailableEconomySeats(createDTO.getAvailableEconomySeats());
        }
        if (createDTO.getAvailableBusinessSeats() != null) {
            schedule.setAvailableBusinessSeats(createDTO.getAvailableBusinessSeats());
        }
        if (createDTO.getAvailableFirstClassSeats() != null) {
            schedule.setAvailableFirstClassSeats(createDTO.getAvailableFirstClassSeats());
        }
        if (createDTO.getAvailableLuxurySeats() != null) {
            schedule.setAvailableLuxurySeats(createDTO.getAvailableLuxurySeats());
        }

        ScheduleModel savedSchedule = scheduleRepo.save(schedule);
        return convertToResponseDTO(savedSchedule);
    }

    public Optional<ScheduleDTOS.ScheduleResponseDTO> updateSchedule(Long id, ScheduleDTOS.UpdateScheduleDTO updateDTO) {
        return scheduleRepo.findByIdAndDeleteStatus(id, false)
                .map(schedule -> {
                    if (updateDTO.getFromCity() != null) {
                        schedule.setFromCity(updateDTO.getFromCity());
                    }
                    if (updateDTO.getToCity() != null) {
                        schedule.setToCity(updateDTO.getToCity());
                    }
                    if (updateDTO.getDate() != null) {
                        schedule.setDate(updateDTO.getDate());
                    }
                    if (updateDTO.getTime() != null) {
                        schedule.setTime(updateDTO.getTime());
                    }
                    if (updateDTO.getTrainType() != null) {
                        schedule.setTrainType(updateDTO.getTrainType());
                    }
                    if (updateDTO.getTrainName() != null) {
                        schedule.setTrainName(updateDTO.getTrainName());
                    }

                    // UPDATE SEAT AVAILABILITY IF PROVIDED
                    if (updateDTO.getAvailableEconomySeats() != null) {
                        schedule.setAvailableEconomySeats(updateDTO.getAvailableEconomySeats());
                    }
                    if (updateDTO.getAvailableBusinessSeats() != null) {
                        schedule.setAvailableBusinessSeats(updateDTO.getAvailableBusinessSeats());
                    }
                    if (updateDTO.getAvailableFirstClassSeats() != null) {
                        schedule.setAvailableFirstClassSeats(updateDTO.getAvailableFirstClassSeats());
                    }
                    if (updateDTO.getAvailableLuxurySeats() != null) {
                        schedule.setAvailableLuxurySeats(updateDTO.getAvailableLuxurySeats());
                    }

                    return convertToResponseDTO(scheduleRepo.save(schedule));
                });
    }

    public boolean deleteSchedule(Long id) {
        Optional<ScheduleModel> schedule = scheduleRepo.findByIdAndDeleteStatus(id, false);
        if (schedule.isPresent()) {
            ScheduleModel scheduleModel = schedule.get();
            scheduleModel.setDeleteStatus(true);
            scheduleRepo.save(scheduleModel);
            return true;
        }
        return false;
    }

    private ScheduleDTOS.ScheduleResponseDTO convertToResponseDTO(ScheduleModel schedule) {
        ScheduleDTOS.ScheduleResponseDTO responseDTO = new ScheduleDTOS.ScheduleResponseDTO();
        responseDTO.setId(schedule.getId());
        responseDTO.setFromCity(schedule.getFromCity());
        responseDTO.setToCity(schedule.getToCity());
        responseDTO.setDate(schedule.getDate());
        responseDTO.setTime(schedule.getTime());
        responseDTO.setTrainType(schedule.getTrainType());
        responseDTO.setTrainName(schedule.getTrainName());

        // ADD SEAT AVAILABILITY TO RESPONSE
        responseDTO.setAvailableEconomySeats(schedule.getAvailableEconomySeats());
        responseDTO.setAvailableBusinessSeats(schedule.getAvailableBusinessSeats());
        responseDTO.setAvailableFirstClassSeats(schedule.getAvailableFirstClassSeats());
        responseDTO.setAvailableLuxurySeats(schedule.getAvailableLuxurySeats());

        responseDTO.setDeleteStatus(schedule.getDeleteStatus());
        responseDTO.setCreatedAt(schedule.getCreatedAt());
        responseDTO.setUpdatedAt(schedule.getUpdatedAt());
        return responseDTO;
    }
}