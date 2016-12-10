package org.forweb.commandos.controller.admin;

import org.forweb.commandos.entity.Map;
import org.forweb.commandos.service.MapService;
import org.forweb.commandos.service.ZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/maps")
public class AdminMapsController {

    @Autowired
    private MapService mapService;
    @Autowired
    private ZoneService zoneService;

    @RequestMapping("/delete")
    public Boolean deleteAccount(@RequestBody Map map) {
        zoneService.deleteAllForMap(map.getId());
        mapService.delete(map.getId());
        return true;
    }


    @RequestMapping("/get-list")
    public Page<Map> userPageable(Pageable pageable) {
        return mapService.findAll(pageable);
    }

    @RequestMapping("/update")
    public boolean updateUser(@RequestBody Map map) {
        if (map.getId() != null) {
            Map existing = mapService.findMapByName(map.getTitle());
            if (existing != null && !existing.getId().equals(map.getId())) {
                return false;
            }
            mapService.save(map);
            return true;
        }
        return false;
    }
}
