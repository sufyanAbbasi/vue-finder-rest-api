var map;

//creates a marker with given infoContent HTML and function callback on click
function createMarker(googLatLng, icon, infoContent, clickCallback) {
  var marker = new google.maps.Marker({
    map: map,
    position: googLatLng,
    icon: icon,
    content: infoContent,
    animation: google.maps.Animation.DROP,
  });
  google.maps.event.addListener(marker, 'mouseover', function() {
    infowindow.setContent(infoContent);
    infowindow.open(map, this);
  });
  google.maps.event.addListener(marker, 'mouseout', function() {
    infowindow.close();
  });
  google.maps.event.addListener(marker, 'click', function() {
  	map.panTo(marker.getPosition());
    if(clickCallback){
      clickCallback.bind(this, marker, infoContent)();
    }
  });
  google.maps.event.addListener(map, 'zoom_changed', function() {
    scaleIcon(marker, icon);
  });
  scaleIcon(marker, icon);
  return marker;
}

//scales icons based on zoom level array at top
function scaleIcon(marker, icon){
  var icon_size = .75 * countryPointSizePixels * Math.pow(blockPointSizePixels / countryPointSizePixels, (map.getZoom() - 4) / (18 - 4));
  icon.scaledSize = new google.maps.Size(icon_size,icon_size);
  icon.origin = new google.maps.Point(0,0), // origin
  icon.anchor = new google.maps.Point(0, 0) // anchor
  marker.setIcon(icon);
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
      mapTypeControl: true,
      mapTypeControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
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

