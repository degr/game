package org.forweb.commandos.entity;

import org.forweb.database.AbstractEntity;
import org.springframework.data.annotation.Transient;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.Entity;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
public class User extends AbstractEntity implements Cloneable {

    private String username;
    private String password;
    private String authority;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setAuthority(String role) {
        this.authority = role;
    }

    public String getAuthority() {
        return authority;
    }

    @Override
    public User clone() {
        try {
            User out = (User)super.clone();
            out.setPassword(null);
            return  out;
        } catch (CloneNotSupportedException e) {
            return null;
        }
    }
}
