(function(){

    function diaryCommonService (){
        this.init();
    }

    diaryCommonService.prototype = {
        init : function() {
            console.log('~*~*~*~* diaryCommonService init ~*~*~*~*');
        },
        run : function() {}
    };
    
    $( document ).ready(function() {
        let ds = new diaryCommonService();
    });
})();