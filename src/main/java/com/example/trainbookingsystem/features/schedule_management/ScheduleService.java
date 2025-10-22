package com.example.trainbookingsystem.features.schedule_management;

import com.example.trainbookingsystem.features.booking_management.BookingModel;
import com.example.trainbookingsystem.features.booking_management.BookingRepo;
import com.example.trainbookingsystem.features.payment_management.PaymentModel;
import com.example.trainbookingsystem.features.payment_management.PaymentRepo;
import com.example.trainbookingsystem.features.reservation_management.ReservationModel;
import com.example.trainbookingsystem.features.reservation_management.ReservationRepo;
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

    @Transactional
    public boolean deleteSchedule(Long id, boolean hardDelete) {
        Optional<ScheduleModel> schedule = scheduleRepo.findByIdAndDeleteStatus(id, false);
        if (schedule.isPresent()) {
            ScheduleModel scheduleModel = schedule.get();

            if (hardDelete) {
                // HARD DELETE - Remove completely from database
                return hardDeleteSchedule(scheduleModel);
            } else {
                // SOFT DELETE - Keep data with delete status
                return softDeleteSchedule(scheduleModel);
            }
        }
        return false;
    }

    @Transactional
    protected boolean softDeleteSchedule(ScheduleModel scheduleModel) {
        try {
            // 1. SOFT DELETE ALL RELATED BOOKINGS AND THEIR DEPENDENCIES
            List<BookingModel> relatedBookings = bookingRepo.findByScheduleIdAndDeleteStatusFalse(scheduleModel.getId());
            for (BookingModel booking : relatedBookings) {
                softDeleteBookingAndRelatedEntities(booking);
            }

            // 2. SOFT DELETE THE SCHEDULE
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
            // 1. HARD DELETE ALL RELATED BOOKINGS AND THEIR DEPENDENCIES
            List<BookingModel> relatedBookings = bookingRepo.findByScheduleId(scheduleModel.getId());
            for (BookingModel booking : relatedBookings) {
                hardDeleteBookingAndRelatedEntities(booking);
            }

            // 2. HARD DELETE THE SCHEDULE
            scheduleRepo.delete(scheduleModel);

            return true;
        } catch (Exception e) {
            throw new ScheduleException("Failed to hard delete schedule: " + e.getMessage());
        }
    }

    @Transactional
    protected void softDeleteBookingAndRelatedEntities(BookingModel booking) {
        try {
            // 1. SOFT DELETE RELATED PAYMENTS
            Optional<PaymentModel> payment = paymentRepo.findByBookingIdAndDeleteStatus(booking.getId(), false);
            if (payment.isPresent()) {
                PaymentModel paymentModel = payment.get();
                paymentModel.setDeleteStatus(true);
                paymentRepo.save(paymentModel);
            }

            // 2. SOFT DELETE RELATED RESERVATIONS
            Optional<ReservationModel> reservation = reservationRepo.findByBookingIdAndDeleteStatus(booking.getId(), false);
            if (reservation.isPresent()) {
                ReservationModel reservationModel = reservation.get();
                reservationModel.setDeleteStatus(true);
                reservationRepo.save(reservationModel);
            }

            // 3. RESTORE SEATS TO SCHEDULE
            restoreSeatsToSchedule(booking);

            // 4. SOFT DELETE THE BOOKING
            booking.setDeleteStatus(true);
            bookingRepo.save(booking);
        } catch (Exception e) {
            throw new ScheduleException("Failed to soft delete related booking: " + e.getMessage());
        }
    }

    @Transactional
    protected void hardDeleteBookingAndRelatedEntities(BookingModel booking) {
        try {
            // 1. HARD DELETE RELATED PAYMENTS
            Optional<PaymentModel> payment = paymentRepo.findByBookingId(booking.getId());
            payment.ifPresent(paymentRepo::delete);

            // 2. HARD DELETE RELATED RESERVATIONS
            Optional<ReservationModel> reservation = reservationRepo.findByBookingId(booking.getId());
            reservation.ifPresent(reservationRepo::delete);

            // 3. RESTORE SEATS TO SCHEDULE
            restoreSeatsToSchedule(booking);

            // 4. HARD DELETE THE BOOKING
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

    // Custom Exception Classes
    public static class ScheduleException extends RuntimeException {
        public ScheduleException(String message) {
            super(message);
        }
    }
}