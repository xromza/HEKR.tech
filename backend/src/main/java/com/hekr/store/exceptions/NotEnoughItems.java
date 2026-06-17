package com.hekr.store.exceptions;

import java.util.Map;

public class NotEnoughItems extends RuntimeException {
    Map<String, String> errors;
    public NotEnoughItems(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }
    public Map<String, String> getErrors() {
        return errors;
    }

}
