package com.nanalog.api.diary.model.request;

/**
 * Created by Leegain on 2016-07-27.
 */
public class DiaryPageDeleteRequest {
    private Long deletePageId;
    private String userId;

    public Long getDeletePageId() {
        return deletePageId;
    }

    public void setDeletePageId(Long deletePageId) {
        this.deletePageId = deletePageId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

}
