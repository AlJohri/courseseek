//= require jquery-ui.min
//= require fuse.min

function getClass(dept,classNr,termID,jsonArr) {
    if (classNr.indexOf("-0") === -1) classNr += "-0" // add a "-0" if necessary

    for (var n in jsonArr)
        if (jsonArr[n].term == termID)
            if (jsonArr[n].subject == dept && jsonArr[n].number == classNr) return jsonArr[n];

    return null;
}

function findMatchingClasses(searchQuery,data,keyList) {
	var options = {
		keys: keyList,
		threshold: '0.5'
	}
	var f = new Fuse(data,options);
	return f.search(searchQuery);
}

function addCourseSelectionTable(classes) {
	console.log("adding table");
	$('.searchResult').remove();
	for (var i in classes) {
		var matchingCourse = document.createElement('div');
		matchingCourse.className = "searchResult";
		matchingCourse.innerHTML += classes[i][0].subject + ' ' + classes[i][0].number;

		$("#searchInput").append(matchingCourse);
	}
	// add a class from the search result list to the shopping cart
	$('.searchResult').click(function(){
		addToCart($(this).html());
		$('.searchResult').remove();
	});
}

function addToCart(classname) {
	var addedcoursenotif = document.createElement('div');
	addedcoursenotif.className = "addednotif";
	addedcoursenotif.innerHTML += 
	'<div class="removeClass"></div>' +
	'<div class="classTitle">' + classname.toUpperCase() + '</div>' + 
	'<div class="iphoneCheck">' + 
	'<input type="checkbox" value="' + classname.toUpperCase() + '" /> </div>'

	$("#searchOutput").append(addedcoursenotif);
	$(':checkbox').iphoneStyle();
	
	// todo: add it to calendar here too?
}

// format a raw array of classes
// output format: { EECS394-0: [ <class1>, <class2>, … ], … }
// each class contains a field "sections", which is an array of all sections for that class
function mergeClasses(classList,maxCount) {

	/* todo: handle deferred sections at the end */

	function findLECforDIS(dis_id,list) {
		best_match = [-1,null];
		for (var i in list) {
			lec_id = list[i].section;
			if (lec_id < dis_id && lec_id > best_match[0]) {
				best_match = [lec_id,list[i]];
			}
		}
		return best_match[1];
	}
	
	var merged = {};
	var deferredSections = [];
	var count = 0;
	
	for (var i in classList) {
		if (count >= maxCount) {
			return merged;
		}
		curClass = classList[i];
		// this ID is unique for each class, eg. "EECS 211", and the same for all sections of that class
		classID = curClass.subject + curClass.number;
		if (merged[classID] === undefined) {
			// if curClass is the lecture, add it
			if (curClass.lecdisc == "LEC") {
				merged[classID] = new Array();
                merged[classID].push(curClass);
                count++;
			} else { // else, defer processing it for later
				deferredSections.push(curClass);
			}
		} else {
			if (curClass.lecdisc == "LEC") {
				merged[classID].push(curClass);
				count++;
			} else { //class is not LEC
				// find LEC with the next-lowest ID (eg. DIS 54 should be assigned to LEC 50, not LEC 40)
				var lecID = findLECforDIS(curClass.section,merged[classID]);
				if (lecID !== null) {
					lecID = lecID.unique_id;
                	console.log(lecID);
                	console.log(merged);
                	for (var n in merged[classID]) {
                    	if (merged[classID][n].unique_id == lecID) {
                        	if (merged[classID][n].sections === undefined) {
                            	merged[classID][n]['sections'] = new Array();
                        	}
                        	merged[classID][n].sections.push(curClass);
                    	}
                	}
                }
			}
		}
	}
	return merged;
}

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

var sidebar = false;

$(document).ready(function() {

	$("#back").click(function() {
		if (!sidebar) {
			$("#container").css("margin-left", "80%");
			sidebar = true;
		}
		else {
			$("#container").css("margin-left", "0");
			sidebar = false;
		}
	});	

	var data; $.getJSON('courses', function(resp) { data = resp; });

	// http://www.w3schools.com/html/html_colornames.asp
	colors = ["Aqua", "Aquamarine", "Beige", "Bisque", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed ", "Indigo ", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];

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

    	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
 				return 280;
			}
			else {
				return 428;
			}

    	// return 700;
    	// return $(window).height();
    },
    eventRender : function(calEvent, $event) {
    	console.log($event);
      $event.css("backgroundColor", colors[calEvent.colorid]);
      $event.find(".wc-time, .wc-title").css({
         "backgroundColor" : colors[calEvent.colorid],
         //"border" : "1px solid black",
         "color" : "black"
      });
    }
 	});

  var CUR_TERM_ID = "4500";

	var courselist = new Array();
	var count = 0;
	var idcount = 0;

	$("input[type=text]").click(function() { $(this).select(); });
	
	$("#enterbutton").click(function() {

		var query = $('#search').val();
		var splitquery = query.split(' ');
		
		var courses = {};
		var result = null;
		
		if (splitquery.length == 2) {
			splitquery[0] = splitquery[0].toUpperCase();
			console.log("Search: " + splitquery);
		
			result = getClass(splitquery[0], splitquery[1], CUR_TERM_ID, data);
		}

		var exists = false;
		for (var i = 0; i < courselist.length; i++) {
			if (courselist[i][0] == splitquery[0] && courselist[i][1] == splitquery[1]) {
				exists = true;
				break;
			}
		}

		if(result != null  && !exists) {
			courselist[count] = splitquery;
			count++;

			addToCart(query);

		 	$("#search").val("");
			
		 	//Here is where we'll put the functionality for toggling classes on and off
			makeCalendar();
		}
		else if (exists) console.log("error: course already in list");
		else console.log("course does not exist");

	});


	/* Removes an event from the shopping cart on click */
	$('.removeClass').click(function(){
			console.log("hello!");
	});

	function makeCalendar() {

		/* Clear Calendar */
		$("#calendar").weekCalendar("clear");

		var numberOfCourses = courselist.length;
		for(var i = 0; i < numberOfCourses; i++) {
			var stringcomps = courselist[i];
			var course = getClass(stringcomps[0], stringcomps[1], CUR_TERM_ID, data);

			var year = new Date().getFullYear();
      		var month = new Date().getMonth();
      		var day = getMonday(new Date()).getDate();

			var days = [course.M, course.T, course.W, course.R, course.F];

			// console.log(days);

			/* Create Events */
			for (var j = 0; j < 5; j++) {
				if (days[j] == "t") {
					var calEvent = { 
						"unique_id" : course.unique_id,
						"colorid" : i,
						"start" : new Date(year + '-' + (month+1) + '-' + (day + j) + ' ' + course.start.match(/(\d+:\d+)(\w+)/)[1] + ' ' + course.start.match(/(\d+:\d+)(\w+)/)[2]),
						"end" : new Date(year + '-' + (month+1) + '-' + (day + j) + ' ' + course.end.match(/(\d+:\d+)(\w+)/)[1] + ' ' + course.end.match(/(\d+:\d+)(\w+)/)[2]),
						"title" : course.subject + " " + course.number + " " + course.title
					};
					console.log(calEvent);
					$("#calendar").weekCalendar("updateEvent", calEvent);					
				}
			}
		}
	}

	$("#search").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#enterbutton").click();
	    }
	    else if (event.keyCode >= 65 && event.keyCode <= 122) {
	    	var query = $('#search').val();
	    	var matches = findMatchingClasses(query,data,['number','overview','subject','title']);
	    	matches = mergeClasses(matches,15);
	    	addCourseSelectionTable(matches);
	    }
	});	
	
	$(document).foundation('joyride', 'start');
	
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////

var data;
var handsontable;

function hideGrid() { $("#loadGrid").removeClass("hide"); }
function unhideGrid() { $("#loadGrid").addClass("hide"); $("#myGrid").removeClass("hide"); }

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