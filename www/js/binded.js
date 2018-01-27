var Users = function () {
    grid = null;
    responseUsers = [];
    return {
		init: function() {
		    grid = new Datatable();

		    var url = "/auth/bind?id=" + $("#user_id").val() + "&level=" + $("#level").val();

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
		                url: url,
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



jQuery(document).ready(function () {

    Users.init();
    Users.bindEvents();


});