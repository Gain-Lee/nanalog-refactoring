package com.nanalog.refactoring.diary.repo;

import com.nanalog.refactoring.diary.repo.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
}
