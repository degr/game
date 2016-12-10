package org.forweb.commandos.dao;

import org.forweb.commandos.entity.zone.walls.Tile;
import org.forweb.database.AbstractDao;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TileDao extends AbstractDao<Tile> {
}
