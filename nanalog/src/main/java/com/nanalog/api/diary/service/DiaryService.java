package com.nanalog.api.diary.service;
import com.nanalog.api.diary.model.request.*;
import com.nanalog.api.diary.model.response.DiaryComponentGetResponse;
import com.nanalog.api.diary.model.response.DiaryPageGetResponse;
import com.nanalog.api.diary.model.response.DiaryPreviewResponse;

import java.util.List;

/**
 * Created by 1002731 on 2016. 8. 22..
 * Email : eenan@sk.com
 */
public interface DiaryService {

    Integer createPage(Long pageId, String userId);
    Integer createComponent(ComponentCreateRequest componentCreateRequest);
    Integer createDiary(DiaryCreateRequest diaryCreateRequest);

    DiaryPageGetResponse getDiaryPages(String uid, String date);
    DiaryComponentGetResponse getDiaryCompoents(String uid, String pageId);
    List<DiaryPreviewResponse> getDiaryPreviewList(String uid, String startDate, String endDate);

    Integer updateDiary(List<DiaryUpdateRequest> diaryUpdateRequest);
    Integer updateComponent(DiaryUpdateRequest diaryUpdateRequest);

    Integer deletePage(Long deletePageId, String userId);
    Integer deleteComponent(String userId, Long componentId);
    Integer deleteUser(String uid);
}
