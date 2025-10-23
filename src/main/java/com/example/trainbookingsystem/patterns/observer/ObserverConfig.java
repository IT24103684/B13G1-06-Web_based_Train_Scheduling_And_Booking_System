package com.example.trainbookingsystem.patterns.observer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Configuration
public class ObserverConfig {

    @Autowired
    private ScheduleObservable scheduleObservable;

    @Autowired
    private List<ScheduleObserver> scheduleObservers;

    @PostConstruct
    public void registerObservers() {
        for (ScheduleObserver observer : scheduleObservers) {
            scheduleObservable.registerObserver(observer);
            System.out.println("✅ Registered observer: " + observer.getClass().getSimpleName());
        }
    }
}