# VUEFinder Backend
This is the backend logic for the VUEfinder mobile application.

## USAGE
The API is currently organized as follows:

### Main URL: http://ec2-54-146-151-29.compute-1.amazonaws.com/

This returns plain text telling the user that this is the VUE REST API

### /points/

`/points/?category=<category>`
A GET request to this endpoint returns all map points corresponding `<category>`
specified by the user.

A POST request to this endpoint creates and stores a map point with the given
values in the POST request. These values are:

- name (String corresponding to the name of the creator of the point)
- description (String containing description of point)
- latitude (Float corresponding to the point's latitude)
- longitude (Float corresponding to the point's longitude)
- category (String containing the category this point belongs to)
