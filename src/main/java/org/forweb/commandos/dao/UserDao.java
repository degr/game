package org.forweb.commandos.dao;

import org.forweb.commandos.entity.User;
import org.forweb.database.AbstractDao;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends AbstractDao<User> {

    @Query("select u from User u where u.username = :username")
    User loadUserByUsername(@Param("username") String username);
}
