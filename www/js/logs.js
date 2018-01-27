var Logs = function () {
    grid = null;
    responseUsers = [];
    return {
        init: function () {

            $('#date').datepicker({
                rtl: App.isRTL(),
                orientation: "left",
                autoclose: true
            });

            var url = Logs.getUrl();

		    grid = new Datatable();
		    grid.init({
		        src: $("#logs-table"),
		        onSuccess: function (e) { },
		        onError: function (e) { },
		        loadingMessage: "Loading...",
		        dataTable: {
		            "columns": [
                     { "data": "name" },
                     { "data": "type" },
                     { "data": "coin" },
                     { "data": "date" }
		            ],
		            ajax: {
		                url: url,
		                data: null,
		                dataSrc: function (response) {

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

		    t.column(3).nodes().each(function (cell, i) {

		        var log = responseUsers[i];

		        var date = new Date(log["date"] * 1000);

		         cell.innerHTML = date.getDate() + "/" + date.getMonth() + "/" + date.getYear();

		    });

		},
		reloadTable: function () {

		    grid.getDataTable().ajax.url(Logs.getUrl()).load();

		},
		getUrl: function () {

		    var date = $('#date').val();

		    if (!date) { 
                
		        var today = new Date();
		        var dd = today.getDate();
		        var mm = today.getMonth() + 1; 
		        var yyyy = today.getFullYear();
		        date = Math.floor(new Date(mm + '/' + dd + '/' + yyyy) / 1000);

		    } else {

		        date = Math.floor(new Date(date) / 1000);

		    }
         
		    var url = "/logs/list?start=" + date;

		    return url;

		},
		bindEvents: function () {

		    $('#date').on("change", function () {

		        Logs.reloadTable();
		    });

		}
	}

}();

jQuery(document).ready(function () {

    Logs.init();
    Logs.bindEvents();

});