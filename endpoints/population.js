'use strict';
var restifyErrors = require('restify-errors');
var Location = require('../models/location');

var _createLocation = async function create(req, res, next){
	let location = new Location(req.body);
	location.ancestors = [];
	let parentLocationId = location.parent ? `${location.parent}` : null

	// Update ancestors list/ array
	if(location.parent) {
		location.ancestors.push(parentLocationId);
		await Location.findById(parentLocationId, function(error, parent){
			if(error || !parent) {
				return next(new restifyErrors.BadRequestError('Invalid parent location'));
			};

			if(parent.ancestors.length > 0){
				parent.ancestors.forEach((ancestor) => {
					location.ancestors.push(ancestor);
				});
			}
		});
	};

	location.save((error, location) => {
		if(error) {
			return next(new restifyErrors.BadRequestError('An error occured saving location. Make sure all required params are passed'))
		};

		res.send(201, formatLocation(location));
		return next();
	});
}

var _getAllLocations = async function getLocations(req, res, next){
	let allLocations = [];
	await Location.find({ }, (error, locations) => {
		if(error) {
			return next(new restifyErrors.InternalError('An error occured getting locations'));
		}

		if(locations){
			locations.forEach(async (location) => {
				let locInfo = await calculateLocationPopulationFromChildren(location);
				if(locInfo.subLocations.length){
					allLocations.push(locInfo);
				} else {
					allLocations.push(formatLocation(location));
				}

				if(locations.length == allLocations.length){
					res.send(200, allLocations);
					return next();
				}
			});
		}
	});	
}

var _getLocation = async function getLocation(req, res, next){
	let locationId = req.params.id;
	await Location.findById(locationId, async (error, location) => {
		if(error || !location) {
			return next(new restifyErrors.NotFoundError('Location not found.'));
		}

		let areaPopulation = await calculateLocationPopulationFromChildren(location);
		if(areaPopulation.subLocations.length){
			res.send(200, areaPopulation)
			return next();
		}

		location = formatLocation(location)
		res.send(200, location);
		return next();
	})
}

var _updateLocation = function update(req, res, next){
	const locationId = req.params.id;
	let locationUpdate = req.body;
	if(locationUpdate.parent){
		return next( new restifyErrors.BadRequestError('Updatng location parent is not allowed. First delete it and create a new one.'));
	}

	if(locationUpdate.total){
		return next( new restifyErrors.BadRequestError('You can not update location total.'));
	}

	locationUpdate.updatedAt = Date.now();
	Location.update({_id: locationId}, locationUpdate, async (error, result) =>{
		if(error || !result) {
			return next( new restifyErrors.NotFoundError('Location not found.'));
		}

		res.send(200, { message: 'Location updated succesfully' });
		return next();
	});
}

var calculateLocationPopulationFromChildren = async function calculatePopulation(location) {
	let areaPopulation = {
		id: location.id,
		name: location.name,
		parentLocationId: location.parent,
		male: 0,
		female: 0,
		total: 0,
		subLocations: [],
		createdAt: location.createdAt,
		updatedAt: location.updatedAt
	};
	let nestedLocations = [], ancestorsList = [];
	let locationId = location._id;

	await Location.find({ancestors: `${locationId}`}, (error, ancestors) => {
		if (error) { return false }
		if (ancestors.length){
			ancestors.forEach((ancestor) => {
				nestedLocations.push(ancestor);
				ancestor.ancestors.forEach((item) => {
					if(!ancestorsList.includes(`${item}`)){ ancestorsList.push(item)}
				})
			});
		}
	});

	nestedLocations.forEach((loc) => {
		// Sum Subloactions of children that are not parents of any other location
		if(!ancestorsList.includes(`${loc._id}`)){
			areaPopulation.female += loc.female;
			areaPopulation.male += loc.male;
		}
		// Update Sublocations List with immediate children
		if(loc.parent == location._id) {
			areaPopulation.subLocations.push({ id: loc._id, name: loc.name })
		}
	})
	areaPopulation.total = areaPopulation.male + areaPopulation.female;

	return areaPopulation;
}

var formatLocation = function location(location){
	let formattedLocation = {};
	formattedLocation.id = location._id;
	formattedLocation.name = location.name;
	formattedLocation.female = location.female;
	formattedLocation.male = location.male;
	formattedLocation.total = location.male + location.female;
	formattedLocation.createdAt = location.createdAt;
	formattedLocation.updatedAt = location.updatedAt;
	formattedLocation.subLocations = [];
	formattedLocation.parentLocationId = location.parent

	return formattedLocation;
}

var _deleteLocation = function deleteLoc(req, res, next){
	let locationId = req.params.id;
	Location.remove({_id: locationId}, (error, deletedLoc) => {
		if(error || !deletedLoc){
			return next(new restifyErrors.NotFoundError('Location not found'));
		}

		if(deletedLoc){
			Location.deleteMany({ ancestors: `${locationId}`}, (error, result) => {
				if(error) {
					return next(new restifyErrors.InternalError('An error occurred deleting sub locations'));
				}

				if(!result) {
					return next(new restifyErrors.BadRequestError('Location not found'));
				}

				res.send(200, { message: 'Location deleted susccesfully' });
				return next();
			});
		}
	});
}

module.exports = {
	getAllLocations: _getAllLocations,
	createLocation: _createLocation,
	getLocation: _getLocation,
	updateLocation: _updateLocation,
	deleteLocation: _deleteLocation
}
