function Select(input, select, def) {

    var current_value = null;

    if (input) {
        if (input.val) {
            current_value = input.val();
        }
        else {
            current_value = input;
        }

    }

    if (current_value) {

        var options = select.children("option");

        for (var i = 0; i < options.size(); i++) {
            var option = options.eq(i);
            if ((option.val()) && (option.val() == current_value)) {
                option.prop('selected', true);

            }
        }
    }
    else if (def) {

        var options = select.children("option");

        for (var i = 0; i < options.size(); i++) {
            var option = options.eq(i);
            if ((option.val()) && (option.val() == def)) {
                option.prop('selected', true);
            }
        }

    }
}

var Managers = function () {
    return {
        init: function () {

            $.ajax({
                type: "GET",
                url: "/auth/list?level=2",
                dataType: 'json',
                contentType: "application/json",
                success: function (response) {

                    var responseJson = response.data;

                    if ((responseJson) && (responseJson.length > 0)) {

                        var optionsHtml = "<option></option>";

                        for (var i = 0; i < responseJson.length; i++) {

                            optionsHtml += "<option value='" + responseJson[i]["id"] + "'>" + responseJson[i]["name"] + "</option>";

                        }

                        $("#area_manger").html(optionsHtml);

                        Select($("#area_manger_h"), $("#area_manger"));

                    }

                }
            });
        }
    }
}();

var Mains = function () {
    return {
        init: function () {

            $.ajax({
                type: "GET",
                url: "/auth/list?level=1",
                dataType: 'json',
                contentType: "application/json",
                success: function (response) {

                    var responseJson = response.data;

                    if ((responseJson) && (responseJson.length > 0)) {

                        var optionsHtml = "<option></option>";

                        for (var i = 0; i < responseJson.length; i++) {

                            optionsHtml += "<option value='" + responseJson[i]["id"] + "'>" + responseJson[i]["name"] + "</option>";

                        }

                        $("#main").html(optionsHtml);

                        Select($("#main_h"), $("#main"));

                    }

                }
            });
        }
    }
}();


var Profile = function () {

    return {

        bindEvents: function () {

            $('#update-profile').submit(function (event) {

                event.preventDefault();

                var hostname = window.location.origin;

                var form = $(this);

                var id = form.find("input[name='id']").val();
                var name = form.find("input[name='name']").val();
                var email = form.find("input[name='email']").val();
                var point = form.find("input[name='point']").val();
                var phone = form.find("input[name='phone']").val();
                var commission = form.find("input[name='commission']").val();
                var address = form.find("textarea[name='address']").val();
                var ddstate = $("#ddstate option:selected").val();
                var ddldistrict = $("#ddldistrict option:selected").val();

                var access_level = form.find("select[name='access_level']").val();
                var password = form.find("input[name='password']").val();
                var pin = form.find("input[name='pin']").val();
                var ref = form.find("select[name='area_manger']").val();
                var main = form.find("select[name='main']").val();

                var data = {
                    name: name,
                    email: email,
                    access_level: access_level,
                    password: password,
                    pin: pin,
                    ref: ref,
                    main: main,
                    point: point,
                    phone: phone,
                    commission: commission,
                    address: address,
                    ddstate: ddstate,
                    ddldistrict: ddldistrict

                }

                $("#ajax").modal("show");

                if (id) {

                    data["id"] = id
                    $.ajax({
                        type: "POST",
                        url: "/auth/update/",
                        data: JSON.stringify(data),
                        success: function () {
                            $("#ajax").modal("hide");
                        }
                    });

                }
                else {

                    $.ajax({
                        type: "POST",
                        url: "/auth/create/",
                        data: JSON.stringify(data),
                        success: function () {

                            $("#ajax").modal("hide");

                            location.href = hostname + "/users/all/";

                        }
                    });
                }

            });

            $('#reset').click(function (event) {

                event.preventDefault();

                var hostname = window.location.origin;

                var data = {
                    id: $("#user-id").val()
                }

                $("#ajax").modal("show");

                $.ajax({
                    type: "POST",
                    url: "/auth/reset/",
                    data: JSON.stringify(data),
                    success: function (response) {

                        $("#pin").val(response.pin);

                        $("#password").val(response.password);

                        $("#ajax").modal("hide");

                    }
                });

            });

        }

    }

}();
jQuery(document).ready(function () {

    Profile.bindEvents();

    Managers.init();

    Mains.init();

   
    if ($("#hdnstateid").val() != undefined && $("#hdnstateid").val()!='') {
        $("#ddstate").val($("#hdnstateid").val());
        BindDistrict($("#hdnstateid").val())
    }
    $('#phone').keydown(function (e) {
        if (e.shiftKey || e.ctrlKey || e.altKey || e.tabKey) {
            e.preventDefault();
        } else {
            var key = e.keyCode;
            if (!((key == 8) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105)) && !(key == 9)) {
                e.preventDefault();
            }
        }
    });

   
    $("#ddstate").change(function () {

        BindDistrict($("#ddstate").val())
        
    })

});
function BindDistrict(stateid) {
    var data = {
        stateid: stateid
    }
    $.ajax({
        type: "POST",
        url: "/auth/GetDistrict/",
        data: JSON.stringify(data),
        success: function (response) {
            $("#ddldistrict").html("");
            $("#ddldistrict").append("<option value=\"0\">--Select District--</option>")
            $.each(response, function (i, v) {
                $("#ddldistrict").append("<option value=" + v.Value + ">" + v.Text + "</option>")
            })
            if ($("#hdndistrictid").val() != undefined && $("#hdndistrictid").val() != '') {
                $("#ddldistrict").val($("#hdndistrictid").val());   
            }
            
        }
    });

}
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;

    return true;
}