package org.forweb.commandos.service.person;

import org.forweb.commandos.entity.Person;
import org.springframework.stereotype.Service;

@Service
public class TurnService {

    public void onPersonChangeViewAngle(Person person) {
        float angle;
        switch (person.getTurnDirection()) {
            case 2:
                angle = person.getAngle() + 2f;
                break;
            case 1:
                angle = person.getAngle() + 1f;
                break;
            case -1:
                angle = person.getAngle() - 1f;
                break;
            case -2:
                angle = person.getAngle() -2;
                break;
            default:
                angle = person.getAngle();
        }
        if(angle > 360) {
            angle = 0;
        } else if (angle < 0) {
            angle = 360;
        }
        person.setAngle(angle);
    }
    
    public void updatePersonViewAngle(Person person, int direction) {
        switch (direction) {
            case -2:
            case -1:
            case 0:
            case 1:
            case 2:
                person.setTurnDirection(direction);
        }
        
    }
}
