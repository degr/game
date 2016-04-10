package websocket.response;

import websocket.entity.Person;
import websocket.entity.ammo.Projectile;

import java.util.Collection;
import java.util.List;


public class Join {
    private final String type = "join";
    private Integer id;
    private Collection<Person> data;
    private List<Projectile> projectiles;
    
    public List<Projectile> getProjectiles() {
        return projectiles;
    }

    public void setProjectiles(List<Projectile> projectiles) {
        this.projectiles = projectiles;
    }

    public Collection<Person> getData() {
        return data;
    }

    public void setData(Collection<Person> data) {
        this.data = data;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }
}
