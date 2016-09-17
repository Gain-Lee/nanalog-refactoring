package com.nanalog.api.util.service;


import com.nanalog.api.util.model.request.DateRequest;
import com.nanalog.api.util.model.request.YearAgoDateRequest;
import com.nanalog.api.util.model.respnose.DateResponse;

public interface DateService {

    public DateResponse getCurrent(DateRequest dateRequest);

    public DateResponse getYearAgoDate(YearAgoDateRequest dateRequest);
}
