var Register = function () {

    return {

        bindEvents: function () {

            $('#register').submit(function (event) {

                event.preventDefault();

                var hostname = window.location.origin;
                var form = $(this);

                var name = form.find("input[name='name']").val();
                var email = form.find("input[name='email']").val();
                var password = form.find("input[name='password']").val();

                var data = {
                    name: name,
                    email: email,
                    password: password
                }

                $("#ajax").modal("show");

                $.ajax({
                    type: "POST",
                    url: "/auth/register/",
                    data: JSON.stringify(data),
                    success: function () {

                        $("#ajax").modal("hide");

                        location.href = "/users/login/";

                    },
                    error: function (error) {

                        if (error.status == 400) {

                            $("#register_tnc_error").text("Email dublicated");
                           
                        }

                    }
                });
               
            });

        }

    }

}();

jQuery(document).ready(function () {

    Register.bindEvents();

});
