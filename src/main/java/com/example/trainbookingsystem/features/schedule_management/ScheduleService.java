package com.example.trainbookingsystem.features.schedule_management;

import com.example.trainbookingsystem.features.booking_management.BookingModel;
import com.example.trainbookingsystem.features.booking_management.BookingRepo;
import com.example.trainbookingsystem.features.payment_management.PaymentModel;
import com.example.trainbookingsystem.features.payment_management.PaymentRepo;
import com.example.trainbookingsystem.features.reservation_management.ReservationModel;
import com.example.trainbookingsystem.features.reservation_management.ReservationRepo;
import com.example.trainbookingsystem.patterns.observer.ScheduleObservable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ScheduleService {

    @Autowired
    private ScheduleRepo scheduleRepo;

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private ReservationRepo reservationRepo;

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private ScheduleObservable scheduleObservable;

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

        // NOTIFY OBSERVERS
        scheduleObservable.notifyScheduleCreate(savedSchedule);

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

                    ScheduleModel updatedSchedule = scheduleRepo.save(schedule);

                    // NOTIFY OBSERVERS
                    scheduleObservable.notifyScheduleUpdate(updatedSchedule);

                    return convertToResponseDTO(updatedSchedule);
                });
    }

    @Transactional
    public boolean deleteSchedule(Long id, boolean hardDelete) {
        Optional<ScheduleModel> schedule = scheduleRepo.findByIdAndDeleteStatus(id, false);
        if (schedule.isPresent()) {
            ScheduleModel scheduleModel = schedule.get();
            boolean result;

            if (hardDelete) {
                result = hardDeleteSchedule(scheduleModel);
            } else {
                result = softDeleteSchedule(scheduleModel);
            }

            // NOTIFY OBSERVERS
            if (result) {
                String deleteType = hardDelete ? "hard" : "soft";
                scheduleObservable.notifyScheduleDelete(scheduleModel, deleteType);
            }

            return result;
        }
        return false;
    }

    @Transactional
    protected boolean softDeleteSchedule(ScheduleModel scheduleModel) {
        try {
            List<BookingModel> relatedBookings = bookingRepo.findByScheduleIdAndDeleteStatusFalse(scheduleModel.getId());
            for (BookingModel booking : relatedBookings) {
                softDeleteBookingAndRelatedEntities(booking);
            }

            scheduleModel.setDeleteStatus(true);
            scheduleRepo.save(scheduleModel);
            return true;
        } catch (Exception e) {
            throw new ScheduleException("Failed to soft delete schedule: " + e.getMessage());
        }
    }

    @Transactional
    protected boolean hardDeleteSchedule(ScheduleModel scheduleModel) {
        try {
            List<BookingModel> relatedBookings = bookingRepo.findByScheduleId(scheduleModel.getId());
            for (BookingModel booking : relatedBookings) {
                hardDeleteBookingAndRelatedEntities(booking);
            }

            scheduleRepo.delete(scheduleModel);
            return true;
        } catch (Exception e) {
            throw new ScheduleException("Failed to hard delete schedule: " + e.getMessage());
        }
    }

    @Transactional
    protected void softDeleteBookingAndRelatedEntities(BookingModel booking) {
        try {
            Optional<PaymentModel> payment = paymentRepo.findByBookingIdAndDeleteStatus(booking.getId(), false);
            if (payment.isPresent()) {
                PaymentModel paymentModel = payment.get();
                paymentModel.setDeleteStatus(true);
                paymentRepo.save(paymentModel);
            }

            Optional<ReservationModel> reservation = reservationRepo.findByBookingIdAndDeleteStatus(booking.getId(), false);
            if (reservation.isPresent()) {
                ReservationModel reservationModel = reservation.get();
                reservationModel.setDeleteStatus(true);
                reservationRepo.save(reservationModel);
            }

            restoreSeatsToSchedule(booking);

            booking.setDeleteStatus(true);
            bookingRepo.save(booking);
        } catch (Exception e) {
            throw new ScheduleException("Failed to soft delete related booking: " + e.getMessage());
        }
    }

    @Transactional
    protected void hardDeleteBookingAndRelatedEntities(BookingModel booking) {
        try {
            Optional<PaymentModel> payment = paymentRepo.findByBookingId(booking.getId());
            payment.ifPresent(paymentRepo::delete);

            Optional<ReservationModel> reservation = reservationRepo.findByBookingId(booking.getId());
            reservation.ifPresent(reservationRepo::delete);

            restoreSeatsToSchedule(booking);

            bookingRepo.delete(booking);
        } catch (Exception e) {
            throw new ScheduleException("Failed to hard delete related booking: " + e.getMessage());
        }
    }

    private void restoreSeatsToSchedule(BookingModel booking) {
        ScheduleModel schedule = booking.getSchedule();
        String classType = booking.getClassType();
        Integer seatCount = booking.getSeatCount();

        switch (classType.toUpperCase()) {
            case "ECONOMY":
                schedule.setAvailableEconomySeats(schedule.getAvailableEconomySeats() + seatCount);
                break;
            case "BUSINESS":
                schedule.setAvailableBusinessSeats(schedule.getAvailableBusinessSeats() + seatCount);
                break;
            case "FIRST_CLASS":
                schedule.setAvailableFirstClassSeats(schedule.getAvailableFirstClassSeats() + seatCount);
                break;
            case "LUXURY":
                schedule.setAvailableLuxurySeats(schedule.getAvailableLuxurySeats() + seatCount);
                break;
        }
        scheduleRepo.save(schedule);
    }

    public boolean deleteSchedule(Long id) {
        return deleteSchedule(id, false);
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

        responseDTO.setAvailableEconomySeats(schedule.getAvailableEconomySeats());
        responseDTO.setAvailableBusinessSeats(schedule.getAvailableBusinessSeats());
        responseDTO.setAvailableFirstClassSeats(schedule.getAvailableFirstClassSeats());
        responseDTO.setAvailableLuxurySeats(schedule.getAvailableLuxurySeats());

        responseDTO.setDeleteStatus(schedule.getDeleteStatus());
        responseDTO.setCreatedAt(schedule.getCreatedAt());
        responseDTO.setUpdatedAt(schedule.getUpdatedAt());
        return responseDTO;
    }

    public static class ScheduleException extends RuntimeException {
        public ScheduleException(String message) {
            super(message);
        }
    }
}