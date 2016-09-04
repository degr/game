package org.forweb.commandos.controller;

import org.forweb.commandos.dto.CreateUserDto;
import org.forweb.commandos.entity.Authority;
import org.forweb.commandos.entity.User;
import org.forweb.commandos.service.UserService;
import org.forweb.commandos.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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

    @RequestMapping("/update-username")
    public Boolean updateUsername(@RequestBody String username) {
        UserDetails userDetails = UserUtils.getUser();
        if(userDetails != null) {
            User check = (User)userService.loadUserByUsername(username);
            if(check == null) {
                User user = (User) userDetails;
                user.setUsername(username);
                userService.save(user);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    @RequestMapping("/update-password")
    public Boolean updatePasswordUsername(@RequestBody String password) {
        UserDetails userDetails = UserUtils.getUser();
        if(userDetails != null) {
            User user = (User) userDetails ;
            user.setPassword(password);
            userService.save(user);
            return true;
        } else {
            return false;
        }
    }

    @RequestMapping("/is-exist")
    public Boolean isExist(@RequestBody String username) {
        User check = (User)userService.loadUserByUsername(username);
        return check == null;
    }

    @RequestMapping("/is-logged")
    public Boolean isLogged() {
        return UserUtils.getUser() != null;
    }


}
