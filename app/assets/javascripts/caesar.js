// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

// # We need to wait for the DOM to be loaded so we wrap our AJAX call in a
// # jQuery call that's the equivalent of document.ready()

var data;
var grid;
var dataView;
var columns;
var options;

columns = [
	{name: "id", field: "unique_id", sortable: true},
	{name: "subject", field: "subject", sortable: true},
	{name: "number", field: "number", sortable: true},
	{name: "section", field: "section", sortable: true},
	{name: "title", field: "title", sortable: true},
	{name: "instructor", field: "instructor", sortable: true},
	{name: "days", field: "days", sortable: true},
	{name: "start", field: "start", sortable: true},
	{name: "end", field: "end", sortable: true},
	{name: "room", field: "room", sortable: true},
	{name: "status", field: "status", sortable: true},	
];

options = {
  editable: true,
  enableAddRow: false,
  enableCellNavigation: true,
  enableColumnReorder: false,
  forceFitColumns: false,
  asyncEditorLoading: false,
  autoEdit: false
  //autoHeight:true,
};

function hideGrid() { $("#loadGrid").removeClass("hide"); }
function unhideGrid() { $("#loadGrid").addClass("hide"); $("#myGrid").removeClass("hide"); }

function comparer(a, b) { var x = a[sortcol], y = b[sortcol]; return (x == y ? 0 : (x > y ? 1 : -1)); }

// function gridFilter (rec, args) {
//   var found;
//   console.log(args);

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
	}
	return resp;
}

jQuery(function() {
	//showGrid();
	hideGrid();
  dataView = new Slick.Data.DataView();
  grid = new Slick.Grid("#myGrid", dataView, columns, options);

  jQuery.getJSON('courses', function(resp) {
  	data = convertDays(resp);

    dataView.beginUpdate();
    dataView.setItems(data);
    dataView.endUpdate();

    unhideGrid();

  });

	dataView.onRowCountChanged.subscribe(function (e, args) {
	  grid.updateRowCount();
	  grid.render();
	});

	dataView.onRowsChanged.subscribe(function (e, args) {
	  grid.invalidateRows(args.rows);
	  grid.render();
	});    

	grid.onSort.subscribe(function (e, args) {
		console.log(args);
	  sortcol = args.sortCol.field;
	  dataView.sort(comparer, args.sortAsc);
	});


	// $('#search').keyup(function(e) {
	// 	if (e.which == 27) { this.value = ""; } // clear on Esc

	//   var gridSearchList = $.trim(this.value.toLowerCase()).split(' ');
	//   dataView.setFilter(gridFilter);
	//   dataView.setFilterArgs(gridSearchList);
	//   slickGrid.invalidate();
	//   this.focus();

	// });	
	
});

// $('#search').keyup(function(e) { console.log(this.value); });
