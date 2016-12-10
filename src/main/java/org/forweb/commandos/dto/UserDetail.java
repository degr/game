package org.forweb.commandos.dto;

import org.forweb.commandos.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class UserDetail implements UserDetails, GrantedAuthority {
    private final User user;

    public UserDetail(User user) {
        this.user = user;
    }
    @Override
    public String getAuthority() {
        return "ROLE_" + user.getAuthority().toString();
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> out = new ArrayList<>(1);
        out.add(this);
        return out;
    }


    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public User getUser() {
        return user.clone();
    }

    public Integer getId() {
        return user.getId();
    }
}
