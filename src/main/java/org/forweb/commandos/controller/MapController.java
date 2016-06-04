package org.forweb.commandos.controller;

import org.forweb.commandos.entity.GameMap;
import org.forweb.commandos.entity.Map;
import org.forweb.commandos.service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.List;

@RestController
@RequestMapping("/map")
public class MapController {


    @Autowired
    private MapService mapService;

    @RequestMapping(value="/save", produces = "text/plain")
    public String saveMap(@RequestBody GameMap map) throws NoSuchAlgorithmException {
        return mapService.saveMap(map);
    }

    @RequestMapping("/list/{page}/{size}")
    public List<GameMap> loadMaps(@RequestParam(required = false) String mapName, @PathVariable Integer page, @PathVariable Integer size) {
        return mapService.loadMaps(mapName, page, size);
    }

    @RequestMapping("/name-empty")
    public Boolean nameEmpty(@RequestBody String name) {
        return mapService.nameEmpty(name);
    }

    @RequestMapping("/load-map-by-hash")
    public GameMap loadMapByHash(@RequestParam("hash") String mapHash) {
        return mapService.loadMapByHash(mapHash);
    }
}