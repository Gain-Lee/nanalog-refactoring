package com.nanalog.api.diary.repository;

import com.nanalog.api.diary.model.entity.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by choijinjoo on 2016. 7. 27..
 */
public interface ComponentRepository extends JpaRepository<Component, Long> {
    @Query("select c " +
            "from Component c " +
            "where c.componentId = ?1 ")
    Component findByComponentId(Long componentId);


    @Query("select c from Component c where c.pageId=?1")
    ArrayList<Component> getComponentsByPageId(Long pageId);

    @Query("delete from Component c " +
            "where c.pageId = ?1")
    void deleteComponentBypageId(Long pageId);


    @Query("select c from Component c where c.componentId=?1")
    Component getComponentByComponentId(Long componentId);

    @Query("select c from Component c where c.pageId=?1")
    List<Component> findByPageId(Long pageId);
}
