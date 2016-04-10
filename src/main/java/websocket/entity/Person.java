package websocket.entity;

public class Person {

    private final int id;
    private Direction direction;
    private Location location;
    private final String hexColor;
    
    public Person(int id, String hexColor) {
        this.id = id;
        this.hexColor = hexColor;
    }

    public int getId() {
        return id;
    }
    
    public Direction getDirection() {
        return direction;
    }

    public void setDirection(Direction direction) {
        this.direction = direction;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String getHexColor() {
        return hexColor;
    }
}