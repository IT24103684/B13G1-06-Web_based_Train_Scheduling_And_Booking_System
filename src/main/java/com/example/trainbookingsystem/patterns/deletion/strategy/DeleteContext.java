package com.example.trainbookingsystem.patterns.deletion.strategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class DeleteContext {

    private final Map<Boolean, DeleteStrategy> strategies;

    @Autowired
    public DeleteContext(SoftDeleteStrategy softDeleteStrategy,
                         HardDeleteStrategy hardDeleteStrategy) {
        this.strategies = Map.of(
                true, softDeleteStrategy,   // keepData = true -> Soft Delete
                false, hardDeleteStrategy   // keepData = false -> Hard Delete
        );
    }

    public DeleteStrategy getStrategy(boolean keepData) {
        return strategies.get(keepData);
    }
}