(function ($) {

    $.Auth = {
        isAutorized : function(){
            
            if ($.cookie('_Autorize')) {
                return true;
            }
             
            return false;

        },
        getAuthCookie: function () {
            if ($.cookie('_Autorize')) {
                return $.cookie('_Autorize');
            }

            return "";
        }
    };

}(jQuery));