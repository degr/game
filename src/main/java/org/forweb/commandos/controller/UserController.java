package org.forweb.commandos.controller;

import org.forweb.commandos.dto.CreateUserDto;
import org.forweb.commandos.entity.Authority;
import org.forweb.commandos.entity.User;
import org.forweb.commandos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping("/create")
    public CreateUserDto createUser(@RequestBody User user) {
        CreateUserDto out = new CreateUserDto();
        if(user.getUsername() == null) {
            out.setSuccess(false);
            return out;
        }
        out.setSuccess(null == userService.loadUserByUsername(user.getUsername()));
        if(!out.getSuccess()) {
            return out;
        }

        User userToSave = new User();
        userToSave.setUsername(user.getUsername());
        userToSave.setPassword(user.getPassword());
        userToSave.setAuthority(Authority.USER.toString());
        userToSave = userService.save(userToSave);
        out.setUserId(userToSave.getId());
        return out;
    }

    @RequestMapping("/login")
    public Integer login(@RequestBody User user) {
        User out = (User)userService.loadUserByUsername(user.getUsername());
        if(out == null) {
            return null;
        }
        return out.getId();
    }

    @RequestMapping("/is-exist")
    public Boolean isExist(@RequestBody User user) {
        User check = (User)userService.loadUserByUsername(user.getUsername());
        return check == null;
    }


}
