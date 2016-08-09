package org.forweb.geometry.shapes;

public class Rectangle {

    private Point[] points;

    public Rectangle(Bounds bounds) {
        this(bounds, 0f);
    }

    public Rectangle(Bounds bounds, Float angle) {
        points = new Point[4];
        Point[] pseudo = new Point[4];
        pseudo[0] = new Point(bounds.x, bounds.y);
        pseudo[1] = new Point(
                bounds.x + bounds.width,
                bounds.y
        );
        pseudo[2] = new Point(
                bounds.x + bounds.width,
                bounds.y + bounds.height
        );
        pseudo[3] = new Point(
                bounds.x,
                bounds.y + bounds.height
        );
        if(angle == null || angle == 0) {
            points = pseudo;
        } else {
            Point center = new Point(bounds.getX() + bounds.getWidth() / 2, bounds.getY() + bounds.getHeight() / 2);
            points[0] = translate(center, pseudo[0], angle);
            points[1] = translate(center, pseudo[1], angle);
            points[2] = translate(center, pseudo[2], angle);
            points[3] = translate(center, pseudo[3], angle);
        }
    }

    public Point[] getPoints() {
        return points;
    }
    public Point getPoint(int index) {
        return points[index];
    }

    private Point translate(Point rotationCenter, Point point, Float angle){
        double x = (Math.cos(angle) * (point.getX() - rotationCenter.getX())) -
                (Math.sin(angle) * (point.getY() - rotationCenter.getY())) +
                rotationCenter.getX();
        double y = (Math.sin(angle) * (point.getX() - rotationCenter.getX())) +
                        (Math.cos(angle) * (point.getY() - rotationCenter.getY())) +
                        rotationCenter.getY();
        return new Point(x, y);
    }

    @Override
    public String toString() {
        String points = "";
        for (Point point: getPoints()) {
            points += point.toString();
        }
        return "Rectangle(" +points+")";
    }

    @Override
    public boolean equals(Object object) {
        if(object == null || !(object instanceof Rectangle)) {
            return false;
        }
        if(object == this) {
            return true;
        }
        Rectangle rect = (Rectangle)object;
        for(int i = 0; i < 4; i++) {
            if(!getPoint(i).equals(rect.getPoint(i))) {
                return false;
            }
        }
        return true;
    }
}
