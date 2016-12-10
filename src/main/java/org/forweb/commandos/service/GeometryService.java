package org.forweb.commandos.service;

import org.forweb.commandos.entity.zone.AbstractZone;
import org.forweb.geometry.services.BoundsService;
import org.forweb.geometry.services.LineService;
import org.forweb.geometry.services.PointService;
import org.forweb.geometry.services.Utils;
import org.forweb.geometry.shapes.*;

public class GeometryService {

    public static Point[] lineBoundsIntersections(Line line, Rectangle zoneBounds) {
        Point[] angles = zoneBounds.getPoints();
        Point[] p1 = LineService.lineLineIntersections(line, new Line(angles[0], angles[1]));
        Point[] p2 = LineService.lineLineIntersections(line, new Line(angles[1], angles[2]));
        Point[] p3 = LineService.lineLineIntersections(line, new Line(angles[2], angles[3]));
        Point[] p4 = LineService.lineLineIntersections(line, new Line(angles[3], angles[0]));
        return clearResult(concat(8, p1, p2, p3, p4));
    }

    public static Point[] concat(int size, Point[] ... points) {
        Point[] out = new Point[size];
        int index = 0;
        for(Point[] p : points) {
            if(p == null)continue;
            for(Point pp : p) {
                if(pp != null) {
                    out[index] = pp;
                    index++;
                }
            }
        }
        return out;
    }

    static Point[] clearResult(Point[] input) {
        int nullCount = 0;
        Point[] out = input;
        int index = input.length;

        int var4;
        Point point;
        int i;
        Point point1;
        for(var4 = 0; var4 < index; ++var4) {
            point = out[var4];
            if(point != null) {
                for(i = 0; i < input.length; ++i) {
                    point1 = input[i];
                    if(point1 != null && point != point1 && point.equals(point1)) {
                        input[i] = null;
                    }
                }
            }
        }

        out = input;
        index = input.length;

        for(var4 = 0; var4 < index; ++var4) {
            point = out[var4];
            if(point == null) {
                ++nullCount;
            }
        }

        out = new Point[input.length - nullCount];
        index = 0;
        Point[] var8 = input;
        int var9 = input.length;

        for(i = 0; i < var9; ++i) {
            point1 = var8[i];
            if(point1 != null) {
                out[index] = point1;
                ++index;
            }
        }

        return out;
    }


    public static Point[] circleIntersectRectangle(Circle playerCircle, Rectangle rectangle) {

        Point[] points = rectangle.getPoints();
        Point[] point = LineService.lineIntersectCircle(new Line(points[0], points[1]), playerCircle);
        if(point.equals(PointService.EMPTY)) {
            point = LineService.lineIntersectCircle(new Line(points[1], points[2]), playerCircle);
            if(point.equals(PointService.EMPTY)) {
                point = LineService.lineIntersectCircle(new Line(points[2], points[3]), playerCircle);
                if(point.equals(PointService.EMPTY)) {
                    point = LineService.lineIntersectCircle(new Line(points[3], points[0]), playerCircle);
                }
            }
        }
        return point;
    }

    public static Point[] boundsRectangleIntersection(Rectangle rectangle, Bounds bounds) {
        if(!BoundsService.isBoundsIntersectBounds(rectangle.getBounds(), bounds)) {
            return PointService.EMPTY;
        } else {
            Point[] rectanglePoints = rectangle.getPoints();
            Point[] out = LineService.lineBoundsIntersections(new Line(rectanglePoints[0], rectanglePoints[1]), bounds);
            if(out != PointService.EMPTY) {
                return out;
            }
            out = LineService.lineBoundsIntersections(new Line(rectanglePoints[1], rectanglePoints[2]), bounds);
            if(out != PointService.EMPTY) {
                return out;
            }
            out = LineService.lineBoundsIntersections(new Line(rectanglePoints[2], rectanglePoints[3]), bounds);
            if(out != PointService.EMPTY) {
                return out;
            }
            return LineService.lineBoundsIntersections(new Line(rectanglePoints[3], rectanglePoints[0]), bounds);
        }
    }

    public static boolean rectangleInsideBounds(Rectangle rectangle, Bounds bounds) {
        Point[] points = rectangle.getPoints();
        double y1 = bounds.getY() + bounds.getHeight();
        double x1 = bounds.getX() + bounds.getWidth();
        for(Point point : points) {
            if(point.getX() < bounds.getX() || point.getY() < bounds.getY() || point.getX() > x1 || point.getY() > y1) {
                return false;
            }
        }
        return true;
    }
}
