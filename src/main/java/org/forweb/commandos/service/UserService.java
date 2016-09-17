package org.forweb.commandos.service;

import org.forweb.commandos.dao.UserDao;
import org.forweb.commandos.dto.UserDetail;
import org.forweb.commandos.entity.User;
import org.forweb.database.AbstractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService extends AbstractService<User, UserDao> implements UserDetailsService {

    @Autowired
    GameProfileService gameProfileService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = dao.loadUserByUsername(username);
        return user == null ? null : new UserDetail(user);
    }

    @Override
    public void delete(Integer id) {
        gameProfileService.delete(gameProfileService.findProfiles(id));
        super.delete(id);
    }

    @Override
    public void delete(User entity) {
        gameProfileService.delete(gameProfileService.findProfiles(entity.getId()));
        super.delete(entity);
    }

    @Override
    public void delete(Iterable<User> list) {
        for (User user : list) {
            delete(user);
        }
    }
}
