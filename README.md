VUEFinder Backend
=================
This is the backend logic for the VUEfinder mobile application.

## USAGE
The API is currently organized as follows:

### Main URL:
http://ec2-54-146-151-29.compute-1.amazonaws.com

This returns plain text telling the user that this is the VUE REST API

### /points/

#### GET

`/points`
* A GET request to this endpoint returns all map points

`/points/?categories`
* A GET request to this endpoint returns an array of unique categories

`/points/?category=<category>`
* A GET request to this endpoint returns all map points corresponding `<category>`
specified by the user.

#### POST

A POST request to this endpoint creates and stores a map point with the given
values in the POST request. These values are:

* email 		(String corresponding to the email of the creator of the point)
* description 	(String containing description of point)
* latitude 		(Float corresponding to the point's latitude)
* longitude 	(Float corresponding to the point's longitude)
* category 		(String - all Uppercase - containing the category this point belongs to)
* img (optional)(String corresponding to a url for an image)

Valid JSON:

```json
{
    "email"       : "valid@email.com",
    "description" : "Thompson Library",
    "latitude"    : 41.687309,
    "longitude"   : -73.897827,
    "category"    : "BUILDINGS",
    "img"		  : "https://upload.wikimedia.org/wikipedia/commons/3/34/Thompson_Library_External.jpg"
}
```
