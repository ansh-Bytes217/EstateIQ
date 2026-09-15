package com.estateiq.common.exception;

public class InvalidStateTransitionException extends RuntimeException {
    public InvalidStateTransitionException(String message) {
        super(message);
    }

    public InvalidStateTransitionException(String entity, String currentStatus, String targetStatus) {
        super(String.format("Cannot transition %s from state %s to %s", entity, currentStatus, targetStatus));
    }
}
