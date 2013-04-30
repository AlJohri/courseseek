//= require jquery-ui.min
//= require fuse.min
//= require search

/* GLOBALS */
// Note: I'm not sure if it's better style to have these as globals, or put everything 
// (eg. addCourseSelectionTable, addToCart and these two) into $(document).ready

var fuse;
var data;
var CUR_TERM_ID = "4500";
var COURSE_LIST = {};
var SEARCH_RESULT_LIST = {};
var SEARCH_LIST_FROM_NUM = {};


function changeSection() {}

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
				// console.log(course);
				var days = [course.M, course.T, course.W, course.R, course.F];
	
				/* Create Events */
				for (var j = 0; j < 5; j++) {
					if (days[j] == "t") {

						console.log("day " + j + " == true");
						var _month = month+1;
						var _day = day + j;
						if (_day > 30) {
							_day -= 30;
							_month += 1;
						}
						var calEvent = { 
							"unique_id" : course.unique_id,
							"colorid" : colorCounter,
							"start" : new Date(year + '-' + _month + '-' + _day + ' ' + course.start.match(/(\d+:\d+)(\w+)/)[1] + ' ' + course.start.match(/(\d+:\d+)(\w+)/)[2]),
							"end" : new Date(year + '-' + _month + '-' + _day + ' ' + course.end.match(/(\d+:\d+)(\w+)/)[1] + ' ' + course.end.match(/(\d+:\d+)(\w+)/)[2]),
							"title" : course.subject + " " + course.number + " " + course.title
						};
						console.log(calEvent);
						$("#calendar").weekCalendar("updateEvent", calEvent);
						// console.log("sent updateEvent to calendar");
					}
				}

				for (var s in course.sections) {
					var section = course.sections[s];
					// console.log(section);
					if (section.onoff == true) {
						// console.log("TRUE");
						var _days = [section.M, section.T, section.W, section.R, section.F];
						for (var i = 0; i < 5; i++) {
							_month = month+1;
							_day = day + i;
							if (_day > 30) {
								_day -= 30;
								_month += 1;
							}
							if (_days[i] == "t") {
								var calEvent = { 
									"unique_id" : section.unique_id,
									"colorid" : colorCounter,
									"start" : new Date(year + '-' + _month + '-' + _day + ' ' + section.start.match(/(\d+:\d+)(\w+)/)[1] + ' ' + section.start.match(/(\d+:\d+)(\w+)/)[2]),
									"end" : new Date(year + '-' + _month + '-' + _day + ' ' + section.end.match(/(\d+:\d+)(\w+)/)[1] + ' ' + section.end.match(/(\d+:\d+)(\w+)/)[2]),
									"title" : section.subject + " " + section.number + " " + section.title
								};
								console.log(calEvent);
								$("#calendar").weekCalendar("updateEvent", calEvent);					
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
	// $('#calendar').weekCalendar('scrollToHour', '9'); :: make a starting time default to 9 am
}

function getDateStringFromCourse(course){
	var datestring = "";
	if(course.M=='t'){ datestring += 'Mo' }
	if(course.T=='t'){ datestring += 'Tu' }
	if(course.W=='t'){ datestring += 'We' }
	if(course.R=='t'){ datestring += 'Th' }
	if(course.F=='t'){ datestring += 'Fr' }
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

	// BEGIN conflict resolution (uncomment from here to END if this breaks something)
	for (var k_it in COURSE_LIST) {
		for (var i in COURSE_LIST[k_it]) {
			var cur = COURSE_LIST[k_it][i];
			if (cur.onoff == true) {
				var existingTimeSlotBegin = new Date(2013 + '-' + 01 + '-' + 01 + ' ' + cur.start.match(/(\d+:\d+)(\w+)/)[1] + ' ' + cur.start.match(/(\d+:\d+)(\w+)/)[2]);
				var existingTimeSlotEnd = new Date(2013 + '-' + 01 + '-' + 01 + ' ' + cur.end.match(/(\d+:\d+)(\w+)/)[1] + ' ' + cur.end.match(/(\d+:\d+)(\w+)/)[2]);
				var newTimeSlotBegin = new Date(2013 + '-' + 01 + '-' + 01 + ' ' + SEARCH_RESULT_LIST[key][0].start.match(/(\d+:\d+)(\w+)/)[1] + ' ' + SEARCH_RESULT_LIST[key][0].start.match(/(\d+:\d+)(\w+)/)[2]);
				var newTimeSlotEnd = new Date(2013 + '-' + 01 + '-' + 01 + ' ' + SEARCH_RESULT_LIST[key][0].end.match(/(\d+:\d+)(\w+)/)[1] + ' ' + SEARCH_RESULT_LIST[key][0].end.match(/(\d+:\d+)(\w+)/)[2]);
				if (existingTimeSlotEnd <= newTimeSlotBegin || existingTimeSlotBegin >= newTimeSlotEnd) {
					continue;
				} else {
					var choice = confirm("This class conflicts with your shopping cart. Add anyway?");
					if (choice) {
						break;
					} else {
						return;
					}
				}
			}
		}
	}
	// END conflict resolution
	
	COURSE_LIST[key] = SEARCH_RESULT_LIST[key];
	COURSE_LIST[key][0].onoff = true;
	if(COURSE_LIST[key][0].sections != undefined){
		COURSE_LIST[key][0].sections[0].onoff = true;
	}
	

	var carsonWrapper = document.createElement('div');
	carsonWrapper.className = "carsonWrapper";

	var addedcoursenotif = document.createElement('div');
	addedcoursenotif.className = "addedCourseButton";
	addedcoursenotif.id = keySpaceless;
	addedcoursenotif.innerHTML += '<div class="removeClass"></div>' + key;

	var coursesections = document.createElement('div');
	coursesections.className = "addedCourseSec";
	var sectionHtml = '<div class="dropTitle">' + '<b> Title: </b> <br>' + COURSE_LIST[key][0].title +'</div>' + 
					  '<div class="dropInst">' + '<b> Instructor: </b> <br>' + COURSE_LIST[key][0].instructor + '</div>';

	// for future
	// http://www.w3schools.com/tags/tag_select.asp
	// 

	//Populate drop down with lecture sections
	sectionHtml += '<div class="LEC"><b>LEC:</b> '+
					'<form><select id="LEC-'+keySpaceless+'">';

	for (var i in COURSE_LIST[key]) {
		sectionHtml += '<option value="' + COURSE_LIST[key][i].unique_id + '">' + createSectionString(COURSE_LIST[key][i]) + '</option>';
		// if (i == 0){
		// 	newHtml = sectionHtml + '</select></form></div>' + '<div class="DIS">DIS: ' + '<form><select id="DISlist">';
		// 	for (var j in COURSELIST[key][i].sections){
		// 		sectionHtml += '<option>section ' + COURSE_LIST[key][i].sections[j] + '</option>';
		// 	}
		// }
	}

	sectionHtml += '</select></form></div>';

	//Populate drop down with discussion sections
	sectionHtml += '<div class="DIS"><b>SECTION:</b> '+
					'<form><select id="SEC-' + keySpaceless + '">';

	for (var j in COURSE_LIST[key][0].sections) {
		sectionHtml += '<option value="' + COURSE_LIST[key][0].sections[j].unique_id + '"> ' + createSectionString(COURSE_LIST[key][0].sections[j]) + '</option>';
	}


	sectionHtml += '</select></form></div>';
	coursesections.innerHTML = sectionHtml;		


	$(carsonWrapper).append(addedcoursenotif);
	$(carsonWrapper).append(coursesections);

	$("#addedCourses").append(carsonWrapper);
	
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
		$(this).parent().parent().remove();
		$('#' + this.parentNode.id).next().remove();
		$('#' + this.parentNode.id).remove();
		makeCalendar();
	});	

	$('.courseSection').click(function(){ console.log("tell calendar to turn on " + $(this).text()); });
	$("#search").val("");
	
	var previousLecID;
	$('#LEC-' + keySpaceless).focus( function() {
		previousLecID = $(this).val(); }).
	change( function() {
		console.log("LECTURE changed to " + $(this).val() + ' from ' + previousLecID);
		// Change what lecture shows with code here
		var newLecture = $(this).val()
		var lectureName = this.id.substr(4);
		var sectionDropdownDivName = "SEC-" + lectureName;
		lectureName = lectureName.replace(/([a-zA-Z]+)([\d-]+)/g, '$1 $2');
		for (var i in COURSE_LIST[lectureName]){
			if (COURSE_LIST[lectureName][i].unique_id == newLecture){
				COURSE_LIST[lectureName][i]["onoff"] = true;
				for (var j in COURSE_LIST[lectureName][i].sections){
					if(j==0){
						COURSE_LIST[lectureName][i].sections[j].onoff = true;
					}
					else COURSE_LIST[lectureName][i].sections[j].onoff = false;
				}
				// Make new lecture's discussions show in discussion dropdown
				var sectionDropdown = $('#' + sectionDropdownDivName);
				$(sectionDropdown).empty();
				var newInnerHTML = "";
				for(var j in COURSE_LIST[lectureName][i].sections){
					newInnerHTML += "<option value='" + COURSE_LIST[lectureName][i].sections[j].unique_id + "'>" + createSectionString(COURSE_LIST[lectureName][i].sections[j]) + "</option>";
					// Also default the first discussion of that lecture to be on, others to be off
					if(j==0){
						COURSE_LIST[lectureName][i].sections[j]['onoff'] = true;
					}
					else COURSE_LIST[lectureName][i].sections[j]['onoff'] = false;
				}
				$(sectionDropdown).append(newInnerHTML);
			}
			if (COURSE_LIST[lectureName][i].unique_id == previousLecID){
				COURSE_LIST[lectureName][i]['onoff'] = false;
				for (var j in COURSE_LIST[lectureName][i].sections){
					COURSE_LIST[lectureName][i].sections[j].onoff = false;
				}
			}
		}
		makeCalendar();
		previousLecID = newLecture;
		console.log("ID: " + this.id);
	});
	
	var previousSecID;
	$('#SEC-' + keySpaceless).focus( function() {
		previousSecID = $(this).val(); }).
	change( function() {
		console.log("Section changed to " + $(this).val() + " from " + previousSecID);
		var newSecID = $(this).val();
		var newSection = $(this).val()
		var lectureName = this.id.substr(4);
		lectureName = lectureName.replace(/([a-zA-Z]+)([\d-]+)/g, '$1 $2');
		console.log(lectureName);
		for (var i in COURSE_LIST[lectureName]){
			if(COURSE_LIST[lectureName][i].onoff == true){
				for(var j in COURSE_LIST[lectureName][i].sections){
					if (COURSE_LIST[lectureName][i].sections[j].unique_id == newSecID){
						COURSE_LIST[lectureName][i].sections[j]['onoff'] = true;
					}else COURSE_LIST[lectureName][i].sections[j]['onoff'] = false;
				}
			}
		}
		makeCalendar();
		previousSecID = newSecID;

	});

	

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

	if (getCookie("splash") == "seen") {
		console.log("already seen splash screen");
		$('#container').show();		
	}
	else {
		$('#splashScreen').show();
		console.log("seeing the splash screen woohoo");
		//$(document).foundation('joyride', 'start');
	}


	$("#calltoaction").click(function() {
		//$("#splashScreen").fadeOut('slow',function(){
  	// $("#splash").animate({'top': '-=250px'},'slow');

	  $('#splashScreen').fadeOut('slow', function() {
	    $("#container").fadeIn('slow');
	    setCookie("splash", "seen", 7 * 365);

	  });


  	//fadeIn(1500).
	});

	$("#calendar").addClass("hide");
	$("#loadDiv").removeClass("hide");	

	$.getJSON('courses', function(resp) { 
		data = resp;


		var options = { keys: ['number','overview','subject','title'], threshold: '0.25' }
		fuse = new Fuse(data,options);


		$("#loadDiv").addClass("hide"); 
		$("#calendar").removeClass("hide");
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

    	winHeight = $(window).height() - 171;
    	maxHeight = 672;

    	if ($(window).width() <= "768" || /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    		return maxHeight;
    	}
    	else {
    		return winHeight < maxHeight ? winHeight : maxHeight;
    	}

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
		//adds to cart when user hits enter (must add section after course #)
		//return -1 if the course entered is not in the list, otherwise return 0; 
		var check=Object.keys(SEARCH_RESULT_LIST).indexOf($('#search').val().toUpperCase());
		console.log(check);
		if ($('#search').val() != '' &&  check != -1){
			// addToCart(SEARCH_RESULT_LIST[$('.searchResult').html()]);
			addToCart(SEARCH_RESULT_LIST[$('.searchResult').children('#classSubNum').text()][0].subject + ' ' + SEARCH_RESULT_LIST[$('.searchResult').children('#classSubNum').text()][0].number);
			makeCalendar();
		}
	});


	function addCourseSelectionTable(classes) {
		//console.log("adding table");
		
		$('.searchResult').remove();
		
		for (var i in classes) {
			var matchingCourse = document.createElement('div');
			matchingCourse.className = "searchResult";
			matchingCourse.innerHTML += '<div id="classSubNum">' + classes[i][0].subject + ' ' + classes[i][0].number + '</div>' +
										'<div id="classTitle">' + classes[i][0].title + '</div>';

			$('.searchResultContainer').append(matchingCourse);

			
			// add class to search result list
			var key = classes[i][0].subject + ' ' + classes[i][0].number;
			SEARCH_RESULT_LIST[key] = classes[i];
		}

		searchWidth = $("#search").css("width");
		$('.searchResultContainer').css("width", searchWidth);

		// add a class from the search result list to the shopping cart
		$('.searchResult').click(function() {
			addToCart($(this).children("#classSubNum").text());
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

	function createSearchDropDown(){
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
		    	var matches = findMatchingClasses(query);
		    	matches = mergeClasses(matches,-1);
		    	addCourseSelectionTable(matches);
		    	SEARCH_LIST_FROM_NUM = jQuery.extend({}, SEARCH_RESULT_LIST);
	    	}
	}

	var typingTimer;
	var doneTypingInterval = 200;

	$("#search").keyup(function(event) {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(
      function() {

		    if(event.keyCode == 13) { $("#enterbutton").click(); }
		    else if ((event.keyCode >= 48 && event.keyCode <= 122)) {
		    	var query = $('#search').val();
		    	if (!containsNumber(query)) {
			    	var matches = findMatchingClasses(query); //overview
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
		    		createSearchDropDown();
		    }
     },
    doneTypingInterval
   );
	});	

	var keepFocus = false;

	function hideSearchResult(){
		if(!keepFocus) { $('.searchResult').remove();}
	}

	$('#search').focus(function(){
		createSearchDropDown();
	});

	$('#search').blur(function(){
		keepFocus = false;
	//		window.setTimeout(hideSearchResult, 150);}).focus(function(){
	//			keepFocus = true;
	});

	if (getCookie("joyride") == "ridden") {
		console.log("already rode the joyride");
	}
	else {
		console.log("riding the joyride woohoo");
		//$(document).foundation('joyride', 'start');
	}
	
});

window.onresize = function(event) {
	searchWidth = $("#search").css("width");
	$('.searchResultContainer').css("width", searchWidth);	

  winHeight = $(window).height();
	maxHeight = 672;

	$("#searchOutput").css("height", winHeight - 220);

	// this is inefficient
	$("#calendar").weekCalendar({
    height : function($calendar) { 

    	if ($(window).width() <= "768" || /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    		// return maxHeight;
    	}
    	else {
    		return (winHeight - 171) < maxHeight ? (winHeight - 171) : maxHeight;
    	}

    },
	});

	makeCalendar();

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
