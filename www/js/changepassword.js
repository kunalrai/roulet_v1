$(document).ready(function () {

    User.getdetails();

    $.validator.setDefaults({
        submitHandler: function (e) {

            ChangePassword.onfrmsubmit();
        }
    }); 


    $.validator.methods.equals = function (value, element, param) {

        //console.log("mera waala method");
        // Bind to the blur event of the target in order to revalidate whenever the target field is updated
        var target = $(param);
        if (this.settings.onfocusout && target.not(".validate-equalTo-blur").length) {
            target.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
                $(element).valid();
            });
        }
        return value == param;
    }
});


var ChangePassword = ChangePassword ||

{

    onfrmsubmit: function () {
        console.log("change successfully");

        var data = {
            id: $("#userid").val(),
            newpwd: $("#newpwd").val()
        }
        $.ajax({
            type: "POST",
            url: "/auth/changepassword",
            data: JSON.stringify(data),

        }).then(function (d) {
            console.log(d);
           
            })
            .fail(function (a, b, c) {

                console.log("failed")
            })


    },
     validate: function (oldpwd,pin) {

        return {
            errorPlacement: function (error, element) {
                // Append error within linked label
                $(element)
                    .closest("form")
                    .find("label[for='" + element.attr("id") + "']")
                    .append(error);
            },
            errorElement: "span",
            messages: {
                oldpwd: {
                    required: " (required)",
                    equals: "  Old password wrong"
                },
                newpwd: {
                    required: " (required)",

                },
                connewpwd: {
                    required: " (required)",
                    equalTo: "   Confirm password not matched"
                },
                pin: {
                    equals: " Pin Not matched"
                }

            },
            rules: {
                oldpwd: {
                    equals: oldpwd
                },
                connewpwd: {
                   
                    equalTo: newpwd
                },
                pin: {
                    equals:pin
                }
            }
        }
    }
    }

var User = User ||
    {
        getdetails: function () {
            var data = {
                id: $("#userid").val()
            }
            $.ajax({
                type: "POST",
                url: "/user/get/",
                data: JSON.stringify(data),
               
            }).then(function (d) {
                console.log(d);
                $("#form1").validate(ChangePassword.validate(d.password,d.pin));
            });


        }
    }