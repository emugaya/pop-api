[![Maintainability](https://api.codeclimate.com/v1/badges/63b4ff2de26fdabafbcc/maintainability)](https://codeclimate.com/github/emugaya/pop-api/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/63b4ff2de26fdabafbcc/test_coverage)](https://codeclimate.com/github/emugaya/pop-api/test_coverage)
# Population Management API
The Population Management API is a Restful API for managing population records of locations. Locations can be nested in other locations.

The API is set up in such a way that if a location has sub locations, it's Male, Female and Total are equal to the sum of sublocations for the different locations. If a location doesn't have any sublocations, its population is equivalent to what was passed when creating it.

Considering that locations can be nested in other locations. We have limited updating a sublocation's parent. We advise the user to delete the location and create a new one.

Deleting a parent location deletes all it's children / sublocations.

This API has been developed and tested on macOS High Sierra Version 10.13.6


## Installation
- Install Nodejs 8 or above
- Install Mongo DB (guide [here](https://docs.mongodb.com/manual/installation/))
- Clone the repo onto your computer
- Update the `env` file with your environment variables
- Install packages `npm install`
- Run `./run.sh` to start the application

## Features
* Location - creation, update, deletion, getting single location and all locations.
* Nested / Sub Location - creation, update, deleting, and retrieving sublocations 

## Endpoints
| Type | API Endpoint | Description|
| --- | --- | --- |
| POST | `/locations` | Creates a new parent location. Requires **male**, **female** as number payloads and **name** as string<br/><br/> **Sample Payload** <br/><pre>{<br/>&nbsp;&nbsp;"name": "Jinja",<br/>&nbsp;&nbsp;"male": 10, <br/>&nbsp;&nbsp;"female": 10<br/>}</pre><br/> **Sample Response** <br/><pre>{<br/>&nbsp;&nbsp;"id": "5c85654dfad9b0761e73a266",<br/>&nbsp;&nbsp;"name": "Jinja",<br/>&nbsp;&nbsp;"male": 10, <br/>&nbsp;&nbsp;"female": "10", <br/>&nbsp;&nbsp;"total": 20, <br/>&nbsp;&nbsp;"createdAt": "2019-03-10T19:28:13.874Z", <br/>&nbsp;&nbsp;"updatedAt": "2019-03-10T19:28:13.874Z", <br/>&nbsp;&nbsp;"subLocations": [],<br/>&nbsp;&nbsp;"parentLocationId": null <br/>}</pre>|
| POST | `/locations` | Creates a new nested / sublocation location. Requires **male**, **female** as number payloads and **name** and **parent** location as string <br/><br/> **Sample Payload** <br/><pre>{<br/>&nbsp;&nbsp;"name": "Jinja",<br/>&nbsp;&nbsp;"male": 10, <br/>&nbsp;&nbsp;"female": 10,<br/>&nbsp;&nbsp;"parent": "5c85654dfad9b0761e73a266"<br/>}</pre><br/> **Sample Response** <br/><pre>{<br/>&nbsp;&nbsp;"id": "5c838eb1eac8a9f683c10187",<br/>&nbsp;&nbsp;"name": "Jinja",<br/>&nbsp;&nbsp;"male": 10, <br/>&nbsp;&nbsp;"female": "10", <br/>&nbsp;&nbsp;"total": 20,<br/>&nbsp;&nbsp;"parent": [], <br/>&nbsp;&nbsp;"createdAt": "2019-03-10T19:28:13.874Z", <br/>&nbsp;&nbsp;"updatedAt": "2019-03-10T19:28:13.874Z",<br/>&nbsp;&nbsp;"subLocations": [], <br/>&nbsp;&nbsp;"parentLocationId": "5c85654dfad9b0761e73a266"<br/>}</pre>|
| GET | `/locations` | Gets all locations. Returns parent and nested locations. <br/><br/>**Sample Response**<br/><pre>[<br/>&nbsp;&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "5c838e83eac8a9f683c10185",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Jinja",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"parentLocationId": null,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"male": 1101,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"female": 2206,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"total": 3307,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"subLocations": [<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "5c838eb1eac8a9f683c10187",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Butembe"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "5c8416b416a2fc6bc4be2111",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Jinja Municipality"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"createdAt": "2019-03-09T09:59:31.791Z",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"updatedAt": "2019-03-10T14:36:50.920Z"<br>&nbsp;&nbsp;&nbsp;},<br/>&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "5c838eb1eac8a9f683c10187",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Butembe",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"female": 200,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"male": 100,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"total": 300,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"createdAt": "2019-03-09T10:00:17.772Z",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"updatedAt": "2019-03-09T10:00:17.772Z",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"subLocations": [],<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"parentLocationId": "5c838e83eac8a9f683c10185"<br>&nbsp;&nbsp;&nbsp;},<br/>&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "5c8416b416a2fc6bc4be2111",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Jinja Municipality",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"female": 2006,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"male": 1001,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"total": 3007,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"createdAt": "2019-03-09T10:00:17.772Z",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"updatedAt": "2019-03-09T10:00:17.772Z",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"subLocations": [],<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"parentLocationId": "5c838e83eac8a9f683c10185"<br>&nbsp;&nbsp;&nbsp;}<br/>]<br/>|
| GET | `/locations/:id` | Get Single Location by **id**<br/><br/>**Sample Response**<br/><pre>{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "5c838e83eac8a9f683c10185",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Jinja",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"parentLocationId": null,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"male": 1101,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"female": 2206,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"total": 3007,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"subLocations": [<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "5c838eb1eac8a9f683c10187",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Butembe"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "5c8416b416a2fc6bc4be2111",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Jinja Municipality"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"createdAt": "2019-03-09T09:59:31.791Z",<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"updatedAt": "2019-03-10T14:36:50.920Z"<br>&nbsp;&nbsp;&nbsp;}</pre>|
| PUT | `/locations/:id` | Update location name, female and male population<br/><br/>**Sample Payload**<br/><br/><pre>{<br/>&nbsp;&nbsp;&nbsp;"name": "Butembe County",<br/>&nbsp;&nbsp;&nbsp;"famale": 200, <br/>&nbsp;&nbsp;&nbsp;"male": 199,<br>}</pre><br/>**Sample Response**<br/><br/><pre>{<br/>&nbsp;&nbsp;"message": "Location updated succesfully"<br/>}</pre>|
| DELETE | `/locations/:id` | Delete location. Replace location id in the url with the actually ID of the location.<br/><br/>**Sample Response**<br/><br/><pre>{<br/>&nbsp;&nbsp;"message": "Location deleted succesfully"<br/>}</pre>|

## Testing
The Application tests can be executed by running the command below on your console.

```
npm test
```