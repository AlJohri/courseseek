// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

// # We need to wait for the DOM to be loaded so we wrap our AJAX call in a
// # jQuery call that's the equivalent of document.ready()

var data;

var columns = [
	{id: "id", name: "id", field: "unique_id", sortable: true, width: 50, headerCssClass: null, editor: Slick.Editors.Text},
	{id: "subject", name: "subject", field: "subject", sortable: true, width: 80, headerCssClass: null, editor: Slick.Editors.Text},
	{id: "name", name: "number", field: "number", sortable: true, width: 50, headerCssClass: null, editor: Slick.Editors.Text},
	{id: "section", name: "section", field: "section", sortable: true, width: 25, headerCssClass: null, editor: Slick.Editors.Text},
	{id: "title", name: "title", field: "title", sortable: true, width: 300, headerCssClass: null, editor: Slick.Editors.Text},
	{id: "instructor", name: "instructor", field: "instructor", sortable: true, width: 100, headerCssClass: null, editor: Slick.Editors.Text},
	{id: "days", name: "days", field: "days", sortable: true, width: 100, headerCssClass: null, editor: Slick.Editors.Text},
	{id: "start", name: "start", field: "start", sortable: true, width: 50, headerCssClass: null, editor: Slick.Editors.Text},
	{id: "end", name: "end", field: "end", sortable: true, width: 50, headerCssClass: null, editor: Slick.Editors.Text},
	{id: "room", name: "room", field: "room", sortable: true, width: 50, headerCssClass: null, editor: Slick.Editors.Text},
	{id: "status", name: "status", field: "status", sortable: true, width: 50, headerCssClass: null, editor: Slick.Editors.Text},	
	{id: "overview", name: "overview", field: "overview", sortable: true, width: 300, headerCssClass: null, editor: Slick.Editors.Text},	
];

var options = {
  editable: false,
  enableAddRow: false,
  enableCellNavigation: true,
  enableColumnReorder: true,
  forceFitColumns: false,
  asyncEditorLoading: false,
  autoEdit: false,
  autoHeight: false,
  multiColumnSort: false
};

function hideGrid() { $("#loadGrid").removeClass("hide"); }
function unhideGrid() { $("#loadGrid").addClass("hide"); $("#myGrid").removeClass("hide"); }

function convertDays (resp) {
	for (var i = 0; i < resp.length; i++) {
		days = "";
		days += resp[i].M ? "M" : "";
		days += resp[i].T ? "T" : "";
		days += resp[i].W ? "W" : "";
		days += resp[i].R ? "R" : "";
		days += resp[i].F ? "F" : "";
		resp[i].days = days
		if (resp[i].days == "") resp[i].days = "TBA";

		delete resp[i]['M']
		delete resp[i]['T']
		delete resp[i]['W']
		delete resp[i]['R']
		delete resp[i]['F']		
	}
	return resp;
}

/* HandsonTable */

jQuery(function() {

	$("#loadGrid").removeClass("hide");
	$("#exampleGrid").addClass("hide");

	$("#exampleGrid").handsontable({
	  startRows: 8,
	  startCols: 12,
	  rowHeaders: true,
	  colHeaders: true,
	  //minSpareRows: 1,
	  contextMenu: true,
	});

	var handsontable = $("#exampleGrid").data('handsontable');

	$.ajax({
		url: "courses", // https://dl.dropbox.com/u/2623300/courses.json
		dataType: 'json',
		type: 'GET',
		success: function (res) {
			data = res;
			var data2 = [];
			for (i in data) {
				data[i]['overview'] = ""
				var subArray = [];
				for (key in data[i])
					subArray.push(data[i][key]);
				data2.push(subArray);
			}
			handsontable.loadData(data2);
			$("#loadGrid").addClass("hide"); 
			$("#exampleGrid").removeClass("hide");
		}
	});
});























// grid.onSort.subscribe(function (e, args) {
//       var cols = args.sortCols;

//       data.sort(function (dataRow1, dataRow2) {
//         for (var i = 0, l = cols.length; i < l; i++) {
//           var field = cols[i].sortCol.field;
//           var sign = cols[i].sortAsc ? 1 : -1;
//           var value1 = dataRow1[field], value2 = dataRow2[field];
//           var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
//           if (result != 0) {
//             return result;
//           }
//         }
//         return 0;
//       });

//       grid.invalidate();
//       grid.render();
// });



// grid.onSort.subscribe(function (e, args) {
//   var cols = args.sortCols;

//   data.sort(function (dataRow1, dataRow2) {
//     for (var i = 0, l = cols.length; i < l; i++) {
//       var field = cols[i].sortCol.field;
//       var sign = cols[i].sortAsc ? 1 : -1;
//       var value1 = dataRow1[field], value2 = dataRow2[field];
//       var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
//       if (result != 0) {
//         return result;
//       }
//     }
//     return 0;
//   });
//   grid.invalidate();
//   grid.render();
// });



// $('#search').keyup(function(e) { console.log(this.value); });