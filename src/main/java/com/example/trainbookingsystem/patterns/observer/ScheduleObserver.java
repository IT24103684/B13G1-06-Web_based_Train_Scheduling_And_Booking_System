package com.example.trainbookingsystem.patterns.observer;

import com.example.trainbookingsystem.features.schedule_management.ScheduleModel;

public interface ScheduleObserver {
    void onScheduleDelete(ScheduleModel schedule, String deleteType);
    void onScheduleUpdate(ScheduleModel schedule);
    void onScheduleCreate(ScheduleModel schedule);
}
