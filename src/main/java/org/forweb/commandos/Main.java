package org.forweb.commandos;

import org.forweb.commandos.utils.Vector;
import org.forweb.geometry.services.LineService;
import org.forweb.geometry.shapes.Circle;
import org.forweb.geometry.shapes.Line;
import org.forweb.geometry.shapes.Point;


public class Main {
    public static void main(String[] args) {
        Vector vector1 = new Vector(3, 2);
        Vector vector2 = new Vector(-2, -2);
        double angle2 = Math.atan2(vector2.getY(), vector2.getX());
        double angle1 = Math.atan2(vector1.getY(), vector1.getX());
        double angle = angle2 - angle1;
        System.out.println(angle);
    }

}
