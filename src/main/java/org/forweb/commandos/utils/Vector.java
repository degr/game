package org.forweb.commandos.utils;

public class Vector {
    private double x;
    private double y;
    public Vector(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double getX(){
        return x;
    }
    public double getY(){
        return y;
    }

    public double computeAngle() {
        return Math.atan2(y, x);
    }

    public double computeAngle(Vector vector) {
        return vector.computeAngle() - computeAngle();
    }

    public double computeLength() {
        return Math.sqrt(x * x + y * y);
    }

    public boolean equals(Object o) {
        if(o == null) {
            return false;
        } else if(o instanceof Vector) {
            return ((Vector) o).getY() == getY() && ((Vector) o).getX() == getX();
        } else {
            return false;
        }
    }

    public String toString() {
        return "Vector("+getX()+";"+getY()+")";
    }
}
