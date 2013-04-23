//= require jquery-ui.min
//= require fuse.min
//= require search

/* GLOBALS */
// Note: I'm not sure if it's better style to have these as globals, or put everything 
// (eg. addCourseSelectionTable, addToCart and these two) into $(document).ready

var data;
var CUR_TERM_ID = "4500";
var COURSE_LIST = {};
var SEARCH_RESULT_LIST = {};
var SEARCH_LIST_FROM_NUM = {};


function changeSection() {

}

function makeCalendar() {

	/* Clear Calendar */
	$("#calendar").weekCalendar("clear");
	var colorCounter = 0;
	
	var year = new Date().getFullYear();
	var month = new Date().getMonth();
	var day = getMonday(new Date()).getDate();
				
	for (var k in COURSE_LIST) {
		for (var c in COURSE_LIST[k]) {
			course = COURSE_LIST[k][c];
			if (course.onoff == true) {
				
				var days = [course.M, course.T, course.W, course.R, course.F];
	
				/* Create Events */
				for (var j = 0; j < 5; j++) {
					if (days[j] == "t") {
						var calEvent = { 
							"unique_id" : course.unique_id,
							"colorid" : colorCounter,
							"start" : new Date(year + '-' + (month+1) + '-' + (day + j) + ' ' + course.start.match(/(\d+:\d+)(\w+)/)[1] + ' ' + course.start.match(/(\d+:\d+)(\w+)/)[2]),
							"end" : new Date(year + '-' + (month+1) + '-' + (day + j) + ' ' + course.end.match(/(\d+:\d+)(\w+)/)[1] + ' ' + course.end.match(/(\d+:\d+)(\w+)/)[2]),
							"title" : course.subject + " " + course.number + " " + course.title
						};
						//console.log(calEvent);
						$("#calendar").weekCalendar("updateEvent", calEvent);					
					}
					for (var s in course.sections) {
						var section = course.sections[s];
						//console.log(section);
						if (section.onoff == true) {
							//console.log("TRUE");
							days = [section.M, section.T, section.W, section.R, section.F];
							for (var j = 0; j < 5; j++) {
								if (days[j] == "t") {
									var calEvent = { 
										"unique_id" : section.unique_id,
										"colorid" : colorCounter,
										"start" : new Date(year + '-' + (month+1) + '-' + (day + j) + ' ' + section.start.match(/(\d+:\d+)(\w+)/)[1] + ' ' + section.start.match(/(\d+:\d+)(\w+)/)[2]),
										"end" : new Date(year + '-' + (month+1) + '-' + (day + j) + ' ' + section.end.match(/(\d+:\d+)(\w+)/)[1] + ' ' + section.end.match(/(\d+:\d+)(\w+)/)[2]),
										"title" : section.subject + " " + section.number + " " + section.title
									};
									//console.log(calEvent);
									$("#calendar").weekCalendar("updateEvent", calEvent);					
								}
							}
						}
						break;
					}
				}
				break;
			}
		}
		colorCounter++;
	}
	//$('#calendar').weekCalendar('scrollToHour', '9'); :: make a starting time default to 9 am
}

function getDateStringFromCourse(course){
	var datestring = '';
	if(course.M=='t'){
		datestring += 'M'
	}
	if(course.T=='t'){
		datestring += 'Tu'
	}
	if(course.W=='t'){
		datestring += 'W'
	}
	if(course.R=='t'){
		datestring += 'Th'
	}
	if(course.F=='t'){
		datestring += 'F'
	}
	return datestring;
}

function createSectionString(course){
	return getDateStringFromCourse(course) + ' ' + course.start + "-" + course.end;
}

function addToCart(coursename) {

	// Course gets added to COURSE_LIST
	var key = coursename.toUpperCase();
	if(COURSE_LIST[key] != null) return;
	
	var keySpaceless = coursename.toUpperCase().replace(/\s+/g,'');
	COURSE_LIST[key] = SEARCH_RESULT_LIST[key];

	var addedcoursenotif = document.createElement('div');
	addedcoursenotif.className = "addedCourseButton";
	addedcoursenotif.id = keySpaceless;
	addedcoursenotif.innerHTML += '<div class="removeClass"></div>' + key;

	var coursesections = document.createElement('div');
	coursesections.className = "addedCourseSec";
	var sectionHtml = '';

	// for future
	// http://www.w3schools.com/tags/tag_select.asp
	// 

	//Populate drop down with lecture sections
	sectionHtml += '<div class="LEC">LEC: '+
					'<form><select id="LEClist">';

	for (var i in COURSE_LIST[key]) {
		sectionHtml += '<option>'+ createSectionString(COURSE_LIST[key][i]) + '</option>';
		// if (i == 0){
		// 	newHtml = sectionHtml + '</select></form></div>' + '<div class="DIS">DIS: ' + '<form><select id="DISlist">';
		// 	for (var j in COURSELIST[key][i].sections){
		// 		sectionHtml += '<option>section ' + COURSE_LIST[key][i].sections[j] + '</option>';
		// 	}
		// }
	}

	sectionHtml += '</select></form></div>';

	//Populate drop down with discussion sections
	sectionHtml += '<div class="DIS">SECTION: '+
					'<form><select id="DISlist">';

	for (var j in COURSE_LIST[key][0].sections) {
		sectionHtml += '<option> ' + createSectionString(COURSE_LIST[key][0].sections[j]) + '</option>';
	}


	sectionHtml += '</select></form></div>';
	coursesections.innerHTML = sectionHtml;		

	$("#addedCourses").append(addedcoursenotif);
	$("#addedCourses").append(coursesections);
	
	// console.log((query.toUpperCase()).replace(/\s+/g,''))
	$('#' + keySpaceless).click(function() {
		if($(this).next().is(':hidden')) {					
			$(this).next().slideDown('fast');
		} else {
			$(this).next().slideUp('fast');}			
   
	});

	//Collapse divs on new search
	$("div.addedCourseSec").hide();
	$(':checkbox').iphoneStyle();

	//Remove Class functionality
	$('.removeClass').click(function(){
		delete COURSE_LIST[this.parentNode.id.replace(/([a-zA-Z]+)([\d-]+)/g, '$1 $2')];
		$('#' + this.parentNode.id).next().remove();
		$('#' + this.parentNode.id).remove();
		makeCalendar();
	});	

	$('.courseSection').click(function(){ console.log("tell calendar to turn on " + $(this).text()); });
	$("#search").val("");

	// $("#searchOutput").append(addedcoursenotif);
	// $(':checkbox').iphoneStyle();
	
	// todo: add it to calendar here too?
}

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

var sidebar = false;

$(document).ready(function() {

	// $("#back").click(function() {
	// 	if (!sidebar) {
	// 		$("#container").css("margin-left", "80%");
	// 		sidebar = true;
	// 	}
	// 	else {
	// 		$("#container").css("margin-left", "0");
	// 		sidebar = false;
	// 	}
	// });	

	$("#calendar").addClass("hide");
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) { $("#loadDiv").css("height", "280px"); }
	else { $("#loadDiv").css("height", "428px"); }
	$("#loadDiv").removeClass("hide");	

	$.getJSON('courses', function(resp) { 
		data = resp;
		$("#loadDiv").addClass("hide"); 
		$("#calendar").removeClass("hide");

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) { $("#calendar").css("height", "280px"); }
	else { $("#calendar").css("height", "428px"); }


	});

	// http://www.w3schools.com/html/html_colornames.asp
	colors = ["Aqua", "Aquamarine", "Beige", "Bisque", "BlanchedAlmond", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed ", "Indigo ", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];

	// https://github.com/themouette/jquery-week-calendar/wiki/Public-methods
	// https://github.com/themouette/jquery-week-calendar/wiki/Script-options

	var $calendar = $('#calendar');
  	$calendar.weekCalendar({
  	buttons : false,
    timeslotsPerHour : 2,
    timeslotHeight : 20,
    allowCalEventOverlap : true,
    overlapEventsSeparate: true,
    firstDayOfWeek : 1,
    businessHours : { start: 6, end: 22, limitDisplay: true },
    daysToShow : 5,
    textSize : 10, 
    height : function($calendar) { 

    	/* if one changes user agent model */

    	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) { return 280; }
			else { return 428; }

    	// return 700;
    	// return $(window).height();
    },
    eventRender : function(calEvent, $event) {
    	//console.log($event);
      $event.css("backgroundColor", colors[calEvent.colorid]);
      $event.find(".wc-time, .wc-title").css({
         "backgroundColor" : colors[calEvent.colorid],
         //"border" : "1px solid black",
         "color" : "black"
      });
    }
 	});


	var idcount = 0;

	$("input[type=text]").click(function() { $(this).select(); });
	
	$("#enterbutton").click(function() {
		if ($('#search').val() != '') {
			addToCart(SEARCH_RESULT_LIST[$('.searchResult').html()]);
			makeCalendar();
		}
	});


	function addCourseSelectionTable(classes) {
		//console.log("adding table");
		
		$('.searchResult').remove();
		
		for (var i in classes) {
			var matchingCourse = document.createElement('div');
			matchingCourse.className = "searchResult";
			matchingCourse.innerHTML += classes[i][0].subject + ' ' + classes[i][0].number;

			$('.searchResultContainer').append(matchingCourse);

			
			// add class to search result list
			var key = classes[i][0].subject + ' ' + classes[i][0].number;
			SEARCH_RESULT_LIST[key] = classes[i];
		}

		searchWidth = $("#search").css("width");
		$('.searchResultContainer').css("width", searchWidth);

		// add a class from the search result list to the shopping cart
		$('.searchResult').click(function() {
			addToCart($(this).html());
			$('.searchResult').remove();
			makeCalendar();
		});

		// $('#search').focusout(function() {
		//   $('.searchResultContainer').hide();
		// });		

		$('#search').focus(function() {
		  $('.searchResultContainer').show();
		});				
	}

	function containsNumber(input) {
		var matches = input.match(/\d+/g);
		if (matches != null) {
		    return true;
		}
	}

	$("#search").keyup(function(event) {
	    if(event.keyCode == 13){
	        $("#enterbutton").click();
	    }
	    else if ((event.keyCode >= 48 && event.keyCode <= 122)) {
	    	var query = $('#search').val();
	    	if (!containsNumber(query)) {
		    	var matches = findMatchingClasses(query,data,['number','subject','title']); //overview
		    	matches = mergeClasses(matches,-1);
		    	addCourseSelectionTable(matches);
		    	//console.log(matches);
		    	SEARCH_LIST_FROM_NUM = jQuery.extend({}, SEARCH_RESULT_LIST);
	    	}
	    	else {
	    		for (var i in SEARCH_RESULT_LIST) {
	    			if (i.indexOf(query.toUpperCase()) == -1) delete SEARCH_RESULT_LIST[i];
	    		}
	    		addCourseSelectionTable(SEARCH_RESULT_LIST);
	    	}
	    }
	    else if (event.keyCode == 8) { // backspace
				var query = $('#search').val();

	    	if (containsNumber(query)) {
		    	SEARCH_RESULT_LIST = jQuery.extend({}, SEARCH_LIST_FROM_NUM); // reset back to when no number entered

	    		//console.log(SEARCH_LIST_FROM_NUM);
	    		for (var i in SEARCH_RESULT_LIST) { // repeat search in case there are some numbers
	    			if (i.indexOf(query.toUpperCase()) == -1) delete SEARCH_RESULT_LIST[i];
	    		}
					addCourseSelectionTable(SEARCH_RESULT_LIST);
	    	}
	    	else {
		    	var matches = findMatchingClasses(query,data,['number','overview','subject','title']);
		    	matches = mergeClasses(matches,-1);
		    	addCourseSelectionTable(matches);
		    	SEARCH_LIST_FROM_NUM = jQuery.extend({}, SEARCH_RESULT_LIST);
	    	}

	    }
	});	



	
	
	$(document).foundation('joyride', 'start');
	
});

window.onresize = function(event) {
	searchWidth = $("#search").css("width");
	$('.searchResultContainer').css("width", searchWidth);	
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////

var handsontable;

function hideDiv() { $("#loadDiv").removeClass("hide"); }
function unhideDiv() { $("#loadDiv").addClass("hide"); $("#myGrid").removeClass("hide"); }

/* HandsonTable */

/*
jQuery(function() {

	$("#loadGrid").removeClass("hide");
	$("#myGrid").addClass("hide");

	$("#myGrid").handsontable({
		height: 340,
	  //startRows: 8,
	  //startCols: 12,
	  rowHeaders: false,
	  colHeaders: false,
	  //minSpareRows: 1,
	  contextMenu: false,
	});

	handsontable = $("#myGrid").data('handsontable');

	$.ajax({
		url: "courses", // https://dl.dropbox.com/u/2623300/courses.json
		dataType: 'json',
		type: 'GET',
		success: function (resp) {
			data = convertDays(resp);
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
			$("#myGrid").removeClass("hide");
		}
	});
});


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
*/
