(function(){

    function diaryWeekService (){
        this.init();
    }

    diaryWeekService.prototype = {
        init : function() {
            console.log('~*~*~*~* diaryWeekService init ~*~*~*~*');
        },
        run : function() {}
    };
    $( document ).ready(function() {
        let ds = new diaryWeekService();
    });
})();