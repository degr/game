package org.forweb.commandos.controller;

import org.forweb.commandos.dto.CreateUserDto;
import org.forweb.commandos.entity.Authority;
import org.forweb.commandos.entity.User;
import org.forweb.commandos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

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

    @RequestMapping("/is-exist")
    public Boolean isExist(@RequestBody User user) {
        User check = (User)userService.loadUserByUsername(user.getUsername());
        return check == null;
    }
}
