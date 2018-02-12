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
                newpin: $("#newpin").val()
            }
            $.ajax({
                type: "POST",
                url: "/auth/changepin",
                data: JSON.stringify(data),

            }).then(function (d) {
                console.log(d);

                $("#updated").modal("show");
                $("#modal-body").text("Change Successfully");

            })
                .fail(function (a, b, c) {

                    console.log("failed")
                })


        },
        validate: function (opin, password) {

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
                    oldpin: {
                        required: " (required)",
                        equals: "  Old pin wrong"
                    },
                    newpin: {
                        required: " (required)",

                    },
                    connewpin: {
                        required: " (required)",
                        equalTo: "   Confirm pin not matched"
                    },
                    password: {
                        equals: " password Not matched"
                    }

                },
                rules: {
                    oldpin: {
                        equals: opin
                    },
                    connewpin: {

                        equalTo: newpin
                    },
                    password: {
                        equals: password
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
                $("#form1").validate(ChangePassword.validate(d.pin, d.password));
            });


        }
    }