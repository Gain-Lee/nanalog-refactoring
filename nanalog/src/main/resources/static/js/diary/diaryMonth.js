(function(){

    var uid;
    const serverUrl = 'http://localhost:8080/';
    var selectedDate;
    var selectedMonth;

    function diaryService (){
        var locationHash = location.hash;
        uid = locationHash.substring(1, locationHash.length);
        this.init();
    }

    diaryService.prototype = {
        init : function() {
            console.log('~*~*~*~* diaryMonthService init ~*~*~*~*');
            let selectedYear = getYear();
            selectedMonth = getMonth();
            setDiaryMonthView(selectedYear + selectedMonth + "");
        },
        run : function() {}
    }

    var setDiaryMonthView = function(yyyyMM){

        let dateFormat = yyyyMM;

        $.get('/v1/diary/preview/test', {

        }, function(data) {
            let diaryCardList = convertDiaryCardList(data, 4);
            createDiaryMonthViewTemplate(diaryCardList);
            addDiaryCardClickEvent();
            });
    };

    var monthListClickEvent : function(){
        $(.month-list row).click(function(e){
            let classList = e.target.classList;
            for(i=0 ; i<classList.length ; i++){
                if(classList[i] = "month-list-selected")
                return;
            }
            let selectedMonthValue = e.target.innerText;
            changeMonthListClass(selectedMonth, selectedMonthValue);
            selectedMonth = selectedMonthValue;

            $('#selected-month').html(selectedMonthValue);
        });
    }

    var changeMonthListClass = function(beforeMonth, currentMonth) {
            $('#month-list-' + currentMonth).toggleClass('month-list-selected');
            $('#month-list-' + currentMonth).html(($('#month-list-' + currentMonth).html()).substring(0, 2));
            $('#month-list-' + beforeMonth).toggleClass('month-list-selected');
            $('#month-list-' + beforeMonth).html(getMonthName($('#month-list-' + beforeMonth).text()));
            monthViewChange(currentMonth);
        };

    /**
     *
     * yyyyMM에 해당하는 월의 데이터를 MonthView 에 적합한 형태(column 단위의 2d array)로 변환
     *
     * @param data, columnList
     * @returns {Array}
     */
    var convertDiaryCardList = function(data, columnCount){

        let columnList = new Array();
        for(let i=0;i<columnCount;i++){
            columnList.push(new Array());
        }

        for(let i=0;i<data.length;i++){
            let day = data[i].date.substring(6,8);
            let index = day%columnCount;
            if(index > 0) {
                index -= 1;
            }
            else{
                index = columnCount-1;
            }
            columnList[index].push(data[i]);
        }

        return columnList;
    };

    /**
     *
     * diaryCardList 를 지정된 handlebar 템플릿으로 세팅
     *
     * @param diaryCardList
     */
    var createDiaryMonthViewTemplate = function(diaryCardList){
        let source = $("#diary-column-template").html();
        let template = Handlebars.compile(source);
        let diaryCardListTemplate = template(diaryCardList);

        $("#diary-view-board").html(diaryCardListTemplate);
    };

    /**
     *
     * diary card 들에 대해서 click event 세팅
     *
     */
    var addDiaryCardClickEvent = function(){
        $(".diary-card").click(function(){
            let childs = $(this)[0].children;
            for(let i=0;i<childs.length;i++){
                if(childs[i].className == 'diary-card-date'){
                    console.log(childs[i].value);

                    let date = childs[i].value;
                    selectedDate = childs[i].value;
                    console.log(date);

                    $.get('/v1/diary/preview/test2', {

                    }, function(data){
                    console.log(data);
                    createDiaryWritingTemplate(data);

                    });
                }
            }
        });
    };

    var createDiaryWritingTemplate = function(data){
         let source = $('#diary-create-Template').html();
         let template = Handlebars.compile(source);
         let DiaryWritingTemplate = template(data);

         $('#diary-create-modal').html(DiaryWritingTemplate);
         $('#diary-create-modal').transition('slide up');

         cancelBtnClickEvent();
         completeBtnClickEvent();
    }

    var cancelBtnClickEvent = function(){
        $("#cancleBtn").click(function(){
        $('#diary-create-modal').transition('slide down');
        });
    }

    var completeBtnClickEvent = function(){
        $("#completeBtn").click(function(){
        console.log("completeBtn clicked");
        let source = $('#diary-store-Template').html();
        let DiaryStoreTemplate = Handlebars.compile(source);

        $('#diary-store-modal').html(DiaryStoreTemplate);
        $('#diary-store-modal').transition('slide up');
        storeBtnClickEvent();

        })
    }

    var storeBtnClickEvent = function(){
    $("#storeBtn").click(function(){
    console.log("storeBtn clicked");
    $('#diary-store-modal').transition('slide down');
    $('#diary-create-modal').transition('slide down');

    let title = $(".text-header").val();
    let sentence = $(".text-body").val();
    let imageUrl = $("#diaryImageTag").attr('src');

    $.post(serverUrl + 'v1/diary', {
                uid: uid,
                date: selectedDate,
                type: 'TITLE',
                data: title
            }, function(result){
                console.log(result);
                $.post(serverUrl + 'v1/diary', {
                uid: uid,
                date: selectedDate,
                type: 'SENTENCE',
                data: sentence
                }, function(result) {
                if(imageUrl != null){
                    $.post(serverUrl + 'v1/diary', {
                    uid: uid,
                    date: selectedDate,
                    type: 'IMAGE',
                    data: imageUrl
                    }, function(result){
                        console.log(result);
                        setDiaryMonthView();
                    });
                }
                else
                {
                    console.log(result);
                    setDiaryMonthView();
                }

                });
            });
    });

    }

    $( document ).ready(function() {
        let ds = new diaryService();
    });
})();