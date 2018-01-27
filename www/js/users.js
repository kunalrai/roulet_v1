var Users = function () {
    grid = null;
    responseUsers = [];
    return {
		init: function() {
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
                     { "data": "access_level" },
                     { "data": "null" }
		            ],
		            ajax: {
		                url: "/auth/list?level=0",
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

		    var t = grid.getDataTable();
		    var drowElem = this.drowtableElements;


		    grid.getTable().on('draw.dt', function () {
		        drowElem(t);
		    });

		},
		drowtableElements: function (t) {

		    if (!t) {
		        return;
		    }


		    var isAutorized = $.Auth.isAutorized();

		    if (isAutorized) {

		       t.column(3).nodes().each(function (cell, i) {

		         var user = responseUsers[i];
		         var edit_button = '<a href="/users/_update_user?id=' + user["id"] + '" class="btn btn-sm btn-circle btn-default btn-editable"><i class="fa fa-edit"></i></a>';
		         var disable_button = '<a href="#" class="btn btn-sm btn-circle btn-default btn-editable delete" data-id="' + user["id"] + '"><i class="fa fa-close"></i></a>';
		         cell.innerHTML = edit_button + disable_button;

		       });

		    }  

		},
		reloadTable: function () {

		    grid.getDataTable().ajax.url("/auth/list").load();

		},
		bindEvents: function () {

		    $("#users-table").on("click", "a.delete", function (event) {

		        event.preventDefault();

		        var button = $(this);

		        var id = button.attr("data-id");

		        var data = {
                    id: id
		        }

		        $("#ajax").modal("show");

		        $.ajax({
		            type: "POST",
		            beforeSend: function (request) {
		                request.setRequestHeader("_Autorize", $.Auth.getAuthCookie());
		            },
		            url: "/auth/delete/",
		            data: JSON.stringify(data)

		        }).done(function () {

		            $("#ajax").modal("hide");
		            Users.reloadTable();

		        });

		    });
	
	

		}
	}

}();

var Main = function () {
    grid = null;
    responseUsers = [];
    return {
        init: function () {
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
                     { "data": "access_level" },
                     { "data": "null" }
                    ],
                    ajax: {
                        url: "/auth/list?level=1",
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

            var t = grid.getDataTable();
            var drowElem = this.drowtableElements;


            grid.getTable().on('draw.dt', function () {
                drowElem(t);
            });

        },
        drowtableElements: function (t) {

            if (!t) {
                return;
            }


            var isAutorized = $.Auth.isAutorized();

            if (isAutorized) {

                t.column(3).nodes().each(function (cell, i) {

                    var user = responseUsers[i];
                    var edit_button = '<a href="/users/_update_main?id=' + user["id"] + '" class="btn btn-sm btn-circle btn-default btn-editable"><i class="fa fa-edit"></i></a>';
                    var binded_button = '<a href="/users/_binded?id=' + user["id"] + '&level=0" class="btn btn-sm btn-circle btn-default btn-editable"><i class="fa fa-user"></i></a>';
                    var disable_button = '<a href="#" class="btn btn-sm btn-circle btn-default btn-editable delete" data-id="' + user["id"] + '"><i class="fa fa-close"></i></a>';
                    cell.innerHTML = binded_button + edit_button + disable_button;

                });

            }

        },
        reloadTable: function () {

            grid.getDataTable().ajax.url("/auth/list").load();

        },
        bindEvents: function () {

            $("#mains-table").on("click", "a.delete", function (event) {

                event.preventDefault();

                var button = $(this);

                var id = button.attr("data-id");

                var data = {
                    id: id
                }

                $("#ajax").modal("show");

                $.ajax({
                    type: "POST",
                    beforeSend: function (request) {
                        request.setRequestHeader("_Autorize", $.Auth.getAuthCookie());
                    },
                    url: "/auth/delete/",
                    data: JSON.stringify(data)

                }).done(function () {

                    $("#ajax").modal("hide");
                    Users.reloadTable();

                });

            });



        }
    }

}();

var Managers = function () {
    grid = null;
    responseUsers = [];
    return {
        init: function () {
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
                     { "data": "access_level" },
                     { "data": "null" }
                    ],
                    ajax: {
                        url: "/auth/list?level=2",
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

            var t = grid.getDataTable();
            var drowElem = this.drowtableElements;


            grid.getTable().on('draw.dt', function () {
                drowElem(t);
            });

        },
        drowtableElements: function (t) {

            if (!t) {
                return;
            }


            var isAutorized = $.Auth.isAutorized();

            if (isAutorized) {

                t.column(3).nodes().each(function (cell, i) {

                    var user = responseUsers[i];
                    var edit_button = '<a href="/users/_update?id=' + user["id"] + '" class="btn btn-sm btn-circle btn-default btn-editable"><i class="fa fa-edit"></i></a>';
                    var binded_button = '<a href="/users/_binded?id=' + user["id"] + '&level=1" class="btn btn-sm btn-circle btn-default btn-editable"><i class="fa fa-user"></i></a>';
                    var disable_button = '<a href="#" class="btn btn-sm btn-circle btn-default btn-editable delete" data-id="' + user["id"] + '"><i class="fa fa-close"></i></a>';
                    cell.innerHTML = binded_button + edit_button + disable_button;

                });

            }

        },
        reloadTable: function () {

            grid.getDataTable().ajax.url("/auth/list").load();

        },
        bindEvents: function () {

            $("#mains-table").on("click", "a.delete", function (event) {

                event.preventDefault();

                var button = $(this);

                var id = button.attr("data-id");

                var data = {
                    id: id
                }

                $("#ajax").modal("show");

                $.ajax({
                    type: "POST",
                    beforeSend: function (request) {
                        request.setRequestHeader("_Autorize", $.Auth.getAuthCookie());
                    },
                    url: "/auth/delete/",
                    data: JSON.stringify(data)

                }).done(function () {

                    $("#ajax").modal("hide");
                    Users.reloadTable();

                });

            });



        }
    }

}();

jQuery(document).ready(function () {

    Users.init();
    Users.bindEvents();
    Main.init();
    Main.bindEvents();
    Managers.init();
    Managers.bindEvents();

});