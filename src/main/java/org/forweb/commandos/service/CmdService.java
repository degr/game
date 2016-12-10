package org.forweb.commandos.service;

import org.forweb.commandos.entity.*;
import org.forweb.commandos.entity.vote.ChangeMapVote;
import org.forweb.commandos.entity.vote.KickVote;
import org.forweb.commandos.entity.vote.RestartVote;
import org.forweb.commandos.game.Context;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CmdService {
    @Autowired
    Context gameContext;

    @Autowired
    MapService mapService;

    public void onCmd(Person person, int roomId, String[] args) {
        Room room = gameContext.getRoom(roomId);
        String key = args.length > 1 ? args[1] : "help";
        switch (key) {
            case "help":
            case "man":
            case "f1":
                showCmdInfo(room);
                return;
            case "info":
                showMapInfo(room);
                return;
            case "maps":
                showMaps(room, args);
                return;
        }

        if(room.getVote() != null) {
            if(args.length >= 2) {
                String arg = args[1].toLowerCase();
                switch (arg) {
                    case "1":
                    case "yes":
                    case "on":
                    case "true":
                    case "ok":
                    case "go":
                        if(room.getVote().addVote(person.getId(), true)) {
                            room.getMessages().add("0:" + person.getName() + " vote YES");
                        } else {
                            room.getMessages().add("0:" + person.getName() + " already voted");
                        }
                        break;
                    case "0":
                    case "false":
                    case "no":
                    case "cancel":
                    case "fail":
                    case "reject":
                        if(room.getVote().addVote(person.getId(), false)) {
                            room.getMessages().add("0:" + person.getName() + " vote NO");
                        } else {
                            room.getMessages().add("0:" + person.getName() + " already voted");
                        }
                        break;
                    default:
                        room.getMessages().add("0:Vote was started. Passed argument " + arg +
                                " invalid. Please type 'cmd yes' or 'cmd no' to approve or decline vote. Type 'cmd help' for more info.");
                }
            } else {
                room.getMessages().add("0:No arguments. Please type 'cmd yes', 'cmd no' or 'cmd info'.");
            }
        }else if(args.length >= 2) {
            String arg = args[1].toLowerCase();
            switch (arg) {
                case "kick":
                    voteKick(room, person, args);
                    break;
                case "restart":
                    voteRestart(room, person);
                    break;
                case "map":
                    changeMap(room, person, args);
                    break;
            }
        } else {
            room.getMessages().add("0:Something wrong. Type 'cmd help' to more info.");
        }
    }

    private void changeMap(Room room, Person person, String [] args) {
        if(args.length > 2) {
            String name = "";
            for(int i = 2; i < args.length;i++) {
                name += args[i] + " ";
            }
            name = name.trim();
            List<GameMap> map = mapService.loadMaps(name, 1, 1);
            if(map != null && map.size() > 0) {
                Vote vote = new ChangeMapVote(map.get(0));
                vote.addVote(person.getId(), true);
                room.setVote(vote);
            } else {
                room.getMessages().add("0:Unknown map: " + name);
            }
        } else {
            room.getMessages().add("0:To change map type 'cmd map [map name]'. To see maps list type 'cmd maps'.");
        }
    }

    private void showMapInfo(Room room) {
        room.getMessages().add("0:Room name: " + room.getName() + "; max players: " + room.getMaxPlayers() +
                "; now play: " + room.getTotalPlayers() + "; map name: " + room.getMap().getName() +
                "; map max players: " + room.getMap().getMaxPlayers() + "; game type: " + room.getMap().getGameType() +
                (room.getVote() != null ? "; current vote: " + room.getVote().getVoteMessage() : ""));
    }

    private void showCmdInfo(Room room) {
        room.getMessages().add("0:'cmd' command can be used for vote call. Usage: " +
                "'cmd yes', 'cmd no', 'cmd restart', 'cmd help', 'cmd info', 'cmd map', 'cmd maps'," +
                " 'cmd maps dm', 'cmd maps tdm', 'cmd maps ctf', 'cmd kick'");
    }

    private void voteKick(Room room, Person voter, String[] args) {
        if(args.length == 2) {
            if (room.getPersons().size() > 1) {
                List<String> messages = room.getMessages();
                messages.add("0:Enter 'cmd kick [person id]' to continue:");
                room.getPersons().values().stream().forEach(v -> {
                    if (v.getId() != voter.getId()) {
                        messages.add("0:'cmd kick " + v.getId() + "' to kick " + v.getName());
                    }
                });
            } else {
                room.getMessages().add("0:No candidates to kick");
            }
        } else {
            Integer id = 0;
            try {
                id = Integer.parseInt(args[2]);
            } catch (NumberFormatException ex) {
            }
            for(Person person : room.getPersons().values()) {
                if(person.getId() == id) {
                    Vote vote = new KickVote(id, person.getName());
                    room.setVote(vote);
                    vote.addVote(voter.getId(), true);
                    if(voter.getId() == id) {
                        room.getMessages().add("0:" + voter.getName() + " want kick himself");
                    }

                    room.getMessages().add(vote.getVoteMessage());
                    return;
                }
            }
            room.getMessages().add("0:Unknown person id - " + args[2] + ".");
        }
    }

    private void showMaps(Room room, String[] args) {
        Map.GameType gameType = null;
        if(args.length > 2) {
            try{
                gameType = Map.GameType.valueOf(args[2]);
            } catch (Exception e){}
        }
        List<String> names;
        if(gameType != null) {
            names = mapService.loadMapNames(gameType);
        } else {
            names = mapService.loadMapNames();
        }
        room.getMessages().add("0:" + names.stream().collect(Collectors.joining(", ")));
    }

    private void voteRestart(Room room, Person person) {
        RestartVote vote = new RestartVote(person.getName());
        room.setVote(vote);
        vote.addVote(person.getId(), true);
    }
}
