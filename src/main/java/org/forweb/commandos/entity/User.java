package org.forweb.commandos.entity;

import org.forweb.commandos.entity.user.Authority;
import org.forweb.database.AbstractEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Entity
public class User extends AbstractEntity implements Cloneable {

    private String username;
    private String password;
    @Column(columnDefinition = "enum('USER', 'ADMIN')")
    @Enumerated(EnumType.STRING)
    private Authority authority;

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

    public void setAuthority(Authority role) {
        this.authority = role;
    }

    public Authority getAuthority() {
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
