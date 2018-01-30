﻿var Users = function () {
    grid = null;
    responseUsers = [];
    return {
        init: function (state,district) {
            grid = new Datatable();
            grid.init({
                src: $("#users-table"),
                onSuccess: function (e) { },
                onError: function (e) { },
                loadingMessage: "Loading...",
                dataTable: {
                    "columns": [
                        { "data": "name" },
                        { "data": "email" },
                        { "data": "ManagerName" },
                        { "data": "Main" },
                        { "data": "current_bal" },
                        {
                            "data": "null",
                            render: function (data, type, row) {
                                return '<input class="form-control" id="allotpoints_u'+row.id+'" name="allotpoints_u" type="text"  value =""  >';
                            }
                        },
                        {
                            "data": "null",
                            render: (data, type, row) => {

                                return '<button class="btn btn-default" data-id=' + row.id + '>Allot Points</button>';
                            }
                        }
                    ],
                    ajax: {
                        url: "/auth/filter?state=" + state + "&districtid=" + district + "&access_level=0",
                        data: null,
                        dataSrc: function (response) {
                            console.log(response)
                            responseUsers = response.data;
                            return response.data;

                        }
                    },
                    "columnDefs": [{
                        "searchable": false,
                        "orderable": false,
                        "targets": 0
                    }],
                }
            });

           

        },
       
        reloadTable: function (state, district) {

            grid.getDataTable().ajax.url("/auth/filter?state=" + state + "&districtid=" + district + "&access_level=0").load();

        },
        bindEvents: function (access_level) {
            $("#users-table").on("click", "button", function (event) {
                bindEventsCommon.call(this, "u", access_level);

            });

            

        }
    }

}();

var Main = function () {
    grid = null;
    access_level = 1;
    responseUsers = [];
    return {
        init: function (state, district) {
            grid = new Datatable();
            grid.init({
                src: $("#mains-table"),
                onSuccess: function (e) { },
                onError: function (e) { },
                loadingMessage: "Loading...",
                dataTable: {
                    "columns": [
                        { "data": "name" },
                        { "data": "email" },
                        { "data": "ManagerName" },
                        { "data": "current_bal" },
                        {
                            "data": "null",
                            render: function (data, type, row) {
                                return '<input class="form-control" id="allotpoints_m' + row.id + '"  type="text"  value =""  >';
                            }
                        },
                        {
                            "data": "null",
                            render: (data, type, row) => {

                                return '<button class="btn btn-default"  data-id=' + row.id + '>Allot Points</button>';
                            }
                        }
                    ],
                    ajax: {
                        url: "/auth/filter?state=" + state + "&districtid=" + district + "&access_level=1",
                        data: null,
                        dataSrc: function (response) {
                            console.log(response)
                            responseUsers = response.data;
                            return response.data;

                        }
                    },
                    "columnDefs": [{
                        "searchable": false,
                        "orderable": false,
                        "targets": 0
                    }],
                }
            });

           

        },
       
        reloadTable: function (state,district) {

            grid.getDataTable().ajax.url("/auth/filter?state=" + state + "&districtid=" + district + "&access_level=1").load();

        },
        bindEvents: function (access_level) {

           

            $("#mains-table").on("click", "button", function (event) {

                bindEventsCommon.call(this, "m",access_level);
                 

            });



        }
    }

}();

function bindEventsCommon(el,access_level) {

    var button = $(this);
    var id = button.attr("data-id");

    var data = {
        id: id
    }

    var isAutorized = $.Auth.isAutorized();

    let points = $("#allotpoints_"+el + data.id).val(), cr = 0, dr = 0;
    if (points > 0) {
        cr = points;
    }
    else {
        dr = points * -1;
    }
    if (isAutorized) {
        $.ajax({
            type: "POST",
            beforeSend: function (request) {
                request.setRequestHeader("_Autorize", $.Auth.getAuthCookie());
            },
            url: '/users/createledger?userid=' + data.id + '&credit=' + cr + '&debit=' + dr + '&access_level=' + access_level+'',
            data: JSON.stringify(data)

        }).done(function () {

            $("#ajax").modal("hide");
            if (el == "u") {
                var stateid = $("#ddstate_u").val();
                var district = $("#ddldistrict_u").val();
                Users.init(stateid, district);
                Users.reloadTable(stateid, district);
            }
            else if (el == "m") {
                var stateid = $("#ddstate_m").val();
                var district = $("#ddldistrict_m").val();
                Main.init(stateid, district);
                Main.reloadTable(stateid, district);
            }
            else if (el == "am") {
                var stateid = $("#ddstate").val();
                var district = $("#ddldistrict").val();
                AreaManager.init(stateid, district);
                AreaManager.reload(stateid, district);
            }

        });
    }

}

var AreaManager = function () {
    grid = null;
    responseUsers = [];
    return {

        init: function (state, district) {
            grid = new Datatable();
            grid.init({
                src: $("#managers-table"),
                onSuccess: function (e) { },
                onError: function (e) { },
                loadingMessage: "Loading...",
                dataTable: {
                    "columns": [
                        { "data": "name" },
                        { "data": "email" },
                        { "data": "current_bal" },
                        {
                            "data": "null",
                            render: function (data, type, row) {
                                return '<input class="form-control" id="allotpoints_am'+ row.id+'"  type="text"  value =""  >';
                            }
                        },
                        {
                            "data": "null",
                            render: (data, type, row) => {

                                return '<button class="btn btn-default" data-id='+ row.id +'>Allot Points</button>';
                            }
                        }
                        
                    ],
                    ajax: {
                        url: "/auth/filter?state=" + state + "&districtid=" + district + "&access_level=2",
                        data: null,
                        dataSrc: function (response) {
                            console.log(response)
                            responseUsers = response.data;
                            return response.data;

                        }
                    },
                    "columnDefs": [{
                        "searchable": false,
                        "orderable": false,
                        "targets": 0
                    }],
                }
            });


            grid.getDataTable().ajax.url("/auth/filter?state=" + state + "&districtid=" + district + "&access_level=2").load();

            
        },
        reload: function (state,district) {
            grid.getDataTable().ajax.url("/auth/filter?state=" + state + "&districtid=" + district + "&access_level=2").load();

        },
      
        bindEvents: function (access_level) {
            $("#managers-table").on("click", "button", function (event) {
                bindEventsCommon.call(this, "am",access_level);
                
               
            });
        }


    }
}();

jQuery(document).ready(function () {

   
   
    //Main.init();
    //Main.bindEvents();
    //Managers.init();
    //Managers.bindEvents();
    //Area Manager = 2
    //Main ==1
    //User == 0
    
 


    onStateChange("ddstate", "ddldistrict");
    onStateChange("ddstate_m", "ddldistrict_m");
    onStateChange("ddstate_u", "ddldistrict_u");


    $("#ddldistrict").change(function () {

        var stateid = $("#ddstate").val();
        var distictid = this.selectedOptions[0].value

        AreaManager.init(stateid, distictid);
       
    })

    $("#ddldistrict_u").change(function () {


        var stateid = $("#ddstate_u").val();
        var distictid = this.selectedOptions[0].value
        Users.init(stateid, distictid);
        filter(stateid, distictid,2, "area_manger_user");

        filter(stateid, distictid, 1, "main_user");
        Users.reloadTable(stateid, distictid);
    });


    $("#ddldistrict_m").change(function () {


        var stateid = $("#ddstate_m").val();
        var distictid = this.selectedOptions[0].value
        Main.init(stateid, distictid);
        filter(stateid, distictid, 2, "area_manger_main");
        Main.reloadTable(stateid, distictid);

    });

    AreaManager.bindEvents(2);
    Users.bindEvents(0);
    Main.bindEvents(1);
});

function onStateChange(element,districtElement) {
    var hashelement = "#" + element;
    $(hashelement).change(function () {

        BindDistrict($(hashelement).val(), districtElement)

    })

}

function BindDistrict(stateid,districtElement) {
    var data = {
        stateid: stateid
    }
    $.ajax({
        type: "POST",
        url: "/auth/GetDistrict/",
        data: JSON.stringify(data),
        success: function (response) {
            $("#" + districtElement).html("");
            $("#" + districtElement).append("<option value=\"0\">--Select District--</option>")
            $.each(response, function (i, v) {
                $("#" + districtElement).append("<option value=" + v.Value + ">" + v.Text + "</option>")
            })
            if ($("#hdndistrictid").val() != undefined && $("#hdndistrictid").val() != '') {
                $("#" + districtElement).val($("#hdndistrictid").val());
            }

        }
    });

}


function BindManager(level,element,hdnElement) {
    $.ajax({
        type: "GET",
        url: "/auth/list?level=" + level,
        dataType: 'json',
        contentType: "application/json",
        success: function (response) {

            var responseJson = response.data;

            if ((responseJson) && (responseJson.length > 0)) {

                var optionsHtml = "<option></option>";

                for (var i = 0; i < responseJson.length; i++) {

                    optionsHtml += "<option value='" + responseJson[i]["id"] + "'>" + responseJson[i]["name"] + "</option>";

                }

                $("#" + element).html(optionsHtml);

                Select($("#" + hdnElement), $("#" + element));

            }

        }
    });
}

function filter(state, district, level,element) {

    $.ajax({
        type: "GET",
        url: "/auth/filter?state=" + state + "&districtid=" + district + "&access_level="+ level,
        dataType: 'json',
        contentType: "application/json",
        success: function (response) {

            var responseJson = response.data;

            if ((responseJson) && (responseJson.length > 0)) {

                var optionsHtml = "<option></option>";

                for (var i = 0; i < responseJson.length; i++) {

                    optionsHtml += "<option value='" + responseJson[i]["id"] + "'>" + responseJson[i]["name"] + "</option>";

                }

                $("#" + element).html(optionsHtml);

            }

        }
    });
}

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



