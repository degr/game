package org.forweb.commandos.dto;

/**
 * Created by degr on 15.5.16.
 */
public class    ItemDto {
    private boolean available;
    private Integer id;

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }
}
