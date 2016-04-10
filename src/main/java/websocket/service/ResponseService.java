package websocket.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import websocket.entity.Person;
import websocket.game.Context;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.websocket.CloseReason;
import java.io.IOException;

public class ResponseService {
    private Context gameContext = Context.getInstance();
    private static ResponseService responseService = new ResponseService();
    private ResponseService(){
        
    }
    public static ResponseService getInstance(){
        return responseService;
    }
    
    
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
