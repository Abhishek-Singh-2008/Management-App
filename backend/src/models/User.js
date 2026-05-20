const mongoose = require('mongoose');
const { getIsConnected } = require('../config/db');
const { JsonUser } = require('./jsonDb');

// Define Mongoose Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MongoUser = mongoose.model('User', UserSchema);

// Dynamic proxy object that routes to MongoDB or local JSON db
const UserModel = {
  async findOne(query) {
    if (getIsConnected()) {
      return await MongoUser.findOne(query);
    } else {
      return await JsonUser.findOne(query);
    }
  },

  async findById(id) {
    if (getIsConnected()) {
      return await MongoUser.findById(id);
    } else {
      return await JsonUser.findById(id);
    }
  },

  async create(fields) {
    if (getIsConnected()) {
      // In mongoose, the schema stores "password" but let's make it consistent.
      // We will hash passwords in controllers before calling create, which is standard.
      return await MongoUser.create(fields);
    } else {
      return await JsonUser.create(fields);
    }
  }
};

module.exports = UserModel;
