package com.nanalog.api.user;

import com.nanalog.api.domain.ApiResponseBody;
import com.nanalog.api.user.model.entity.User;
import com.nanalog.api.user.model.entity.UserDeleteQueue;
import com.nanalog.api.user.model.request.UserCreateRequest;
import com.nanalog.api.user.model.request.UserDeleteRequest;
import com.nanalog.api.user.model.request.UserUpdateRequest;
import com.nanalog.api.user.model.response.UserResponse;
import com.nanalog.api.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * Created by 1002731 on 2016. 7. 17..
 * Email : eenan@sk.com
 */
@RestController
@RequestMapping("/v1/user")
public class UserController {

    @Autowired
    private UserService userService;

    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @RequestMapping(method= RequestMethod.POST)
    public ResponseEntity createUser(@Valid UserCreateRequest userCreateRequest, BindingResult bindingResult) {

        LOGGER.debug("======>>> createUser :: " + userCreateRequest.toString());

        if(bindingResult.hasErrors()) {
            return new ResponseEntity("에러가 났어요", HttpStatus.NOT_ACCEPTABLE);
        }

        int resultCode = userService.createUser(userCreateRequest);

        if(resultCode == -1){
            return new ResponseEntity("회원가입에 실패했어요", HttpStatus.UNAUTHORIZED);
        }


        return new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(method= RequestMethod.PUT)
    public ResponseEntity updateUser(@Valid UserUpdateRequest userUpdateRequest, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            return new ResponseEntity("에러 메시지", HttpStatus.NOT_ACCEPTABLE);
        }

        int resultCode = userService.updateUser(userUpdateRequest);

        if(resultCode == 0){
            // 없는 사용자인 경우
            return new ResponseEntity("에러 메시지", HttpStatus.NOT_FOUND);
        }
        else if(resultCode == -1){
            // 패스워드가 틀린 경우
            return new ResponseEntity("에러 메시지", HttpStatus.NOT_ACCEPTABLE);
        }

        return new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(method= RequestMethod.DELETE)
    public ResponseEntity deleteUser(@Valid UserDeleteRequest userDeleteRequest, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            return new ResponseEntity("에러 메시지", HttpStatus.NOT_ACCEPTABLE);
        }

        int resultCode = userService.deleteUser(userDeleteRequest);

        if(resultCode == 0){
            return new ResponseEntity("에러 메시지", HttpStatus.NOT_FOUND);
        }
        else if(resultCode == -1){
            return new ResponseEntity("에러 메시지", HttpStatus.NOT_ACCEPTABLE);
        }
        else if(resultCode == -2){
            return new ResponseEntity("에러 메시지", HttpStatus.NOT_ACCEPTABLE);
        }

        return new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(method= RequestMethod.GET)
    public ApiResponseBody<UserResponse> readUser(@RequestParam(required = true) String uid) {
        UserResponse userResponse = userService.readUser(uid);

        if(userResponse == null){
            return new ApiResponseBody<>(HttpStatus.NOT_FOUND.value(), HttpStatus.NOT_FOUND.toString());
        }

        return new ApiResponseBody<>(userResponse);
    }

    @RequestMapping(value="/active", method = RequestMethod.GET)
    public ResponseEntity updateUserActiveState(@RequestParam(required = true) String uid){

        int result = this.userService.updateUserActiveState(uid);

        if(result == -1){
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(value="/deactivation", method = RequestMethod.GET)
    public ApiResponseBody<UserDeleteQueue> readUserActiveState(@RequestParam(required = true) String uid){

        UserDeleteQueue userDeleteQueue = this.userService.readUserActiveState(uid);

        if(userDeleteQueue == null){
            return new ApiResponseBody<>(HttpStatus.NOT_FOUND.value(), HttpStatus.NOT_FOUND.toString());
        }

        return new ApiResponseBody<UserDeleteQueue>(userDeleteQueue);
    }

    @RequestMapping(value="/deactivation", method = RequestMethod.DELETE)
    public ResponseEntity deleteUserDeleteQueue(@RequestParam(required = true) String uid){
        int result = this.userService.deleteUserDeleteQueue(uid);

        if(result < 0){
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public User login(@RequestParam(required = true) String uid, String password){

        User result = this.userService.login(uid, password);

        return result;
    }
}
