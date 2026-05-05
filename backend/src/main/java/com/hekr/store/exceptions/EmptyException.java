package com.hekr.store.exceptions;

public class EmptyException extends RuntimeException {
    public EmptyException(String message) {
        super(message);
    }
}