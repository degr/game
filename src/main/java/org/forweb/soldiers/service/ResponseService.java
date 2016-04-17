package org.forweb.soldiers.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.forweb.soldiers.entity.Person;
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

    public String prepareJson(Object object) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }
}
