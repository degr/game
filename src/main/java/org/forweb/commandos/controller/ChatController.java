package org.forweb.commandos.controller;

import org.forweb.commandos.dto.MessageDto;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {
    private List<MessageDto> messages = new ArrayList<>();

    int ids = 0;

    @RequestMapping("/put")
    public List<MessageDto> addMessage(@RequestBody MessageDto message) {
        message.setId(ids++);
        message.setTimestamp((new Date()).getTime());
        messages.add(message);
        if (messages.size() > 50) {
            messages.remove(0);
        }
        return getInternalMessages();
    }

    @RequestMapping("/get")
    public List<MessageDto> getMessages() {
        return getInternalMessages();
    }

    private List<MessageDto> getInternalMessages() {
        long timestamp = new Date().getTime();
        for(int i = messages.size() - 1; i >= 0; i--) {
            MessageDto message = messages.get(i);
            if(timestamp - (message.getTimestamp() + 1000 * 60 * 60) > 0) {
                messages.remove(i);
            }
        }
        return messages;
    }
}
