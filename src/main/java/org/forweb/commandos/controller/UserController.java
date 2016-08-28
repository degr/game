package org.forweb.commandos.controller;

import org.forweb.commandos.entity.User;
import org.forweb.commandos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user/")
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping("create")
    public Integer createUser(@RequestBody User user) {
        User userToSave = new User();
        userToSave.setUsername(user.getUsername());
        userToSave.setPassword(user.getPassword());
        userToSave = userService.save(userToSave);
        return userToSave.getId();
    }

    @RequestMapping("is-exist")
    public Boolean isExist(@RequestBody User user) {
        User check = (User)userService.loadUserByUsername(user.getUsername());
        return check == null;
    }


}
