process.env.NODE_ENV = 'test';
process.env.PORT = 1234;

let chai = require('chai');
let chaiHttp = require('chai-http');
let Location = require('../models/location');
let db = require('../models/db');
const server = require('../server');
let request = require('supertest');
const expect = chai.expect;
let should = chai.should();

let parent, childOne, childTwo, subLocationParent

describe('Location tests "/locations"', () => {
	before(async function (){
		// Clear Database
		await Location.deleteMany({}, () => {});
		
		location = new Location({ name: 'Jinja', female: 10, male: 10 });
		await location.save((err, loc) => {});

		parentLocation = { name: 'Buikwe', female: 20, male: 15 };
		childLocationOne = { name: 'Jinja Municipality', female: 10, male: 10, parent: location._id };
		childLocationTwo = { name: 'Bugembe', female: 10, male: 10 };

	});

	after(function () {});

	describe('Creating a Location', () => {
		it('should create a parent location succesfully', done => {
			request(server)
				.post('/locations')
				.send(parentLocation)
				.end((err, res) => {
					expect(res.statusCode).to.equal(201);
					expect(res.body.name).to.equal('Buikwe', done());
				});
		});

		it('should create a sub location succesfully', done => {
			request(server)
				.post('/locations')
				.send(childLocationOne)
				.end((err, res) => {
					expect(res.statusCode).to.equal(201);
					expect(res.body.name).to.eq('Jinja Municipality', done());
				});
		});

		it('should not create a location with non existing parent', done => {
			childLocationOne.parent = '53cb6b9b4f4ddef1ad47f94390'
			request(server)
				.post('/locations')
				.send(childLocationOne)
				.end((err, res) => {
					expect(res.statusCode).to.equal(400);
					expect(res.body.message).to.eq('Invalid parent location', done());
				});
		});

		it('should not create a with missing name, male or female values', done => {
			delete childLocationTwo.male;
			delete childLocationTwo.female;
			delete childLocationTwo.name;
			request(server)
				.post('/locations')
				.send(childLocationTwo)
				.end((err, res) => {
					expect(res.statusCode).to.equal(400);
					expect(res.body.message).to.eq('An error occured saving location. Make sure all required params are passed', done());
				});
		});
	});

	describe('Getting Locations "/locations', ()=> {
		it('should return all locations', done => {
			request(server)
				.get('/locations')
				.end((err, res) => {
					expect(res.statusCode).to.equal(200);
					expect(res.body.length).to.eq(3, done());
				});
		});

		it('should return a single location succesfully', done => {
			request(server)
				.get(`/locations/${location._id}`)
				.end((err, res) => {
					expect(res.statusCode).to.equal(200);
					expect(res.body.name).to.equal('Jinja', done());
				});
		});

		it('should not return non-existing location', done => {
			request(server)
				.get(`/locations/${location._id}o`)
				.end((err, res) => {
					expect(res.statusCode).to.equal(404);
					expect(res.body.message).to.eq('Location not found.', done());
				});
		});

		it('should return parent location population equal to total sublocations population', done => {
			request(server)
				.get(`/locations/${location._id}`)
				.end((err, res) => {
					expect(res.statusCode).to.equal(200);
					expect(res.body.total).to.equal((childLocationOne.male + childLocationOne.female), done());
				});
		});
	});

	describe('Updating Location', () => {
		it('should update location name, male and female fields succesfully', done => {
			request(server)
				.put(`/locations/${location._id}`)
				.send({male: 12, female: 13})
				.end((err,res) => {
					expect(res.statusCode).to.equal(200);
					expect(res.body.message).to.eq('Location updated succesfully', done());
				});
		});

		it('should not change / update locations parent', done => {
			request(server)
				.put(`/locations/${location._id}`)
				.send({male: 12, female: 13, parent: 'loc-parent'})
				.end((err, res) => {
					expect(res.statusCode).to.equal(400);
					expect(res.body.message).to.eq('Updatng location parent is not allowed. First delete it and create a new one.', done());
				});
		});

		it('should not update location total', done => {
			request(server)
				.put(`/locations/${location._id}`)
				.send({male: 12, female: 13, total: 25})
				.end((err, res) => {
					expect(res.statusCode).to.equal(400);
					expect(res.body.message).to.eq('You can not update location total.', done());
				});
		});

		it('should not update non existing location', done => {
			request(server)
				.put(`/locations/${location._id}o`)
				.send({male: 12, female: 13})
				.end((err, res) => {
					expect(res.statusCode).to.equal(404);
					expect(res.body.message).to.eq('Location not found.', done());
				});
		});
	});

	describe('Delete Location', () => {
		it('should delete location succesfully', done => {
			request(server)
				.del(`/locations/${location._id}`)
				.end((err, res) => {
					expect(res.statusCode).to.equal(200);
					expect(res.body.message).to.equal('Location deleted susccesfully', done());
				});
		});

		it('should not delete non existing', done => {
			request(server)
				.del(`/locations/53cb6b9b4f4ddef1ad47f943`)
				.end((err, res) => {
					expect(res.statusCode).to.equal(404);
					expect(res.body.message).to.eq('Location not found', done());
				});
		});

	});
});