var Login = function() {
    return {
        init: function() {

            $('#remember').change(function () {
                if ($(this).is(":checked")) {
                    $(this).attr("value", 1);
                } else {
                    $(this).attr("value", 0);
                }
            });

        }
    };
}();

jQuery(document).ready(function () {

    Login.init();

});