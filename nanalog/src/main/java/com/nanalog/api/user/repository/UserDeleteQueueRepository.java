package com.nanalog.api.user.repository;

import com.nanalog.api.user.model.entity.UserDeleteQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * Created by 1002731 on 2016. 7. 18..
 * Email : eenan@sk.com
 */
public interface UserDeleteQueueRepository extends JpaRepository<UserDeleteQueue, Long> {

    @Query("select u " +
            "from UserDeleteQueue u " +
            "where u.uid = ?1 ")
    UserDeleteQueue findByUid(String uid);
}
