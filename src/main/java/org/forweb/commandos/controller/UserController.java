package org.forweb.commandos.controller;

import org.forweb.commandos.dto.AccountView;
import org.forweb.commandos.dto.UserDetail;
import org.forweb.commandos.entity.GameProfile;
import org.forweb.commandos.entity.User;
import org.forweb.commandos.entity.user.Authority;
import org.forweb.commandos.service.GameProfileService;
import org.forweb.commandos.service.UserService;
import org.forweb.commandos.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private GameProfileService gameProfileService;

    @RequestMapping("/create")
    public Boolean createUser(@RequestBody User user) {
        if (user.getUsername() == null) {
            return false;
        }
        ;
        if (null != userService.loadUserByUsername(user.getUsername())) {
            return false;
        }

        User userToSave = new User();
        userToSave.setUsername(user.getUsername());
        userToSave.setPassword(user.getPassword());
        userToSave.setAuthority(Authority.USER);
        userToSave = userService.save(userToSave);
        gameProfileService.createProfile(userToSave.getId(), userToSave.getUsername(), true);
        return true;
    }

    @RequestMapping("/update-username")
    public Boolean updateUsername(@RequestBody String username) {
        User user = UserUtils.getUser();
        if (user != null) {
            UserDetail check = (UserDetail) userService.loadUserByUsername(username);
            User userWithPass = userService.findOne(user.getId());
            if (check == null) {
                user.setUsername(username);
                user.setPassword(userWithPass.getPassword());
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
        User user = UserUtils.getUser();
        if (user != null) {
            user.setPassword(password);
            userService.save(user);
            return true;
        } else {
            return false;
        }
    }

    @RequestMapping("/is-exist")
    public Boolean isExist(@RequestBody String username) {
        UserDetail check = (UserDetail) userService.loadUserByUsername(username);
        return check == null;
    }

    @RequestMapping("/is-logged")
    public Boolean isLogged() {
        return UserUtils.getUser() != null;
    }

    @RequestMapping("/profile")
    public GameProfile saveProfile(@RequestBody GameProfile gameProfile) {
        User user = UserUtils.getUser();
        if (user == null) {
            return null;
        }
        GameProfile arenaProfile = gameProfileService.findArenaProfile(user.getId());
        gameProfile.setUser(user.getId());
        gameProfile.setArena(arenaProfile == null || arenaProfile.getId().equals(gameProfile.getId()));
        return gameProfileService.save(gameProfile);
    }

    @RequestMapping("/profile/{id}")
    public Boolean deleteProfile(@PathVariable("id") Integer id) {
        User user = UserUtils.getUser();
        if (user == null) {
            return false;
        }
        GameProfile profile = gameProfileService.findOne(id);
        if (user.getId().equals(profile.getUser())) {
            gameProfileService.delete(id);
            return true;
        } else {
            return false;
        }
    }

    @RequestMapping("/arena-profile")
    public GameProfile arenaProfile() {
        User user = UserUtils.getUser();
        if (user == null) {
            return null;
        } else {
            return gameProfileService.findArenaProfile(user.getId());
        }
    }

    @RequestMapping("/acc")
    public AccountView getAccount() {
        User user = UserUtils.getUser();
        if (user == null) {
            return null;
        } else {
            return new AccountView(user, gameProfileService.findProfiles(user.getId()));
        }
    }

    @RequestMapping("/delete")
    public Boolean deleteAccount(@RequestBody User userToDelete, HttpServletRequest request) {
        User user = UserUtils.getUser();
        if (user == null) {
            return false;
        } else {
            User userWithPassword = userService.findOne(user.getId());
            String currentPass = userWithPassword.getPassword();
            if (currentPass == null) {
                currentPass = "";
            }
            if (currentPass.equals(userToDelete.getPassword())) {
                userService.delete(user.getId());
                try {
                    request.logout();
                } catch (ServletException e) {
                }
                return true;
            } else {
                return false;
            }
        }
    }
}
