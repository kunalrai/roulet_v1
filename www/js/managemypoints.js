$.main = {
    gameid: '07FE02E9-5BA8-4BD1-8F72-B1DD4336418C',
    userid: $("#userid").val(),
    selectedTransferables: [],
    selectedreceivables:[],
}




$(document).ready(function () {

   Tranferables.init();
    User.getBalance();

    Receivables.init();
    
    $("#tRefresh").click(
        (e) => {

            e.preventDefault();

            console.log("refresh");
            Tranferables.reloadTable();

        }

    );

    $("#btnRecRefresh").click(
        (e) => {

            e.preventDefault();

            console.log("refresh");
            Receivables.reloadTable();

        }

    );


    $("#selectallT").click(function () {

        $.main.selectedTransferables = CommonFunctions.selectAll('transferables', $.main.selectedTransferables);

        console.log($.main.selectedTransferables);
    });

    $("#selectAllR").click(function () {

        $.main.selectedreceivables = CommonFunctions.selectAll('receivables', $.main.selectedreceivables);

        console.log($.main.selectedreceivables);
    });
    

    $("#cancelTransfer").click(() => Tranferables.oncancel());


    $("#receive").click(() => Receivables.onreceive());

    $("#reject").click(() => Receivables.onreject());

    $.validator.setDefaults({
        submitHandler: function (e) {
            
            Tranferables.ontransferclick(e);
        }
    });    
    $.validator.methods.equalTo= function( value, element, param) {

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



    CommonFunctions.rowClick('transferables', $.main.selectedTransferables)

    CommonFunctions.rowClick('receivables', $.main.selectedreceivables)
});

var CommonFunctions = CommonFunctions || {};

CommonFunctions.rowClick = function (table_name,main_arr) {

    $('#' + table_name+' tbody').on('click', 'tr', function () {


        var checkbox = $(this)[0].firstChild.firstChild;

        checkbox.checked = !checkbox.checked;


        $(this).toggleClass("selected", checkbox.checked );


        if (checkbox.checked && !main_arr.includes(checkbox.value)) {

           
            main_arr.push(checkbox.value);


        }
        else if (!checkbox.checked) {

               main_arr.splice(main_arr.findIndex((x) => x == checkbox.value), 1);

        }


        console.log(main_arr);
  

       

    });
}

CommonFunctions.selectAll = function (table_name,main_arr) {

    $(this).checked = !this.checked;

    if (!$(this).checked) {

       main_arr = [];
    }

    $('#' + table_name + ' tbody tr td input[type="checkbox"]').each(
        function (a, chkbox) {

            chkbox.checked = !chkbox.checked

            if (chkbox.checked) {

                main_arr.push(chkbox.value);

            }

        }

    );
    console.log(main_arr);

    return main_arr;
}

var User = User ||
    {};

User.getBalance= function () {
    var data = {
        id: $("#userid").val()
    }
    $.ajax({
        type: "POST",
        url: "/user/get/",
        data: JSON.stringify(data),
        success: function (response) {
            if (response) {

                $("#pointbalance").text(response.pointuser);
            }

        }
    }).then(function (d) {
        console.log(d.pin);

        $("#form1").validate(Tranferables.validate(d.pointuser, d.pin));

    });


}


var Tranferables = function (data) {
    var grid = null;
    
    var url = '/games/gettransferable?userid='+data.userid+'&gameid=' + data.gameid;
    var responseUsers = [];
    
    return {


        init: function () {
            grid = new Datatable();
            grid.init({
                src: $("#transferables"),
                onSuccess: function (e) { },
                onError: function (e) { },
                loadingMessage: "Loading...",
                dataTable: {
                    "columns": [
                        {
                            
                            "data": "null",
                            render: (data, type, row) => {

                                return '<input type="checkbox" class="btn btn-default" id="' + row.id + '" value="' +row.id+  '" />';
                            }
                        },
                        {
                            "title":"To Member Id",
                            "data": "to_member_id"
                        },
                        { "data": "amount" },


                    ],
                    ajax: {

                        url: url,
                        data: null,
                        dataSrc: function (response) {
                            console.log(response)
                            responseUsers = response.data;
                            return response;

                        }
                    },
                    "columnDefs": [{
                        "searchable": true,
                        "orderable": true,
                        "targets": 0,

                    }],
                    "order": [[1, 'asc']],
                    "paging": false,
                    "ordering": false,
                    "info": false,
                }
            });



        },

        reloadTable: function () {

            grid.getDataTable().ajax.url(url).load();

        },

        
       
       
        validate: function (bal,pin) {

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
                    toaccountno: {
                        required: " (required)",
                        
                    },
                    amount: {
                        required: " (required)",
                        number: "  Please enter number only",
                        min: (bal == 0) ? "  Balance Insufficient" : "  Please enter minimum 1 points",
                        range: (bal == 0) ? "  Balance Insufficient" : "  Please enter a value between 0 and " + bal+".",
                    },
                    pin: {
                        required: " (required)",
                        equalTo:"  Please enter correct pin"
                    }

                },
                rules: {
                    amount: {
                        required: true,
                        number: true,
                        range: [0, bal],
                        min:1
                    },
                    pin: {
                        equalTo: pin
                    }
                }
            }
        },


        ontransferclick: function (e) {

            try {
             

                var data = {
                    from_member_id: $.main.userid,
                    gameid: $.main.gameid,
                to_member_id: $("#toaccountno").val(),
                amount:$("#amount").val()
            }
            $.ajax({
                type: "POST",
                url: " /games/savetransferable",
                data: JSON.stringify(data),

            })
                .then(function (d) {

                    console.log(d);
                    Tranferables.reloadTable();

                    User.getBalance();

                   // window.location.reload();
                });

            }
            catch (ex) {
                console.log(ex);
            }
                      console.log("transfer");
            
           
            

        },

        oncancel: function () {

            try {

                var data = {
                    from_member_id: $.main.userid,
                    gameid: $.main.gameid,
                    ids: $.main.selectedTransferables.join(','),
                }

                $.ajax({
                    type: "POST",
                    url: " /games/canceltransfer",
                    data: JSON.stringify(data),

                })
                    .then(function (d) {

                        Tranferables.reloadTable();

                        User.getBalance();
                    });

            }
            catch (e) {

                console.log(e);

            }

        }
    }

}($.main);



var Receivables = function (data) {
    var grid = null;

    var url = '/games/getreceivables?userid=' + data.userid + '&gameid=' + data.gameid;
    var responseUsers = [];

    return {
        init: function () {
            grid = $('#receivables').DataTable({
                "paging": false,
                "ordering": false,
                "info": false,
                loadingMessage: "Loading...",
                searching: false,
                ajax: {

                    url: url,
                    data: null,
                    dataSrc: function (response) {

                        console.log(response)

                        responseUsers = response.data;

                        return response;

                    }
                }, "columns": [
                    {

                        "data": "null",
                        render: (data, type, row) => {

                            return '<input type="checkbox" class="btn btn-default" id="' + row.id + '" value="' + row.id + '" />';
                        }
                    },
                    {

                        "data": "from_member_id"
                    },
                    { "data": "amount" },


                ],
            });

        },

        reloadTable: function () {

            grid.ajax.url(url).load();

        },

 
        onreceive: function () {

            try {

                var data = {
                    to_member_id: $.main.userid,
                    gameid: $.main.gameid,
                    ids: $.main.selectedreceivables.join(','),
                }

                $.ajax({
                    type: "POST",
                    url: " /games/receivetransferred",
                    data: JSON.stringify(data),

                })
                    .then(function (d) {

                        Receivables.reloadTable();

                        User.getBalance();
                    });

            }
            catch (e) {

                console.log(e);

            }
        },

        onreject: function () { }

    }

}($.main);

