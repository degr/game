package websocket.response;

public class Leave {

    private final Integer id;
    private final String type = "leave";
    public Leave(int id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public String getType() {
        return type;
    }
}
