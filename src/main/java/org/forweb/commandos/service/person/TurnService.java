package org.forweb.commandos.service.person;

import org.forweb.commandos.entity.Person;
import org.springframework.stereotype.Service;

@Service
public class TurnService {

    public void onPersonChangeViewAngle(Person person) {
        int selected = person.getSelectedAngle();
        int current = (int)person.getAngle();
        float speed;
        if(selected == current) {
            return;
        } else if(Math.max(selected, current) - Math.min(selected, current) < 5) {
            speed = 1f;
        } else {
            speed = 2f;
        }

        float angle;
        switch (person.getTurnDirection()) {
            case 2:
            case 1:
                angle = person.getAngle() + speed;
                break;
            case -1:
            case -2:
                angle = person.getAngle() - speed;
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
    
    public void updatePersonViewAngle(Person person, int angle) {
        float pa = person.getAngle();
        Float clockAngle = null;
        Float antiClockAngle = null;
        if(pa >= 0) {
            if(angle >= 0) {
                if(angle > pa) {
                    clockAngle = angle - pa;
                } else if (angle < pa) {
                    antiClockAngle = pa - angle;
                } else {
                    clockAngle = 180f;
                }
            } else {
                antiClockAngle = pa + (-1 * angle);
            }
        } else {
            if(angle >= 0) {
                clockAngle = angle + (-1 * pa);
            } else {
                if(angle < pa) {
                    antiClockAngle = (angle - pa) * -1;
                } else if (angle > pa) {
                    clockAngle = (pa - angle) * -1;
                } else {
                    clockAngle = 180f;
                }
            }
        }
        if(clockAngle == null) {
            clockAngle = 360 - antiClockAngle;
        } else {
            antiClockAngle = 360 - clockAngle;
        }

        int direction;
        if(clockAngle < antiClockAngle ) {
            direction = (clockAngle > 5 ? 2 : 1);
        } else if(clockAngle > antiClockAngle) {
            direction = (antiClockAngle > 5 ? -2 : -1);
        } else {
            direction = 0;
        }


        /*switch (direction) {
            case -2:
            case -1:
            case 0:
            case 1:
            case 2:*/
        person.setSelectedAngle(angle);
        person.setTurnDirection(direction);
        /*}*/
        
    }
}
