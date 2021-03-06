(function() {

    const serverUrl = 'http://localhost:8080/';

    var diaryService = function() {
        var locationHash = location.hash;
        uid = locationHash.substring(1, locationHash.length);
        this.init();
    };

    var uid;
    var selectedMonth;
    var currentPreview;
    var selectedDay;

    diaryService.prototype = {
        init: function() {
            console.log('==============>>> diary service Init ...');
            //월 리스트에서 선택시 월 숫자 변경
            this.monthListClickEventHandler();
            //
            selectedMonth = getMonth();

            monthViewInit();
            //월 리스트에서 선택된 월의 클래스 이름 변경
            changeMonthListClass(selectedMonth);
            changeMonthListClass(selectedMonth, selectedMonth);
            //주 화면-월 화면 선택시 초기화
            this.diaryViewTypeClickEventHandler();

            //작성창의 현재 시간 표시
            writePageCurrentDate();
            //작성창에서 이미지 추가 버튼 이벤트
            addImgBtnEvent();
            //
            cancleBtnEvent();
            //작성창 확인버튼 이벤트 > 저장 화면 초기화
            completeBtnEvent();
            //작성창 저장버튼 이벤트 > 사용자가 작성창에서 작성한 데이터 서버에 저장
            storeBtnEvent();
            //작성창 텍스트 형식 수정 >> 색 변경
            inputTextStyleChange();
            //직성한 글자수 업데이트...?
            currentTextCnt();
        },
        monthListClickEventHandler: function() {
            $('.month-list').click(function(e) {
                let classList = e.target.classList;
                for (let i = 0; i < classList.length; i++) {
                    if (classList[i] == "month-list-selected") {
                        return;
                    }
                }
                let selectedMonthValue = e.target.innerText;

                changeMonthListClass(selectedMonth, selectedMonthValue);
                selectedMonth = selectedMonthValue

                $('#selected-month').html(selectedMonthValue);
            });
        },
        diaryViewTypeClickEventHandler: function() {
            $('.diary-view-type').click(function(e) {
                let type = e.target.id;

                if (type == 'view-type-month') {
                    monthViewInit();
                } else {
                    currentPreview = (new Date()).yyyymmdd();
                    weekViewInit();
                }
            });
        },
        weekListClickEventHandler: function() {

        },
        run: function() {}
    };


    // 버튼 누를때 뿌려주는 데이터 체크
    function checkAjaxCallData(selectBarButtonValue) {
        var headerObj = doc.getElementById("header");
        var dataObj = doc.getElementById("data");

        for (var i = 0; i < cacheObjs.length; i++) {
            if (cacheObjs[i].date == selectBarButtonValue) {
                headerObj.innerHTML = cacheObjs[i].header;
                dataObj.innerHTML = cacheObjs[i].data;

                return;
            }
        }

        headerObj.innerHTML = "";
        dataObj.innerHTML = "<div class='plus'>+</div>";
    }

    /* 여기부터 작성창에 쓰일 현재시간 */
    function writePageCurrentDate() {
        let getID = $('#current-date');

        let date = new Date();
        let yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;

        if (mm < 10) {
            mm = "0" + mm;
        }

        let dd = date.getDate();

        if (dd < 10) {
            dd = "0" + dd;
        }

        let hh = date.getHours();

        if (hh < 10) {
            hh = "0" + hh;
        }

        let MM = date.getMinutes();

        if (MM < 10) {
            MM = "0" + MM;
        }

        let currentTime = yyyy + "_" + mm + "_" + dd + " " + hh + ":" + MM;
        console.log(currentTime);
        getID.html(currentTime);
    }
    /* 여기까지 작성창에 쓰일 현재시간 */

    /* 여기부터 작성창 버튼 이벤트 */
    function addImgBtnEvent() {
        $('#addImgBtn').click(function() {
            $('#fileForm').ajaxForm({
                url: "http://localhost:8080/v1/diary/image",
                enctype: "multipart/form-data",
                success: function(result) {
                    console.log(result);
                    $('#file-rectangle').css('display', 'none');
                    $('#img-rectangle').html('<img id="diaryImageTag" src="' + serverUrl+"v1/diary/image?filePath="+result +'"/>');
                    $('#img-rectangle').css('display', 'block');
                }
            });

            $("#fileForm").submit();
        });
    }

    function cancleBtnEvent() {
        $('#cancleBtn').click(function() {
            $('#diary-create-modal').transition('slide up');
            $('#text-header').val('');
            $('#text-body').val('');
            $('#current-word-cnt').empty();
            $('#writing-status').css("color", "#ffffff");
            $('#file-rectangle').css('display', 'block');
            $('#img-rectangle').css('display', 'none');
        });
    }

    function completeBtnEvent() {
        $('#completeBtn').click(function() {
            console.log("completeBtn clicked");
            $('#diary-store-modal').transition('slide down');
        });
    }
/*
    function storeBtnEvent() {
        $('#storeBtn').click(function() {
            console.log("storeBtn clicked");
            //둘다 up이거나 둘다 down이어야 하는거 같은데..?
            $('#diary-store-modal').transition('slide down');
            $('#diary-create-modal').transition('slide up');

            let title = $("#text-header").val();
            //            let currentDate = (new Date()).yyyymmdd();
            let sentence = $("#text-body").val();
            let imageUrl = $("#diaryImageTag").attr('src');

            $.post(serverUrl + 'v1/diary', {
                uid: uid,
                date: selectedDay,
                type: 'TITLE',
                data: title
            }, function(result) {
                console.log(result);
                $.post(serverUrl + 'v1/diary', {
                    uid: uid,
                    date: selectedDay,
                    type: 'IMAGE',
                    data: imageUrl
                }, function(result) {
                    console.log(result);

                    $.post(serverUrl + 'v1/diary', {
                        uid: uid,
                        date: selectedDay,
                        type: 'SENTENCE',
                        data: sentence
                    }, function(result) {
                        console.log(result);
                        monthViewInit();
                    }).fail(function(e) {
                        alert("내용 등록 실패");
                    });
                }).fail(function(e) {
                    alert("이미지 등록 실패");
                });
            }).fail(function(e) {
                alert("제목 등록 실패");
            });
        });
    }
*/


    function storeBtnEvent() {
        $('#storeBtn').click(function() {
            console.log("storeBtn clicked");
            //둘다 up이거나 둘다 down이어야 하는거 같은데..?
            $('#diary-store-modal').transition('slide down');
            $('#diary-create-modal').transition('slide up');

            let title = $("#text-header").val();
            //            let currentDate = (new Date()).yyyymmdd();
            let sentence = $("#text-body").val();
            let imageUrl = $("#diaryImageTag").attr('src');

            $.post(serverUrl + 'v1/diary', {
                uid: uid,
                date: selectedDay,
                type: 'TITLE',
                data: title
            }, function(result){
                console.log(result);
                $.post(serverUrl + 'v1/diary', {
                uid: uid,
                date: selectedDay,
                type: 'SENTENCE',
                data: sentence
                }, function(result) {
                if(imageUrl != null){
                    $.post(serverUrl + 'v1/diary', {
                    uid: uid,
                    date: selectedDay,
                    type: 'IMAGE',
                    data: imageUrl
                    }, function(result){
                        console.log(result);
                        monthViewInit();
                    });
                }
                else
                {
                    console.log(result);
                    monthViewInit();
                }

                });
            });
        });
    }



    function inputTextStyleChange() {
        $('#text-header').focus(function() {
            $('#text-header').css("color", "#5f5f5f");
            showWritingStatus();
        });
        $('#text-body').focus(function() {
            $('#text-header').css("color", "#5f5f5f");
            showWritingStatus();
        });
    }

    function currentTextCnt() {
        $('#text-body').keyup(function(e) {
            var content = $(this).val();
            $('#current-word-cnt').html(content.length);
        });
    }
    //작성창에서 작성하면 writing...
    function showWritingStatus() {
        console.log("status check");
        $('#writing-status').css("color", "#8499ba");
    }
    /* 여기까지 작성창 버튼 이벤트 */


    var weekViewInit = function() {
        console.log("week page start");

        //월화면에서 주화면으로 넘어갈 떄 년, 월 감추기
        $('#selected-year').css("visibility", "hidden");
        $('#selected-month').css("visibility", "hidden");
        //주화면이 선택된 이미지로 변경
        $('#view-type-month').attr("src", "img/nonSelectedMonthBtn.png");
        $('#view-type-week').attr("src", "img/selectedWeekBtn.png");

        let yyyy = currentPreview.substring(0, 4);
        let mm = currentPreview.substring(4, 6);
        let dd = currentPreview.substring(6, 8);

        if (mm.substring(0, 1) == '0') {
            mm = mm.substring(1, 2);
        }
        if (dd.substring(0, 1) == '0') {
            dd = dd.substring(1, 2);
        }

        $.get(serverUrl + 'v1/diary/preview', {
            uid: uid,
            startDate: calDate(yyyy, mm, dd, -7),
            endDate: currentPreview
        }, function(data) {
            console.log(data);
            $('#diary-view-board').html(createDiaryPreviewForm() + createDiaryWeekTemplate(data));
            $('#week-preview-prev').click(function(e) {
                //            let dt = new Date();
                let yyyy = currentPreview.substring(0, 4);
                let mm = currentPreview.substring(4, 6);
                let dd = currentPreview.substring(6, 8);

                if (mm.substring(0, 1) == '0') {
                    mm = mm.substring(1, 2);
                }
                if (dd.substring(0, 1) == '0') {
                    dd = dd.substring(1, 2);
                }
                currentPreview = calDate(yyyy, mm, dd, -7);

                weekViewInit();
            });
            $('#week-preview-next').click(function(e) {
                //            let dt = new Date();
                if (currentPreview == (new Date()).yyyymmdd()) {
                    //                    alert('오늘 이후의 값');
                    return;
                }
                let yyyy = currentPreview.substring(0, 4);
                let mm = currentPreview.substring(4, 6);
                let dd = currentPreview.substring(6, 8);

                if (mm.substring(0, 1) == '0') {
                    mm = mm.substring(1, 2);
                }
                if (dd.substring(0, 1) == '0') {
                    dd = dd.substring(1, 2);
                }
                currentPreview = calDate(yyyy, mm, dd, 7);
                weekViewInit();
            });
            $('.week-btn-list').click(function(e) {
                let selectValue = e.target.value;

                let srcType = e.target.src;

                if(srcType == 'http://localhost:7777/img/weekNonSelectBtn.png'){
                    $('#diary-create-modal').transition('slide up');

                    $('#text-header').val('');
                    $('#text-body').val('');
                    $('#current-word-cnt').empty();
                    $('#writing-status').css("color", "#ffffff");
                    $('#file-rectangle').css('display', 'block');
                    $('#img-rectangle').css('display', 'none');

                    selectedDay = new String(yyyy) + new String(mm) + new String(e.target.id.substring(11, 13));

                    return;
                }

                weekViewDetailInit(selectValue);
            });
            weekViewDetailInit(currentPreview);
        });
    }

    var weekViewDetailInit = function(dt) {
        $.get(serverUrl + '/v1/diary/preview', {
            uid: uid,
            startDate: dt,
            endDate: dt
        }, function(data) {
            //alert(data);
            $('#selected-day').css("text-decoration", "none");

            let top = "<div class='weekPageYearMonth'>" + data[data.length - 1].date.substring(0, 4) + "_" + data[data.length - 1].date.substring(4, 6) + "</div>";
            let bottom = "<div class='weekPageDay'>DAY_" + data[data.length - 1].date.substring(6, 8) + "</div>";

            $('#selected-day').html(top + bottom);
            $('#diary-view-week-header').html(data[data.length - 1].title);
            $('#diary-view-week-description').html(data[data.length - 1].body);
            $('#diary-view-week-img').attr('src', data[data.length - 1].imageUrl);
        });
    }


    //월 선택시에 해당 월 정보 보여줌
    var monthViewChange = function(currentMonth){


        let date = new Date();
        let yyyy = date.getFullYear().toString();
        let mm = currentMonth;
        let dd = getMonthDay(currentMonth);

        let day = getMonthDay(currentMonth) - 1;

        let currentDate = new Date(yyyy, mm, dd);


        $.get(serverUrl + '/v1/diary/preview', {
                    uid: uid,
                    startDate: calDate(yyyy,mm,dd,day),
                    endDate: currentDate
                }, function(data) {
                    $("#diary-view-board").html(createDiaryMonthTemplate());
                    diaryCardInit(data);
                });

    }


       var getMonthDay = function(mon) {
            console.log(mon);
            switch (mon) {
                case '01':
                    return 31;
                    break;
                case '02':
                    return 28;
                    break;
                case '03':
                    return 31;
                    break;
                case '04':
                    return 30;
                    break;
                case '05':
                    return 31;
                    break;
                case '06':
                    return 30;
                    break;
                case '07':
                    return 31;
                    break;
                case '08':
                    return 31;
                    break;
                case '09':
                    return 30;
                    break;
                case '10':
                    return 31;
                    break;
                case '11':
                    return 30;
                    break;
                case '12':
                    return 31;
                    break;
            }
        }

    var monthViewInit = function() {
        console.log("month page start");
        //월화면으로 바뀔때 년, 월 표시
        $('#selected-year').css("visibility", "visible");
        $('#selected-month').css("visibility", "visible");
        //월화면이 선택된 이미지로 변경
        $('#view-type-month').attr("src", "img/selectedMonthBtn.png");
        $('#view-type-week').attr("src", "img/nonSelectedWeekBtn.png");

        let currentDate = new Date().yyyymmdd();

        $.get(serverUrl + '/v1/diary/preview', {
            uid: uid,
            startDate: calDay(-30),
            endDate: currentDate
        }, function(data) {
            $("#diary-view-board").html(createDiaryMonthTemplate());
            diaryCardInit(data);
        });
    };
    //월화면에서 일기 프리뷰
    var diaryCardInit = function(data) {

        let chkArray = new Array();
        let month;
        if (data.length != 0) {
            for (let i = 0; i < data.length; i++) {
                let diaryCardHtml = createDiaryCard(data[i].title, data[i].body);
                var date = data[i].date;
                let day = date.substring(date.length - 2, date.length);
                chkArray.push(day);
                $("#diary-card-" + day).html(diaryCardHtml);

                $('#diary-card-' + day).click(function(e) {
                    selectedDay = new String($('#selected-year').html()) + $('#selected-month').html() + new String(day);
                    $('#diary-create-modal').transition('slide up');
                    $.get(serverUrl + '/v1/diary/preview', {
                        uid: uid,
                        startDate: selectedDay,
                        endDate: selectedDay
                    }, function(data) {
                        //alert(data);
                        console.log(data);
                        $('#text-header').html(data[0].title);
                        $('#text-body').html(data[0].body);

                        $('#selected-day').css("text-decoration", "none");

                        let top = "<div class='weekPageYearMonth'>" + data[data.length - 1].date.substring(0, 4) + "_" + data[data.length - 1].date.substring(4, 6) + "</div>";
                        let bottom = "<div class='weekPageDay'>DAY_" + data[data.length - 1].date.substring(6, 8) + "</div>";

                        $('#selected-day').html(top + bottom);
                        $('#diary-view-week-header').html(data[data.length - 1].title);
                        $('#diary-view-week-description').html(data[data.length - 1].body);
                        $('#diary-view-week-img').attr('src', data[data.length - 1].imageUrl);
                    });
                });
            }
            month = date.substring(date.length - 4, date.length - 2);

        }
        let currentCount = 0;
        if (month == getMonth()) {
            currentCount = getDay();
        } else if (data.length == 0) {
            currentCount = getDay();
        } else {
            currentCount = data.length;
        }

        for (let i = 1; i <= currentCount; i++) {
            if (!arrContains(chkArray, i)) {
                let date = new Date();
                let yyyy = date.getFullYear();
                let mm = date.getMonth() + 1;
                if (mm < 10) {
                    mm = '0' + mm;
                }
                if (i == new Date().getDate()) {
                    let day = i;
                    if (day < 10) {
                        day = '0' + day;
                    }
                    $("#diary-card-" + day).addClass('today-card');
                    $("#diary-card-" + day).html("<div class='today'>DAY<br/>" + getDay() + "</div>");
                    $('#diary-card-' + day).click(function(e) {
                        $('#diary-create-modal').transition('slide down');
                        selectedDay = new String(yyyy) + new String(mm) + new String(e.target.id.substring(11, 13));
                    });
                } else {
                    let day = i;
                    if (day < 10) {
                        day = '0' + day;
                    }
                    $('#diary-card-' + day).html("<div class='plus'>+</div>");
                    $('#diary-card-' + day).click(function(e) {
                        $('#diary-create-modal').transition('slide up');

                        $('#text-header').val('');
                        $('#text-body').val('');
                        $('#current-word-cnt').empty();
                        $('#writing-status').css("color", "#ffffff");
                        $('#file-rectangle').css('display', 'block');
                        $('#img-rectangle').css('display', 'none');

                        selectedDay = new String(yyyy) + new String(mm) + new String(e.target.id.substring(11, 13));
                    });
                }
            }
        }
    }

    var arrContains = function(arr, val) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                return true;
            }
        }
        return false;
    }

    var createDiaryCard = function(title, body) {
        let diaryCardHtml = '';
        diaryCardHtml += "<div class='header'>";
        diaryCardHtml += title;
        diaryCardHtml += "</div><div class='description'>" + body + "</div>";
        // diaryCardHtml += "<i class='ellipsis horizontal icon bottom-btn'></i>";
        // diaryCardHtml += "<input type='image' class='ellipsis horizontal icon bottom-btn' src='img/weekPageEditBtn.png' />";
        // diaryCardHtml += "<input type='image' class='ellipsis horizontal icon bottom-btn' src='img/weekPageDeleteBtn.png' />";
        return diaryCardHtml;
    }


    var createDiaryWeekTemplate = function(data) {
        let diaryWeekTemplate = '';

        diaryWeekTemplate += createColumn(createRow("<p id='selected-day'></p>"));
        for (let i = 0; i < 3; i++) {
            diaryWeekTemplate += createColumn(createRow(''));
        }
        diaryWeekTemplate += createColumn(createRow(buttonListRectangle(data)));

        return diaryWeekTemplate;
    };

    var createDiaryMonthTemplate = function() {
        let diaryMonthTemplate = '';
        diaryMonthTemplate += createColumn(createRow(''));

        for (let i = 0; i < 4; i++) {
            let diaryColumnTemplate = '';
            diaryColumnTemplate += createItem('');
            for (let j = 1; j < 8 * 4; j += 4) {
                diaryColumnTemplate += createItem((i + j) + '');
            }
            diaryColumnTemplate += createItem('');
            diaryMonthTemplate += createColumn(createRow(diaryColumnTemplate));
        }
        return diaryMonthTemplate;
    };
    //주화면에서 일기 상세창
    var createDiaryPreviewForm = function() {
        //      let diaryRectangleTemplate = "<div id='diary-view-week'></div>";
        let diaryRectangleTemplate = "<div class='diary-preview ui standard modal transition visible active scrolling' id='diary-view-week'>";
        diaryRectangleTemplate += "<div id='diary-view-week-header'></div>";
        diaryRectangleTemplate += "<div class='ui two column doubling grid'><div id='diary-view-week-description' class='two column'></div>";
        //      diaryRectangleTemplate += "<div class='ui header'>header</div>";
        //      diaryRectangleTemplate += "<p>body</p>";
        diaryRectangleTemplate += "<div class='weekPageBackgroundImg'><div class='one column'><img id='diary-view-week-img' src=''/></div></div>";
        //      diaryRectangleTemplate += "<div><p>a</p><p>b</p><p>c</p><p>d</p></div>";
        diaryRectangleTemplate += "</div>";
        diaryRectangleTemplate += "<div class='diary-view-week-btn'>";
        diaryRectangleTemplate += "<button id='weekPageDeleteBtn'>삭제</button>";
        diaryRectangleTemplate += "<button id='weekPageEditBtn'>수정</button></div>";
        diaryRectangleTemplate += "</div>";
        diaryRectangleTemplate += "</div>";
        return diaryRectangleTemplate;
    }
    //주 리스트 설정
    var buttonListRectangle = function(data) {
        console.log("#");
        console.log(data);
        let buttonRectangleTemplate = "<div class='diary-view-btn-list one column'><p><input type='image' id='week-preview-prev' src='img/uparrow.png' /></p>";

        let yyyy = currentPreview.substring(0, 4);
        let mm = currentPreview.substring(4, 6);
        let dd = currentPreview.substring(6, 8);

        if (mm.substring(0, 1) == '0') {
            mm = mm.substring(1, 2);
        }
        if (dd.substring(0, 1) == '0') {
            dd = dd.substring(1, 2);
        }
        let dtArr = new Array();
        for (let i = 0; i < 8; i++) {
            dtArr.push(calDate(yyyy, mm, dd, -i));
        }

        let chk = 0;
        for (let i = dtArr.length - 1; i >= 0; i--) {
            chk = 0;
            //주리스트에서 작성된 일기와 작성되지 않은 일기 이미지 설정 > 이미지 이름이 잘못됨
            for (let j = data.length - 1; j >= 0; j--) {
                if (dtArr[i] == data[j].date) {
                    // true 인 경우
                    chk++;
                    buttonRectangleTemplate += "<p><input type='image' class='week-btn-list' src='img/weekSelectBtn.png' value='" + data[j].date + "'/></p>";
                }
            }
            if (chk < 1) {
                // false 인 경우
                buttonRectangleTemplate += "<p><input type='image' class='week-btn-list' src='img/weekNonSelectBtn.png' value='" + dtArr[i] + "'/></p>";
            }
        }

        // for (let i = 0; i < data.length; i++) {
        //     buttonRectangleTemplate += "<button class='week-btn-list' value='" + data[i].date + "'>" + data[i].date + "</button>";
        // }
        buttonRectangleTemplate += "<p><input type='image' id='week-preview-next' src='img/downarrow.png' /></p></div>";

        return buttonRectangleTemplate;
    }

    var createColumn = function(innerRow) {
        let columnHtml = "<div class='column'>" + innerRow + "</div>";
        return columnHtml;
    };

    var createRow = function(innerItem) {
        let rowItem = "<div class='diary-grid-row row ui grid'>" + innerItem + "</div>";

        return rowItem;
    };

    var createItem = function(id) {
        if (id < 10) {
            id = "0" + id;
        }

        let itemHtml = "<div ";
        if (!(id == null || id == '')) {
            itemHtml += "id='diary-card-" + id + "' ";
        }
        itemHtml += "class='diary-card'></div>";

        return itemHtml;
    };

    var changeMonthListClass = function(currentMonth, beforeMonth) {
        $('#month-list-' + currentMonth).toggleClass('month-list month-list-selected');
        $('#month-list-' + currentMonth).html(($('#month-list-' + currentMonth).html()).substring(0, 2));
        $('#month-list-' + beforeMonth).toggleClass('month-list-selected month-list');
        $('#month-list-' + beforeMonth).html(getMonthName($('#month-list-' + beforeMonth).text()));
        monthViewChange(currentMonth);
    };

    var getMonthName = function(mon) {
        console.log(mon);
        switch (mon) {
            case '01':
                return mon + '&nbsp;&nbsp;January';
                break;
            case '02':
                return mon + '&nbsp;&nbsp;February';
                break;
            case '03':
                return mon + '&nbsp;&nbsp;March';
                break;
            case '04':
                return mon + '&nbsp;&nbsp;April';
                break;
            case '05':
                return mon + '&nbsp;&nbsp;May';
                break;
            case '06':
                return mon + '&nbsp;&nbsp;June';
                break;
            case '07':
                return mon + '&nbsp;&nbsp;July';
                break;
            case '08':
                return mon + '&nbsp;&nbsp;August';
                break;
            case '09':
                return mon + '&nbsp;&nbsp;September';
                break;
            case '10':
                return mon + '&nbsp;&nbsp;October';
                break;
            case '11':
                return mon + '&nbsp;&nbsp;November';
                break;
            case '12':
                return mon + '&nbsp;&nbsp;December';
                break;
        }
    }

    var getDay = function() {
        let dayValue = new Date().getDate();
        if (dayValue < 10) {
            dayValue = '0' + dayValue;
        }
        return dayValue;
    }

    var getMonth = function() {
        let monthValue = new Date().getMonth();
        monthValue++;
        if (monthValue < 10) {
            monthValue = '0' + monthValue;
        }
        return monthValue;
    };

    //주화면과 월화면에서 현재날짜 기준으로 enddate 계산함수
    var calDate = function(yyyy, mm, dd, calDay) {
        let date = new Date(yyyy, (mm - 1), dd);
        let result = date.setDate(date.getDate() + calDay);
        let d = date.getDate();
        let m = date.getMonth() + 1;
        let y = date.getFullYear();

        if (m < 10) {
            m = '0' + m;
        }
        if (d < 10) {
            d = '0' + d;
        }

        result = y + '' + m + '' + d;
        return result;
    }


    var calDay = function(calDay) {
        let date = new Date();
        let yyyy = date.getFullYear().toString();
        let mm = (date.getMonth() + 1).toString();
        let dd = date.getDate().toString();

        return calDate(yyyy, mm, dd, calDay);
    }

    Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth() + 1).toString();
        var dd = this.getDate().toString();

        return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
    }

    var componentInit = function() {
        diaryService = new diaryService();
    };

    if (!window.componentInit) {
        window.componentInit = componentInit();
    };
})();
