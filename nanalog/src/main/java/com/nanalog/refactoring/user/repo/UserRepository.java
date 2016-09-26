package com.nanalog.refactoring.user.repo;

import com.nanalog.refactoring.user.repo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
