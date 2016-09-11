package org.forweb.commandos.dao;

import org.forweb.commandos.entity.GameProfile;
import org.forweb.database.AbstractDao;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameProfileDao extends AbstractDao<GameProfile> {

    List<GameProfile> findByUser(Integer userId);

    @Query("select p from GameProfile p where p.user = :userId and p.arena = true")
    GameProfile findArenaProfile(@Param("userId") Integer userId);

}
