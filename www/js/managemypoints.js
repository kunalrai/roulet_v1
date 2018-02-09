
$(document).ready(function () {

    Main.init();
    Main.bindEvents();
    
    $("#tRefresh").click(
        (e) => {

            e.preventDefault();

            console.log("refresh");
            Main.reloadTable();

        }

    );

    $.validator.setDefaults({
        submitHandler: function () {
            Main.ontransferclick();
        }
    });
   
    
});

var Main = function () {
    var grid = null;
    var data = {
        gameid: '07FE02E9-5BA8-4BD1-8F72-B1DD4336418C',
        userid: $("#userid").val()

    };
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

                                return '<input type="checkbox" class="btn btn-default" value=' + row.id + '/>';
                            }
                        },
                        { "data": "to_member_id" },
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
                    "info": false
                }
            });



        },

        reloadTable: function () {

            grid.getDataTable().ajax.url(url).load();

        },

        ontransferclick: function (e) {


            console.log("transfer");





        },
        bindEvents: function () {
            var data = {
                id: $("#userid").val()
            }
            $.ajax({
                type: "POST",
                url: "/user/get/",
                data: JSON.stringify(data),
                success: function (response) {
                    if (response) {

                        this.currentBalance = response.pointuser;

                        $("#pointbalance").text(response.pointuser);




                    }

                }
            }).then(function (d) {
                //console.log(d);
                $("#form1").validate(Main.validate(d.pointuser)); 

                });


        },
        currentBalance: 0,
        validate: function (bal) {

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
                    toaccountno: this.required,
                    amount: {
                        required: " (required)",
                        number: "  Please enter number only"
                    },
                    pin: {

                    }

                },
                rules: {
                    amount: {
                        required: true,
                        number: true,
                        range: [0,bal]
                    }
                }
            }
        }
    }

}();