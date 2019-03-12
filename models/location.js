'use strict';

const mongoose = require('mongoose');

// Location Schema
const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Location name is must be provided']
  },
  male: {
    type: Number,
    min: 0,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: 'Male value must be a positive integer'
    }
  },
  female: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Female value must be a positive integer'
    }
  },
  ancestors: {
    type: Array,
    default: []
  },
  parent: {
    type: String,
    required: false,
    default: null
  },
  total: {
    type: Number,
    required: false,
    default: 0
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

  //Model 
  let Location = mongoose.model('Location', LocationSchema);

  module.exports = Location;
