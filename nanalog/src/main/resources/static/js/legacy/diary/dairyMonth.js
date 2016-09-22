(function() {

    var serverUrl = 'http://localhost:8080/';

    var diaryViewMonthService = function() {
        var locationHash = location.hash;
        uid = locationHash.substring(1, locationHash.length);
        this.init();
    };

    var uid;
    var selectedMonth;
    var currentPreview;
    var selectedDay;

    diaryViewMonthService.prototype = {
        init: function() {
            console.log('==============>>> diary view month service Init ...');
            //월 리스트에서 선택시 월 숫자 변경
            this.monthListClickEventHandler();

            selectedMonth = getMonth();

            monthViewInit();
            //월 리스트에서 선택된 월의 클래스 이름 변경
            changeMonthListClass(selectedMonth);
            changeMonthListClass(selectedMonth, selectedMonth);

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


    //월화면 초기화
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

    //서버에서 받은 일기 내용으로 일기 프리뷰 카드 생성
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

    //월화면 템플릿 생성
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

    //월리스트에서 선택된 월과 선택되지 않은 월의 스타일 변경
    var changeMonthListClass = function(beforeMonth, currentMonth) {
        $('#month-list-' + currentMonth).toggleClass('month-list month-list-selected');
        $('#month-list-' + currentMonth).html(($('#month-list-' + beforeMonth).html()).substring(0, 2));
        $('#month-list-' + beforeMonth).toggleClass('month-list-selected month-list');
        $('#month-list-' + beforeMonth).html(getMonthName($('#month-list-' + currentMonth).text()));
    };

    //선택된 월의 영어 표현 리턴
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


    var componentInit = function() {
        diaryViewMonthService = new diaryViewMonthService();
    };

    if (!window.componentInit) {
        window.componentInit = componentInit();
    };
})();
