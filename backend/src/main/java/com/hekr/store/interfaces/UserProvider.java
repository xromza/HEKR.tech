package com.hekr.store.interfaces;

import com.hekr.store.model.user.User;

public interface UserProvider {
    User getApprovedUserByLogin(String login);
    User getSystem();
}
