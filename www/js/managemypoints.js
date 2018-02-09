
$(document).ready(function () {

    Main.init();

    $("#tRefresh").click(
        (e) => {

            e.preventDefault();

            console.log("refresh");
            Main.reloadTable();

        }

    );
});

var Main = function () {
    grid = null;
    data = {
        gameid: '07FE02E9-5BA8-4BD1-8F72-B1DD4336418C',
        userid: $("#userid").val()

    };
    url = '/games/gettransferable?userid='+data.userid+'&gameid=' + data.gameid;
    responseUsers = [];
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

                        url:url,
                        data: null,
                        dataSrc: function (response) {
                            console.log(response)
                            responseUsers = response.data;
                            return response;

                        }
                    },
                    "columnDefs": [{
                        "searchable": false,
                        "orderable": false,
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

        }

    }

}();