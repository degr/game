package org.forweb.soldiers.controller;

import org.forweb.soldiers.entity.zone.AbstractZone;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("map")
public class ZoneController {

    @RequestMapping("/get-zones/{roomId}")
    public List<AbstractZone> getZoneForRoom(@PathVariable("roomId") Integer roomId){
        List<AbstractZone> out = new ArrayList<>();

        return out;
    }
}
