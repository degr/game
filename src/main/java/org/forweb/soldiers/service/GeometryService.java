package org.forweb.soldiers.service;

import org.forweb.soldiers.controller.PersonWebSocketEndpoint;
import org.forweb.soldiers.entity.zone.AbstractZone;
import org.forweb.soldiers.utils.shapes.Line;
import org.forweb.soldiers.utils.shapes.Point;

import java.awt.Rectangle;

public class GeometryService {

    static Rectangle getRectangle(AbstractZone zone) {
        return new Rectangle(zone.getX(), zone.getY(), zone.getWidth(), zone.getHeight());
    }


    public static Point[] getIntersectionPoint(Line projectileTrace, Rectangle rectangle) {

        Point[] p = new Point[4];
        // Top line
        p[0] = GeometryService.getIntersectionPoint(
                projectileTrace,
                new Line(
                        new Point(rectangle.getX(), rectangle.getY()),
                        new Point(rectangle.getX() + rectangle.getWidth(), rectangle.getY())
                )
        );
        // Right side
        p[1] = GeometryService.getIntersectionPoint(
                projectileTrace,
                new Line(
                        new Point(rectangle.getX() + rectangle.getWidth(), rectangle.getY()),
                        new Point(rectangle.getX() + rectangle.getWidth(), rectangle.getY() + rectangle.getHeight())
                )
        );
        // Bottom line
        p[2] = GeometryService.getIntersectionPoint(
                projectileTrace,
                new Line(
                        new Point(rectangle.getX(), rectangle.getY() + rectangle.getHeight()),
                        new Point(rectangle.getX() + rectangle.getWidth(), rectangle.getY() + rectangle.getHeight())
                )
        );
        // Left side...
        p[3] = GeometryService.getIntersectionPoint(
                projectileTrace,
                new Line(
                        new Point(rectangle.getX(), rectangle.getY()),
                        new Point(rectangle.getX(), rectangle.getY() + rectangle.getHeight())
                )
        );
        return p;
    }

    private static Point getIntersectionPoint(Line line1, Line line2) {
        Point a1 = line1.getA();
        Point b1 = line1.getB();
        Point a2 = line2.getA();
        Point b2 = line2.getB();

        double x1 = a1.getX();
        double y1 = a1.getY();
        double x2 = b1.getX();
        double y2 = b1.getY();
        double x3 = a2.getX();
        double y3 = a2.getY();
        double x4 = b2.getX();
        double y4 = b2.getY();

        double v1 = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
        double v2 = (x4 - x3) * (y2 - y3) - (y4 - y3) * (x2 - x3);
        double v3 = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
        double v4 = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1);
        if (!((v1 * v2 <= 0) && (v3 * v4 <= 0))) {
            return null;
        }

        Point p = null;
        double d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (d != 0) {
            double xi = ((x3 - x4) * (x1 * y2 - y1 * x2) - (x1 - x2) * (x3 * y4 - y3 * x4)) / d;
            double yi = ((y3 - y4) * (x1 * y2 - y1 * x2) - (y1 - y2) * (x3 * y4 - y3 * x4)) / d;

            p = new Point(xi, yi);
        }
        return p;
    }


    public static Point[] getCircleLineIntersectionPoint(Point linePointA, Point linePointB, Point personCenter) {
        double baX = linePointB.getX() - linePointA.getX();
        double baY = linePointB.getY() - linePointA.getY();
        double caX = personCenter.getX() - linePointA.getX();
        double caY = personCenter.getY() - linePointA.getY();

        double a = baX * baX + baY * baY;
        double bBy2 = baX * caX + baY * caY;
        double c = caX * caX + caY * caY - (double) PersonWebSocketEndpoint.PERSON_RADIUS * (double) PersonWebSocketEndpoint.PERSON_RADIUS;

        double pBy2 = bBy2 / a;
        double q = c / a;

        double disc = pBy2 * pBy2 - q;
        if (disc < 0) {
            return null;
        }
        double tmpSqrt = Math.sqrt(disc);
        double abScalingFactor1 = -pBy2 + tmpSqrt;
        double abScalingFactor2 = -pBy2 - tmpSqrt;

        Point p1 = new Point(linePointA.getX() - baX * abScalingFactor1, linePointA.getY()
                - baY * abScalingFactor1);
        if (disc == 0) {
            return new Point[]{p1};
        }
        Point p2 = new Point(linePointA.getX() - baX * abScalingFactor2, linePointA.getY()
                - baY * abScalingFactor2);
        return new Point[]{p1, p2};
    }
}
