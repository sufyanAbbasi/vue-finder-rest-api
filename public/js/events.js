EVENTS_URL = "//jsonbin.io/b/5a028f54a6dd20501a4964e4" //ROOT + "events"

eventLists={}
eventMarkers={}
eventPosts = []

function initEvents(){
	eventLists={}
	eventMarkers={};
	infowindow = new google.maps.InfoWindow({
	    pixelOffset: new google.maps.Size(-1, 0)
	  });
	return new Promise(function(resolve, reject){
		load(EVENTS_URL).then(function(events){
			processEvents(events);
			resolve("Events done.");
		}).catch(function(err){
			reject(err);
		})
	})
}

function processEvents(events){
	for (var j = 0; j < events.length; j++) {
		event = events[j];
		if(!(event.category in eventLists)){
			eventLists[event.category]=[];
		}
		if(!(event.category in eventMarkers)){
			eventMarkers[event.category]=[];
		}
		eventLists[event.category].push(event);
	    eventMarkers[event.category].push(createEventMarker(event));
	    eventPosts.push(makePostItem(event));
	}
}

function createEventMarker(event){
   var latlng = {"lat": event.latitude, "lng": event.longitude};

   // Add marker
   var date = new Date(event.created);
   var date_str = date.toLocaleString();
   var category = event.category;
   var email = event.email;
   var title = event.title;

   var content = ['<b>title:</b> ',title,'<br>',
                  '<b>email:</b> ',email,'<br>',
                  '<b>submitted:</b> ',date_str,'<br>',
                  ].join('');
   var marker = createMarker(latlng, 
                              makeEventIcon(category),
                              content);
   return marker;
}

function makeEventIcon(category){
	var pinColor = "FF0000";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
    var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));
	return pinImage;
}

//make a post meta object
function makePostItem(event){
	return {
		html: generatePostHTML(event),
		start: new Date(event.start),
		end: new Date(event.end),
	}
}

//generate a src for map thumbnail
function generateStaticMapURL(lat, lng){
	// return ""
	return [
			"https://maps.googleapis.com/maps/api/staticmap?",
			"center=",
			"&zoom=17",
			"&scale=false",
			"&size=500x300",
			"&maptype=roadmap",
			"&format=png",
			"&visual_refresh=true",
			"&markers=size:mid%7Clabel:%7C",
			lat, ",", "+", lng,
			"&key=AIzaSyAlJKwj6Etx5M8J-THvbZ6KfZXZIWAJkGI",
			].join('');
}

//generate post HTML based on available data
//DANGER: UNSAFE, ESCAPE ALL DATA 
function generatePostHTML(data){
	return [
		'<div class="post">',
        	'<h3 class="title">',escapeHTML(data['title']),'</h3><br>',
        	'<p class="info when">',formatDate(data['start']),"–",formatDate(data['end']),'</p>',
        	'<p class="info location">',escapeHTML(data['location']),'</p>',
        	'<img src="', generateStaticMapURL(data['latitude'],data['longitude']), '" width="100%">',
        	'<p class="info description">',escapeHTML(data['description']),'</p>',
      	'</div>'
	].join("");
}

function showPosts(){
	for(var i = 0; i < eventPosts.length; i++){
		$('#posts').append(eventPosts[i].html);
	}
}