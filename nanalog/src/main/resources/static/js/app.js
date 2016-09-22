var testFunction = function(){
    $.get('/v1/diary/yyyymm/test', {
    }, function(data) {
      let source = $("#diary-column-template").html();
      let template = Handlebars.compile(source);

      // 1. 1~30 // 배열 4개로 쪼갤거임
      // 2. 첫번째 리스트 : 1,5,9,13,17,21,25,29
      //    두번째 리스트 : 2,6,10,14,18,22,26,30
      //    세번째 리스트 : 3,7,11,15,19,23,27,31
      //    네번째 리스트 : 4,8,12,16,20,24,28


      let columnList1 = new Array();
      let columnList2 = new Array();
      let columnList3 = new Array();
      let columnList4 = new Array();

      let n = 4;
      for(let i=0;i<data.length;i++){

        // data가지고 연산
        let day = data[i].date.substring(6,8);

        console.log(data[i]);
        if(data[i].pid == null){
            data[i].pid = false;
        }
        if(day % n == 1){
          columnList1.push(data[i]);
        }
        else if (day % n == 2) {
          columnList2.push(data[i]);
        }
        else if (day % n == 3) {
          columnList3.push(data[i]);
        }
        else if (day % n == 0) {
          columnList4.push(data[i]);
        }
        else{

        }
      }

      let columnList = template(columnList1);
      columnList += template(columnList2);
      columnList += template(columnList3);
      columnList += template(columnList4);

      $("#diary-view-board").html(columnList);

      diaryCardClickEventHandler();
    });

  };


var diaryCardClickEventHandler = function(){
    $(".diary-card").click(function(){
        let childs = $(this)[0].children;

        for(let i=0;i<childs.length;i++){
            if(childs[i].className == 'diary-card-date'){
                console.log(childs[i].value);
            }
        }
    });
}