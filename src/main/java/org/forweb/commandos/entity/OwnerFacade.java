package org.forweb.commandos.entity;

public class OwnerFacade implements WebSocketResponse {

    Person owner;
    public OwnerFacade(Person owner) {
        this.owner = owner;
    }
    public String doResponse() {
        return owner.getId() + ":" + owner.getLife() + ":" + owner.getArmor() + ":" + owner.getWeapon().getName();
    }
}
