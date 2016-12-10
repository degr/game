package org.forweb.commandos.thread;

import org.forweb.commandos.entity.Room;

import java.util.Date;
import java.util.LinkedHashMap;

public class RoomShootDownThread extends Thread {
    private Room room;
    private LinkedHashMap<Integer, Room> rooms;
    private long end;

    public RoomShootDownThread(Room room, LinkedHashMap<Integer, Room> rooms) {
        end = System.currentTimeMillis() + 60 * 60 * 1000;
        this.room = room;
        this.rooms = rooms;
    }

    public void run(){
        boolean somebodyPresent = false;
        while(System.currentTimeMillis() < end) {
            if(room.getPersons().size() > 0) {
                somebodyPresent = true;
                break;
            } else {
                try {
                    Thread.sleep(30000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
        if(!somebodyPresent) {
            rooms.remove(room.getId());
        } else {
            room.setShootingDown(false);
        }
    }
}
