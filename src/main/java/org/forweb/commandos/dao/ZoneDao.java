package org.forweb.commandos.dao;

import org.forweb.commandos.entity.zone.Zone;
import org.forweb.database.AbstractDao;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;

@Repository
public interface ZoneDao extends AbstractDao<Zone> {
    @Modifying
    @Transactional
    @Query("delete from Zone zone where zone.map = :map")
    void deleteAllForMap(@Param("map") Integer map);

    @Query("select z from Zone z where z.map in :ids")
    List<Zone> findAllZonesForMaps(@Param("ids") List<Integer> ids);


    @Modifying
    @Transactional
    @Query("update Zone z " +
            "set z.type = 'wall', z.tile = null, z.shiftX = null, z.shiftY = null " +
            "where z.tile = :tileId")
    void replaceToWall(@Param("tileId") Integer id);
}
