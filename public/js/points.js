POINTS_URL = "//jsonbin.io/b/5a0171f4ed25d0573bf19c8f" //ROOT + "points"

categories={
	"BLUE_LIGHT":{
    color: 'blue',
    description: 'Emergency Blue Lights'
  },
  "BUILDING":{
    color: "rgb(255,0,0)",
    description: 'Academic Buildings'
  },
  "RESTROOM":{
    color: "rgb(102,51,153)",
    description: 'Restrooms'
  },
}


pointLists={}
pointMarkers={}

var countryPointSizePixels = 7; 
var blockPointSizePixels = 70; 

var infowindow;

function initPoints(){
	pointLists={}
	pointMarkers={};
	infowindow = new google.maps.InfoWindow({
	    pixelOffset: new google.maps.Size(-1, 0)
	  });
	return new Promise(function(resolve, reject){
		load(POINTS_URL).then(function(points){
			processPoints(points);
			resolve("Points done.");
		}).catch(function(err){
			reject(err);
		})
	})
}

function processPoints(points){
	for (var j = 0; j < points.length; j++) {
		point = points[j];
		if(!(point.category in pointLists)){
			pointLists[point.category]=[];
		}
		if(!(point.category in pointMarkers)){
			pointMarkers[point.category]=[];
		}
		pointLists[point.category].push(point);
	    pointMarkers[point.category].push(createCategoryMarker(point));
	}
}

function drawPoints(){
  for(category in pointMarkers){
    markers = pointMarkers[category]
    markers.map(function(marker){
        marker.setVisible(category == $('[name=category]').val());
    })
  }
}

function makeCategoryIcon(idx) {
	return {
	        path: google.maps.SymbolPath.CIRCLE,
	        fillColor: categories[idx].color,
	        strokeColor: 'white',
	        strokeWeight: 3,
	        scale: 7.5,
	        fillOpacity: 1.0,
	      };
	 }

function createCategoryMarker(point){
   var latlng = {"lat": point.latitude, "lng": point.longitude};

   // Add marker
   var date = new Date(point.created);
   var date_str = date.toLocaleString();
   var category = point.category;
   var email = point.email;
   var description = point.description;

   var content = ['<b>Category:</b> ',categories[category].description,'<br>',
                  '<b>description:</b> ',description,'<br>',
                  '<b>email:</b> ',email,'<br>',
                  '<b>submitted:</b> ',date_str,'<br>',
                  ].join('');
   var marker = createMarker(latlng, 
                              makeCategoryIcon(category),
                              content);
   return marker;
}