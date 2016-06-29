package org.forweb.commandos.service;

import org.forweb.commandos.entity.Person;
import org.springframework.stereotype.Service;

@Service
public class CmdService {
    public void onCmd(Person person, int roomId, String[] args) {
        if(args.length > 1) {
            switch (args[1]) {
                case "restart":
                    voteRestart(roomId);
                    break;
                case "maps":
                    showMaps(roomId, args);
            }
        }
    }

    private void showMaps(int roomId, String[] args) {
    }

    private void voteRestart(int roomId) {
    }
}
