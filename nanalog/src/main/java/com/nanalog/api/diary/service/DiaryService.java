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

    Integer createPage(DiaryPageCreateRequest diaryPageCreateRequest);
    Integer createComponent(ComponentCreateRequest componentCreateRequest);
    Integer createDiary(DiaryCreateRequest diaryCreateRequest);

    DiaryPageGetResponse getDiaryPages(DiaryPageGetRequest diaryPageGetRequest);
    DiaryComponentGetResponse getDiaryCompoents(DiaryComponentGetRequest diaryComponentGetRequest);
    List<DiaryPreviewResponse> getDiaryPreviewList(DiaryPreviewRequest diaryPreviewRequest);

    Integer updateDiary(List<DiaryUpdateRequest> diaryUpdateRequest);
    Integer updateComponent(DiaryUpdateRequest diaryUpdateRequest);

    Integer deletePage(DiaryPageDeleteRequest diaryPageDeleteRequest);
    Integer deleteComponent(ComponentDeleteRequest componentDeleteRequest);
    Integer deleteUser(DiaryUserDeleteRequest diaryUserDeleteRequest);
}
