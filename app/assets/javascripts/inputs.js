function getClass(dept,classNr,termID,jsonArr) {
    // add a "-0" if necessary
    if (classNr.indexOf("-0") === -1) {
        classNr += "-0"
    }
    for (var n in jsonArr) {
        if (jsonArr[n].term == termID) {
            if (jsonArr[n].subject == dept && jsonArr[n].number == classNr) {
                return jsonArr[n];
            }
        }
    }
    return null;
}


$(document).ready(function() { 

    var CUR_TERM_ID = "4500";
    
	var data;
	$.getJSON('courses', function(resp) {
		data = resp;
	});

	var courselist = new Array();
	var count = 0;
	var idcount = 0;

	$("input[type=text]").click(function() {
	   $(this).select();
	});

	$("#enterbutton").click(function() {

		var string = $('#search').val();
		var stringcomps = string.split(' ');
		console.log(stringcomps);


		var course = getClass(stringcomps[0], stringcomps[1], CUR_TERM_ID, data);
		console.log(course);

		if(course != null) {
			courselist[count] = stringcomps;
			count++;

			console.log(courselist);

			var addednotif = document.createElement('div');
			addednotif.innerHTML = "Added course: " + string;
			$("#searchArea").append(addednotif);
		}
		else{
			console.log("error: course does not exist");
		}



	});

	$('#makecalbutton').click(function() {

		var numberOfCourses = courselist.length;
		for(var i = 0; i < numberOfCourses; i++) {
			var stringcomps = courselist[i];
			var course = getClass(stringcomps[0], stringcomps[1], CUR_TERM_ID, data);

			var starttime = course.start.split(':');
			var starthr = starttime[0];
			var startmin = starttime[1].substr(0,2);
			var startampm = starttime[1].substr(2,4);
			console.log(startampm);
			
			if(startampm=="PM"){
				var temp = parseInt(starthr) + 12;
				starthr = temp.toString();
			}

			var endtime = course.end.split(':');
			var endhr = endtime[0];
			var endmin = endtime[1].substr(0,2);
			var endampm = endtime[1].substr(2,4);

			if(endampm=="PM"){
				var temp = parseInt(endhr) + 12;
				endhr = temp.toString();
			}
			
			if(course.M == "t"){
				var day = "Monday";
				// Monday, April 8, 2013
				
				var finalstart = new Date('Mon Apr 8 2013 ' + starthr + ':' + startmin + ':00');
				var finalend = new Date('Mon Apr 8 2013 ' + endhr + ':' + endmin + ':00');
				
				var calEvent = { "id" : idcount,
				"start" : finalstart,
				"end" : finalend,
				"title" : course.subject + " " + course.number + " " + course.title};
				idcount++;
				console.log(calEvent);
				$("#calendar").weekCalendar("updateEvent", calEvent);
			}

			if(course.T == "t"){
				var day = "Tuesday";
				// Monday, April 8, 2013
				
				var finalstart = new Date('Tue Apr 9 2013 ' + starthr + ':' + startmin + ':00');
				var finalend = new Date('Tue Apr 9 2013 ' + endhr + ':' + endmin + ':00');

				var calEvent = { "id" : idcount,
				"start" : finalstart,
				"end" : finalend,
				"title" : course.subject + " " + course.number + " " + course.title};
				idcount++;
				console.log(calEvent);
				$("#calendar").weekCalendar("updateEvent", calEvent);
			}

			if(course.W == "t") {
				var day = "Monday"; // Monday, April 8, 2013
				
				var finalstart = new Date('Wed Apr 10 2013 ' + starthr + ':' + startmin + ':00');
				var finalend = new Date('Wed Apr 10 2013 ' + endhr + ':' + endmin + ':00');
				
				var calEvent = { 
					"id" : idcount,
					"start" : finalstart,
					"end" : finalend,
					"title" : course.subject + " " + course.number + " " + course.title 
				};

				idcount++;
				console.log(calEvent);
				$("#calendar").weekCalendar("updateEvent", calEvent);
			}
			
			if (course.R == "t") {
				var day = "Monday"; // Monday, April 8, 2013
				var finalstart = new Date('Thu Apr 11 2013 ' + starthr + ':' + startmin + ':00');
				var finalend = new Date('Thu Apr 11 2013 ' + endhr + ':' + endmin + ':00');

				var calEvent = { 
					"id" : idcount,
					"start" : finalstart,
					"end" : finalend,
					"title" : course.subject + " " + course.number + " " + course.title
				};

				idcount++;
				console.log(calEvent);
				$("#calendar").weekCalendar("updateEvent", calEvent);
			}
			if(course.F == "t") {
				var day = "Monday"; // Monday, April 8, 2013
				
				var finalstart = new Date('Fri Apr 12 2013 ' + starthr + ':' + startmin + ':00');
				var finalend = new Date('Fri Apr 12 2013 ' + endhr + ':' + endmin + ':00');

				var calEvent = { 
					"id" : idcount,
					"start" : finalstart,
					"end" : finalend,
					"title" : course.subject + " " + course.number + " " + course.title
				};
				idcount++;
				console.log(calEvent);
				$("#calendar").weekCalendar("updateEvent", calEvent);
			}

		}
		
		
	});

});
