package org.forweb.commandos.dto;

public class MessageDto {
    private String message;
    private Long timestamp;
    private String sender;
    private int id;

    public MessageDto() {
    }
    public MessageDto(String message, String sender, Long timestamp, int id) {
        this.message = message;
        this.sender = sender;
        this.timestamp = timestamp;
        this.id = id;
    }


    public void setId(int id) {
        this.id = id;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public String getSender() {
        return sender;
    }

    public Long getTimestamp() {
        return timestamp;
    }
}
