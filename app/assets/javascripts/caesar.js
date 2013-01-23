// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

// # We need to wait for the DOM to be loaded so we wrap our AJAX call in a
// # jQuery call that's the equivalent of document.ready()

var data2;

jQuery(function() {

	var columns = [
		{name: "id", field: "unique_id"},
		{name: "subject", field: "subject"},
		{name: "number", field: "number"},
		{name: "section", field: "section"},
		{name: "title", field: "title"},
		{name: "instructor", field: "instructor"},
		{name: "days", field: "days"},
		{name: "start", field: "start"},
		{name: "end", field: "end"},
		{name: "room", field: "room"},
		{name: "status", field: "status"},	
	];

	var options = {
	  editable: true,
	  enableAddRow: false,
	  enableCellNavigation: true,
	  enableColumnReorder: false
	};

  jQuery.getJSON('http://localhost:3000/courses', function(data) {
  	
  	for (var i = 0; i < data.length; i++) {
  		days = "";
  		days += data[i].M ? "M" : "";
  		days += data[i].T ? "T" : "";
  		days += data[i].W ? "W" : "";
  		days += data[i].R ? "R" : "";
  		days += data[i].F ? "F" : "";
  		data[i].days = days
  		if (data[i].days == "") data[i].days = "TBA";
  	}
    grid = new Slick.Grid("#myGrid", data, columns, options);
  });

});