package com.example.trainbookingsystem.features.booking_management;

import com.example.trainbookingsystem.features.passenger_management.PassengerModel;
import com.example.trainbookingsystem.features.passenger_management.PassengerRepo;
import com.example.trainbookingsystem.features.schedule_management.ScheduleModel;
import com.example.trainbookingsystem.features.schedule_management.ScheduleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private PassengerRepo passengerRepo;

    @Autowired
    private ScheduleRepo scheduleRepo;

    public List<BookingDTOS.BookingResponseDTO> getAllBookings() {
        return bookingRepo.findByDeleteStatusOrderByCreatedAtDesc(false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<BookingDTOS.BookingResponseDTO> getBookingById(Long id) {
        return bookingRepo.findByIdAndDeleteStatus(id, false)
                .map(this::convertToResponseDTO);
    }

    public List<BookingDTOS.BookingResponseDTO> getBookingsByPassenger(Long passengerId) {
        return bookingRepo.findByPassengerIdAndDeleteStatusOrderByCreatedAtDesc(passengerId, false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTOS.BookingResponseDTO> getBookingsBySchedule(Long scheduleId) {
        return bookingRepo.findByScheduleIdAndDeleteStatus(scheduleId, false).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public BookingDTOS.BookingResponseDTO createBooking(BookingDTOS.CreateBookingDTO createDTO) {
        Optional<PassengerModel> passenger = passengerRepo.findByIdAndDeleteStatus(createDTO.getPassengerId(), false);
        if (!passenger.isPresent()) {
            throw new RuntimeException("Passenger not found");
        }

        Optional<ScheduleModel> schedule = scheduleRepo.findByIdAndDeleteStatus(createDTO.getScheduleId(), false);
        if (!schedule.isPresent()) {
            throw new RuntimeException("Schedule not found");
        }

        BookingModel booking = new BookingModel(
                passenger.get(),
                schedule.get(),
                createDTO.getSeatCount(),
                createDTO.getAdditionalNotes()
        );

        BookingModel savedBooking = bookingRepo.save(booking);
        return convertToResponseDTO(savedBooking);
    }

    public Optional<BookingDTOS.BookingResponseDTO> updateBooking(Long id, BookingDTOS.UpdateBookingDTO updateDTO) {
        return bookingRepo.findByIdAndDeleteStatus(id, false)
                .map(booking -> {
                    if (updateDTO.getAdditionalNotes() != null) {
                        booking.setAdditionalNotes(updateDTO.getAdditionalNotes());
                    }
                    return convertToResponseDTO(bookingRepo.save(booking));
                });
    }

    public boolean deleteBooking(Long id) {
        Optional<BookingModel> booking = bookingRepo.findByIdAndDeleteStatus(id, false);
        if (booking.isPresent()) {
            BookingModel bookingModel = booking.get();
            bookingModel.setDeleteStatus(true);
            bookingRepo.save(bookingModel);
            return true;
        }
        return false;
    }

    private BookingDTOS.BookingResponseDTO convertToResponseDTO(BookingModel booking) {
        BookingDTOS.BookingResponseDTO responseDTO = new BookingDTOS.BookingResponseDTO();
        responseDTO.setId(booking.getId());
        responseDTO.setAdditionalNotes(booking.getAdditionalNotes());
        responseDTO.setDeleteStatus(booking.getDeleteStatus());
        responseDTO.setCreatedAt(booking.getCreatedAt());
        responseDTO.setUpdatedAt(booking.getUpdatedAt());

        BookingDTOS.PassengerInfo passengerInfo = new BookingDTOS.PassengerInfo();
        passengerInfo.setId(booking.getPassenger().getId());
        passengerInfo.setFirstName(booking.getPassenger().getFirstName());
        passengerInfo.setLastName(booking.getPassenger().getLastName());
        passengerInfo.setEmail(booking.getPassenger().getEmail());
        passengerInfo.setContactNumber(booking.getPassenger().getContactNumber());
        responseDTO.setPassenger(passengerInfo);

        BookingDTOS.ScheduleInfo scheduleInfo = new BookingDTOS.ScheduleInfo();
        scheduleInfo.setId(booking.getSchedule().getId());
        scheduleInfo.setFromCity(booking.getSchedule().getFromCity());
        scheduleInfo.setToCity(booking.getSchedule().getToCity());
        scheduleInfo.setDate(booking.getSchedule().getDate());
        scheduleInfo.setTime(booking.getSchedule().getTime());
        scheduleInfo.setTrainType(booking.getSchedule().getTrainType());
        scheduleInfo.setTrainName(booking.getSchedule().getTrainName());
        responseDTO.setSchedule(scheduleInfo);

        return responseDTO;
    }
}