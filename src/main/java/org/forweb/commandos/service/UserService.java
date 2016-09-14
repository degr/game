package org.forweb.commandos.service;

import org.forweb.commandos.dao.UserDao;
import org.forweb.commandos.dto.UserDetail;
import org.forweb.commandos.entity.User;
import org.forweb.database.AbstractService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService extends AbstractService<User, UserDao> implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = dao.loadUserByUsername(username);
        return user == null ? null : new UserDetail(user);
    }
}
