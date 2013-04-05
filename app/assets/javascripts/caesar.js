// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

// # We need to wait for the DOM to be loaded so we wrap our AJAX call in a
// # jQuery call that's the equivalent of document.ready()


var data;
var data2;
var grid;
var dataView;
var columns;
var options;
var handsontable;

columns = [
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

options = {
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

function requiredFieldValidator(value) {
  if (value == null || value == undefined || !value.length) return {valid: false, msg: "This is a required field"};
  else return {valid: true, msg: null};
}

function myFilter(item, args) {
	//console.log(args);
	if (!args) return true;

	for (i = 0; i < args.length; i++) {
		if (item["title"].toLowerCase().indexOf(args[i].toLowerCase()) != -1) {
        found = true;
    } else {
        found = false;
        break;
    }
	}

	return found;
  // if (args != "" && item["title"].toLowerCase().indexOf(args) == -1) { return false; }
  // return true;
}

// function gridFilter (rec, args) {
// 	console.log(args);
//   var found;
//   //gridSearchList = args;
  
//   for (i = 0; i < gridSearchList.length; i += 1) {
//       found = false;
//       $.each(rec, function(obj, objValue) {
//           if (typeof objValue !== 'undefined' && objValue != null 
//           && objValue.toString().toLowerCase().indexOf(gridSearchList[i]) != -1) {
//               found = true;
//               return false; //this breaks the $.each loop
//           }
//       });
//       if (!found) { return false; }
//   }

//   return true;
// }


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

/*
jQuery(function() {

	hideGrid();
	dataView = new Slick.Data.DataView();
	grid = new Slick.Grid("#myGrid", dataView, columns, options);
	grid.setSelectionModel(new Slick.RowSelectionModel());
	
	var pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));
 	var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);

	jQuery.getJSON('courses', function(resp) {
  		data = convertDays(resp);
  		
  		for (var i = 0; i < data.length; i++) {
  			if (!data[i]['title']) data.splice(i,i);
  		}

    	dataView.beginUpdate();
    	dataView.setItems(data);
    	dataView.endUpdate();
    	dataView.setFilter(myFilter);
    	grid.setColumns(columns);
    	unhideGrid();
	});

	grid.registerPlugin(new Slick.AutoTooltips());
	dataView.onRowCountChanged.subscribe(function (e, args) { grid.updateRowCount(); grid.render(); });
	dataView.onRowsChanged.subscribe(function (e, args) { grid.invalidateRows(args.rows); grid.render(); });
	
	grid.onCellChange.subscribe(function (e, args) { dataView.updateItem(args.item.id, args.item); });

	var sortcol = "title";
	var sortdir = 1;
	function comparer(a, b) { var x = a[sortcol], y = b[sortcol]; return (x == y ? 0 : (x > y ? 1 : -1)); }
	grid.onSort.subscribe(function (e, args) {
	  sortdir = args.sortAsc ? 1 : -1;
	  sortcol = args.sortCol.field;

	  if ($.browser.msie && $.browser.version <= 8) {
	    dataView.fastSort(sortcol, args.sortAsc);
	  } else {
	    dataView.sort(comparer, args.sortAsc);
	  }
	});

	grid.onKeyDown.subscribe(function (e) {
	  if (e.which != 65 || !e.ctrlKey) return false; // select all rows on ctrl-a
	  var rows = []; for (var i = 0; i < dataView.getLength(); i++) rows.push(i);
	  grid.setSelectedRows(rows);
	  e.preventDefault();
	});

	$('#search').keyup(function(e) {
		if (e.which == 27) { this.value = ""; } // clear on Esc
  	var gridSearchList = $.trim(this.value.toLowerCase()).split(' ');
  	//console.log("gridSearchList: " + gridSearchList);
  	dataView.setFilterArgs(gridSearchList);
  	dataView.refresh();
  	grid.invalidate();
  	// grid.render();

  	this.focus();
	});

});

*/
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

	handsontable = $("#exampleGrid").data('handsontable');

	$.ajax({
		url: "courses", //https://dl.dropbox.com/u/2623300/courses.json
		dataType: 'json',
		type: 'GET',
		success: function (res) {
			//console.log(res);
			data = res;
			data2 = [];
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
			//$console.text('Data loaded');
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