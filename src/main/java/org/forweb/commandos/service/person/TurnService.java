package org.forweb.commandos.service.person;

import org.forweb.commandos.entity.Person;
import org.forweb.commandos.entity.weapon.Minigun;
import org.springframework.stereotype.Service;

@Service
public class TurnService {

    public void onPersonChangeViewAngle(Person person) {
        double selected =  Math.floor(10d * person.getSelectedAngle()) / 10d;
        double current = person.getAngle();
        if(Math.abs(selected - current) < 1.01) {
            person.setAngle(selected);
            return;
        }
        float speed;
        double shift = Math.max(selected, current) - Math.min(selected, current);
        if(selected == current) {
            return;
        } else if(shift < 3) {
            speed = 1f;
        } else if(shift < 4 || person.getWeapon() instanceof Minigun){
            speed = 3f;
        } else {
            speed = 6f;
        }

        double angle;
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
    
    public void updatePersonViewAngle(Person person, float angle) {
        double pa = person.getAngle();
        Double clockAngle = null;
        Double antiClockAngle = null;
        if(pa >= 0) {
            if(angle >= 0) {
                if(angle > pa) {
                    clockAngle = angle - pa;
                } else if (angle < pa) {
                    antiClockAngle = pa - angle;
                } else {
                    clockAngle = 180d;
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
                    clockAngle = 180d;
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
        person.setSelectedAngle(angle);
        person.setTurnDirection(direction);
    }
}
