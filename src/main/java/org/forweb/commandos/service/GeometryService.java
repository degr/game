package org.forweb.commandos.service;

import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.geometry.shapes.Bounds;

public class GeometryService {
    public static Bounds getRectangle(AbstractZone zone) {
        return new Bounds(zone.getX(), zone.getY(), zone.getWidth(), zone.getHeight());
    }
}
