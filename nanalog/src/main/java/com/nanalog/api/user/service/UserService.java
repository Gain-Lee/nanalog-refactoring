package com.nanalog.api.user.service;

import com.nanalog.api.user.model.entity.User;
import com.nanalog.api.user.model.entity.UserDeleteQueue;
import com.nanalog.api.user.model.request.UserCreateRequest;
import com.nanalog.api.user.model.request.UserDeleteRequest;
import com.nanalog.api.user.model.request.UserUpdateRequest;
import com.nanalog.api.user.model.response.UserResponse;

/**
 * Created by 1002731 on 2016. 7. 17..
 * Email : eenan@sk.com
 */
public interface UserService {

    Integer createUser(UserCreateRequest userCreateRequest);

    Integer updateUser(UserUpdateRequest userUpdateRequest);

    Integer deleteUser(UserDeleteRequest userDeleteRequest);

    UserResponse readUser(String uid);

    Integer updateUserActiveState(String uid);

    UserDeleteQueue readUserActiveState(String uid);

    Integer deleteUserDeleteQueue(String uid);

    User login(String uid, String password);
}
