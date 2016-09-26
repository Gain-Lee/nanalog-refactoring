(function(){

    var uid;

    function diaryService (){
        var locationHash = location.hash;
        uid = locationHash.substring(1, locationHash.length);
        this.init();
    }

    diaryService.prototype = {
        init : function() {
            console.log('~*~*~*~* diaryMonthService init ~*~*~*~*');
            setDiaryMonthView();
        },
        run : function() {}
    }

    var setDiaryMonthView = function(yyyyMM){

        let dateFormat = yyyyMM;

        $.get('/v1/diary/yyyymm/test', {
        }, function(data) {
            let diaryCardList = convertDiaryCardList(data, 4);
            createDiaryMonthViewTemplate(diaryCardList);
            addDiaryCardClickEvent();
            });
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
                    console.log(date);

                    $.get('/v1/diary/preview', {
                    uid : uid,
                    startDate: date,
                    endDate: date
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
    }


    $( document ).ready(function() {
        let ds = new diaryService();
    });
})();