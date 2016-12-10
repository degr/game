package org.forweb.commandos.controller.admin;

import org.forweb.commandos.entity.zone.walls.Tile;
import org.forweb.commandos.service.TileService;
import org.forweb.commandos.service.ZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/tiles")
public class AdminTilesController {

    @Autowired
    private ZoneService zoneService;
    @Autowired
    private TileService tileService;

    @RequestMapping("/delete")
    public Boolean deleteAccount(@RequestBody Tile tile) {
        zoneService.replaceToWall(tile);
        zoneService.deleteTile(tile);
        return true;
    }


    @RequestMapping("/get-list")
    public Page<Tile> userPageable(Pageable pageable) {
        return tileService.findAll(pageable);
    }

    @RequestMapping("/update")
    public boolean updateUser(@RequestBody Tile tile) {
        if (tile.getId() != null) {
            tileService.save(tile);
            return true;
        }
        return false;
    }
}
