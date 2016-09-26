package com.nanalog.refactoring.diary.repo;

import com.nanalog.refactoring.diary.repo.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by 1002731 on 2016. 9. 27..
 * Email : eenan@sk.com
 */
public interface DiaryRepository extends JpaRepository<Diary, Long> {
}
