package org.forweb.commandos.service;

import org.forweb.commandos.dao.TileDao;
import org.forweb.commandos.entity.zone.walls.Tile;
import org.forweb.database.AbstractService;
import org.springframework.stereotype.Service;

@Service
public class TileService extends AbstractService<Tile, TileDao> {
}
