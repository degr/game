package org.forweb.commandos.dto;

public class CreateUserDto {

    private Integer userId;
    private Boolean success;
    private String userName;
    private String arenaUserName;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }


    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserName() {
        return userName;
    }

    public void setArenaUserName(String arenaUserName) {
        this.arenaUserName = arenaUserName;
    }

    public String getArenaUserName() {
        return arenaUserName;
    }
}
