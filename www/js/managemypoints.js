$.main = {
    gameid: '07FE02E9-5BA8-4BD1-8F72-B1DD4336418C',
    userid: $("#userid").val(),
    selectedTransferables:[]
}
$(document).ready(function () {

    Main.init();
    Main.getBalance();
    
    $("#tRefresh").click(
        (e) => {

            e.preventDefault();

            console.log("refresh");
            Main.reloadTable();

        }

    );


    $("#selectallT").click(function () {

            $(this).checked = !this.checked;

            if (!$(this).checked) {


                $.main.selectedTransferables = [];
            }

            $('#transferables tbody tr td input[type="checkbox"]').each(
                function (a, chkbox) {
                    chkbox.checked = !chkbox.checked

                    if (chkbox.checked) {

                        $.main.selectedTransferables.push(chkbox.value);

                    }

                }
            )

    });


    $("#cancelTransfer").click(() => Main.oncancel());

    $.validator.setDefaults({
        submitHandler: function (e) {
            
            Main.ontransferclick(e);
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

    $('#transferables tbody').on('click', 'tr', function () {

        $(this).toggleClass('selected');

        var checkbox = $(this)[0].firstChild.firstChild;

        checkbox.checked = !checkbox.checked;


        $.main.selectedTransferables.push(checkbox.value);

    });
    
});

var Main = function (data) {
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
                    "info": false,
                }
            });



        },

        reloadTable: function () {

            grid.getDataTable().ajax.url(url).load();

        },

        
        getBalance: function () {
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
                
                $("#form1").validate(Main.validate(d.pointuser,d.pin)); 

                });


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
                        number: "  Please enter number only"
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
                    Main.reloadTable();

                    Main.getBalance();
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

                        Main.reloadTable();

                        Main.getBalance();
                    });

            }
            catch (e) {

                console.log(e);

            }

        }
    }

}($.main);