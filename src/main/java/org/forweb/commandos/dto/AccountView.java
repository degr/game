package org.forweb.commandos.dto;


import org.forweb.commandos.entity.GameProfile;
import org.forweb.commandos.entity.User;

import java.util.List;

public class AccountView {
    private User user;
    private List<GameProfile> profiles;

    public AccountView(User user, List<GameProfile> profiles) {
        this.user = user;
        this.profiles = profiles;
    }

    public List<GameProfile> getProfiles() {
        return profiles;
    }

    public User getUser() {
        return user;
    }

}
