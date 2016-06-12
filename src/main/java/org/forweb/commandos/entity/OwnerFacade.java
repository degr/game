package org.forweb.commandos.entity;

/**
 * Created by degr on 8.6.16.
 */
public class OwnerFacade implements WebSocketResponse {

    Person owner;
    public OwnerFacade(Person owner) {
        this.owner = owner;
    }
    public String doResponse() {
        return owner.getId() + ":" + owner.getLife() + ":" + owner.getArmor() + ":" + owner.getWeapon().getName();
    }
}
