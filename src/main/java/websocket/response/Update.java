package websocket.response;

import websocket.entity.Person;
import websocket.entity.ammo.Projectile;

import java.util.Collection;

public class Update {
    private final String type = "update";
    private Collection<Person> data;
    private Collection<Projectile> projectiles;
    
    public Update(Collection<Person> persons, Collection<Projectile> projectiles) {
        this.data = persons;
        this.projectiles = projectiles;
    }


    public String getType() {
        return type;
    }
    public Collection<Person> getData() {
        return data;
    }
    public Collection<Projectile> getProjectiles() {
        return projectiles;
    }

    public void setData(Collection<Person> data) {
        this.data = data;
    }

}
