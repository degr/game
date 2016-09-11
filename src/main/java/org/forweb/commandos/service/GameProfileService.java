package org.forweb.commandos.service;

import org.forweb.commandos.dao.GameProfileDao;
import org.forweb.commandos.entity.GameProfile;
import org.forweb.database.AbstractService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameProfileService extends AbstractService<GameProfile, GameProfileDao> {

    public List<GameProfile> findByUser(Integer userId) {
        return dao.findByUser(userId);
    }

    public GameProfile findArenaProfile(Integer userId) {
        return dao.findArenaProfile(userId);
    }

    public GameProfile createProfile(Integer userId, String username, Boolean isArena) {
        int at = username.indexOf("@");
        if(at > -1) {
            username = username.substring(0, at);
        }
        GameProfile gameProfile = new GameProfile();
        gameProfile.setUsername(username);
        gameProfile.setUser(userId);
        gameProfile.setArena(isArena);
        return dao.save(gameProfile);
    }
}
