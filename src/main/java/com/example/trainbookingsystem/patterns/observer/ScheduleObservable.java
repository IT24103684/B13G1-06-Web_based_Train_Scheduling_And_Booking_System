package com.example.trainbookingsystem.patterns.observer;

import com.example.trainbookingsystem.features.schedule_management.ScheduleModel;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ScheduleObservable {
    private final List<ScheduleObserver> observers = new ArrayList<>();

    public void registerObserver(ScheduleObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(ScheduleObserver observer) {
        observers.remove(observer);
    }

    public void notifyScheduleDelete(ScheduleModel schedule, String deleteType) {
        for (ScheduleObserver observer : observers) {
            try {
                observer.onScheduleDelete(schedule, deleteType);
            } catch (Exception e) {
                System.err.println("Error notifying observer " + observer.getClass().getSimpleName() + ": " + e.getMessage());
            }
        }
    }

    public void notifyScheduleUpdate(ScheduleModel schedule) {
        for (ScheduleObserver observer : observers) {
            try {
                observer.onScheduleUpdate(schedule);
            } catch (Exception e) {
                System.err.println("Error notifying observer " + observer.getClass().getSimpleName() + ": " + e.getMessage());
            }
        }
    }

    public void notifyScheduleCreate(ScheduleModel schedule) {
        for (ScheduleObserver observer : observers) {
            try {
                observer.onScheduleCreate(schedule);
            } catch (Exception e) {
                System.err.println("Error notifying observer " + observer.getClass().getSimpleName() + ": " + e.getMessage());
            }
        }
    }
}