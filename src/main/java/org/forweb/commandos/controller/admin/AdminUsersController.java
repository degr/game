package org.forweb.commandos.controller.admin;

import org.forweb.commandos.dto.UserDetail;
import org.forweb.commandos.entity.User;
import org.forweb.commandos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/users")
public class AdminUsersController {

    @Autowired
    private UserService userService;

    @RequestMapping("/delete")
    public Boolean deleteAccount(@RequestBody User user) {
        userService.delete(user.getId());
        return true;
    }


    @RequestMapping("/get-list")
    public Page<User> userPageable(Pageable pageable) {
        return userService.findAll(pageable);
    }

    @RequestMapping("/update")
    public boolean updateUser(@RequestBody User user) {
        if (user.getId() != null) {
            UserDetail existingUser = (UserDetail) userService.loadUserByUsername(user.getUsername());
            if (existingUser != null) {
                if (!existingUser.getId().equals(user.getId())) {
                    return false;
                }
            }
            userService.save(user);
            return true;
        }
        return false;
    }
}
