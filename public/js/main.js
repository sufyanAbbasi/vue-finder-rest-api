var ROOT = "http://ec2-54-146-151-29.compute-1.amazonaws.com/"

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

function processHash(){
	var hash = window.location.hash.slice(1);
	$('[id*="-page"],[class*="-page"]').hide();
	if($('#'+hash+'-page').length){
      $('#'+hash+'-page').show();
    }else{
      window.location.hash = "points";
    }
}

window.onhashchange = processHash;

function init(){
	for(category in categories){
		$('[name=category]').append([
			'<option value="',category,'">',
			categories[category].description,
			'</option>'].join(''));	
	}
	
	map = initMap();
	initPoints().then(function(resolve){
		console.log(resolve);
		drawPoints();
	}).catch(function(err){
		console.log(err);
	});

	initEvents().then(function(resolve){
		console.log(resolve);
		showPosts();
	}).catch(function(err){
		console.log(err);
	});

	$('[name=category]').change(function(){
		drawPoints();
	});

	processHash();

	// $('#map-points ul').append(
	// 			['<li class="map-point" data-index="'+i+'">',
	// 			'<p>'+infos[i]['title']+'</p>',
	// 			'<div class="more-info"></div>',
	// 			'</li>'].join(''));
}

$(init);