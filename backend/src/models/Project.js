const mongoose = require('mongoose');
const { getIsConnected } = require('../config/db');
const { JsonProject } = require('./jsonDb');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MongoProject = mongoose.model('Project', ProjectSchema);

const ProjectModel = {
  async find(query = {}) {
    if (getIsConnected()) {
      return await MongoProject.find(query).sort({ createdAt: -1 });
    } else {
      return await JsonProject.find(query);
    }
  },

  async findById(id) {
    if (getIsConnected()) {
      return await MongoProject.findById(id);
    } else {
      return await JsonProject.findById(id);
    }
  },

  async create(fields) {
    if (getIsConnected()) {
      return await MongoProject.create(fields);
    } else {
      return await JsonProject.create(fields);
    }
  },

  async findByIdAndUpdate(id, updateFields, options = {}) {
    if (getIsConnected()) {
      return await MongoProject.findByIdAndUpdate(id, updateFields, { new: true, ...options });
    } else {
      return await JsonProject.findByIdAndUpdate(id, updateFields, options);
    }
  },

  async findByIdAndDelete(id) {
    if (getIsConnected()) {
      // In MongoDB, we also need to delete tasks in a cascade
      // We will do cascade deletion in the task model or project controller.
      // But let's delete the project first
      return await MongoProject.findByIdAndDelete(id);
    } else {
      return await JsonProject.findByIdAndDelete(id);
    }
  }
};

module.exports = ProjectModel;
