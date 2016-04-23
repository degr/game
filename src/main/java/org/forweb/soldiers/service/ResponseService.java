package org.forweb.soldiers.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.forweb.soldiers.entity.Person;
import org.forweb.soldiers.entity.Room;
import org.forweb.soldiers.game.Context;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.websocket.CloseReason;
import java.io.IOException;

@Service
public class ResponseService {
    
    @Autowired
    private Context gameContext;
    
    public void sendMessage(Person person, String msg) {
        try {
            gameContext.getSession(person.getId()).getBasicRemote().sendText(msg);
        } catch (IOException ioe) {
            CloseReason cr = new CloseReason(CloseReason.CloseCodes.CLOSED_ABNORMALLY, ioe.getMessage());
            try {
                gameContext.getSession(person.getId()).close(cr);
            } catch (IOException ioe2) {
                // Ignore
            }
        }
    }

    private String prepareJson(Object object) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void broadcast(Object object, Room room) {
        String message = prepareJson(object);
        for (Person person: room.getPersons().values()) {
            try {
                sendMessage(person, message);
            } catch (IllegalStateException ise) {
                // An ISE can occur if an attempt is made to write to a
                // WebSocket connection after it has been closed. The
                // alternative to catching this exception is to synchronise
                // the writes to the clients along with the addPerson() and
                // removePerson() methods that are already synchronised.
            }
        }
    }

}
