(function() {

    var serverUrl = 'http://localhost:8080/';

    var diaryCommonService = function() {
        var locationHash = location.hash;
        uid = locationHash.substring(1, locationHash.length);
        this.init();
    };

    var uid;
    var selectedMonth;
    var currentPreview;
    var selectedDay;

    diaryCommonService.prototype = {
        init: function() {
            console.log('==============>>> diary common service Init ...');

            this.diaryViewTypeClickEventHandler();

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
        diaryCommonService = new diaryCommonService();
    };

    if (!window.componentInit) {
        window.componentInit = componentInit();
    };
})();
