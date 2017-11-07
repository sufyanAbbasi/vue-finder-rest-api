var map;
var infowindow = makeInfoWindow('');

var latlngs = [
	{lat: 41.6860471, lng: -73.89734220000003},
	{lat: 41.68394308, lng: -73.89830491},
	{lat: 41.68278345, lng: -73.89750748},
	{lat: 41.68469556, lng: -73.89432027},
	{lat: 41.6828317, lng: -73.8983063},
	{lat: 41.68520255, lng: -73.89806582},
	{lat: 41.68357412, lng: -73.89439702},
	{lat: 41.68929674, lng: -73.89536947},
	{lat: 41.68293966, lng: -73.89967249},
	{lat: 41.68434201, lng: -73.89690249},
];

var infos = [
	{"title": "Sanders 3rd Floor", "description": "The third floor of Sanders", "status": 2},
	{"title": "Sanders 2nd Floor", "description": "The second floor of Sanders", "status": 1},
	{"title": "Sanders First Floor", "description": "The first floor of Sanders", "status": 0},
	{"title": "New England First Floor", "description": "The first floor of NE", "status": 1},
	{"title": "New England Second Floor", "description": "The second floor of Sanders", "status": 1},
	{"title": "New England Basement", "description": "The basement of New England", "status": 0},
	{"title": "Main First Floor", "description": "The first floor of Main", "status": 1},
	{"title": "Main Second Floor 1", "description": "The second floor of Main", "status": 1},
	{"title": "Main Second Floor 2", "description": "The second floor of Main", "status": 2},
	{"title": "Main Third Floor 1", "description": "The third floor of Main", "status": 0},
];

var mapMarkers = [];

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

function load(url) {
	return new Promise(function(resolve, reject){
	    var xhr = createCORSRequest('GET', url);
	    xhr.responseType = "json";
	    xhr.onload = function() {
	      if(xhr.status == 200){
	          resolve(this.response);
	      }else{
	          reject(Error(xhr.statusText));
	      }
	    };
	    // Handle network errors
	    xhr.onerror = function() {
	      reject(Error("Network Error"));
	    };

	    xhr.send();
	}); 
	}
	function post(url, json) {
	return new Promise(function(resolve, reject){
	    var xhr = new XMLHttpRequest();
	    xhr.open("POST", url, true);
	    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
	    xhr.onload = function () {
	        var data = JSON.parse(xhr.responseText);
	        if (xhr.status == "200") {
	            resolve(data);
	        } else {
	            reject(data);
	        }
	    }
	    xhr.send(json);
	}); 
	}


function initMap(){
	// initialize the map
    var mapOptions = {
      zoom: 16,
      center: new google.maps.LatLng(41.68623752785667,-73.89570789337155),
      keyboardShortcuts: false,
      zoomControl: true,
      zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      scaleControl: true,
      scaleControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      fullscreenControl: false,
      streetViewControl: true,
      mapTypeControl: false,
      styles: [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},
      			{"saturation":43.400000000000006},{"lightness":37.599999999999994},
      			{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},
      			{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},
      			{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},
      			{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},
      			{"featureType":"road.local","stylers":[{"hue":"#FF0300"},
      			{"saturation":-100},{"lightness":52},{"gamma":1}]},
      			{"featureType":"water","stylers":[{"hue":"#0078FF"},
      			{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},
      			{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},
      			{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},
      			{"gamma":1}]}]
    };
    var mapDiv = document.getElementById('map-div');
    return new google.maps.Map(mapDiv, mapOptions);
}

function makeMarker(latlng, map, color){
	var pinColor = color;
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
    var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));
	return new google.maps.Marker({
          position: latlng,
          map: map,
          icon: pinImage,
          shadow: pinShadow
        });
}

function makeInfoWindow(contentString){
	return new google.maps.InfoWindow({
	    content: contentString
	  });
}

function getStatusString(status){
	return (!status) ? "Pending" : (status == 1) ? "Approved" : "Denied";
}

function getStatusColor(status){
	return (!status) ? "888888" : (status == 1) ? "00FF00" : "FF0000";
}

function init(){
	map = initMap();
	for (var i = latlngs.length - 1; i >= 0; i--) {
		(function(){
			var inf = infos[i];
			var marker = makeMarker(latlngs[i], map, getStatusColor(inf['status']));
			var info = [
					inf['title'],
					'<br><br>',
					inf['description'],
					'<br><br>',
					'Status: ', 
					getStatusString(inf['status'])].join('');

			marker.addListener('click', function() {
				map.panTo(marker.getPosition());
				infowindow.setContent(info);
				infowindow.open(map, marker);
			});

			mapMarkers[i] = {
				marker: marker, 
				info: info
			};

			$('#map-points ul').append(
				['<li class="map-point" data-index="'+i+'">',
				'<p>'+infos[i]['title']+'</p>',
				'<div class="more-info"></div>',
				'</li>'].join(''));
		})();
	}
	$('.tool-window').click(function(e){
		$(this).toggleClass('open').toggleClass('close');
	}).children().click(function(e) {
		return false;
	});

	$('.more-info').click(function(e){
		var i = $(this).parent().data('index');
		$('#map-points').removeClass('open').addClass('close');
		map.panTo(mapMarkers[i].marker.getPosition());
		infowindow.setContent(mapMarkers[i].info);
		infowindow.open(map, mapMarkers[i].marker);
	});
}

$(init);