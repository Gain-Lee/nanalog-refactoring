(function() {

    var serverUrl = 'http://localhost:8080/';

    var diaryViewWeekService = function() {
        var locationHash = location.hash;
        uid = locationHash.substring(1, locationHash.length);
        this.init();
    };

    var uid;
    var selectedMonth;
    var currentPreview;
    var selectedDay;

    diaryViewWeekService.prototype = {
        init: function() {
            console.log('==============>>> diary view week service Init ...');

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

    var createDiaryWeekTemplate = function(data) {
        let diaryWeekTemplate = '';

        diaryWeekTemplate += createColumn(createRow("<p id='selected-day'></p>"));
        for (let i = 0; i < 3; i++) {
            diaryWeekTemplate += createColumn(createRow(''));
        }
        diaryWeekTemplate += createColumn(createRow(buttonListRectangle(data)));

        return diaryWeekTemplate;
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

    Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth() + 1).toString();
        var dd = this.getDate().toString();

        return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
    }

    var componentInit = function() {
        diaryViewWeekService = new diaryViewWeekService();
    };

    if (!window.componentInit) {
        window.componentInit = componentInit();
    };
})();
