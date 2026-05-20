const mongoose = require('mongoose');
const { getIsConnected } = require('../config/db');
const { JsonTask } = require('./jsonDb');

const TaskSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },
  assignedTo: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const MongoTask = mongoose.model('Task', TaskSchema);

const TaskModel = {
  async find(query = {}) {
    if (getIsConnected()) {
      return await MongoTask.find(query).sort({ createdAt: 1 });
    } else {
      return await JsonTask.find(query);
    }
  },

  async findById(id) {
    if (getIsConnected()) {
      return await MongoTask.findById(id);
    } else {
      return await JsonTask.findById(id);
    }
  },

  async create(fields) {
    if (getIsConnected()) {
      return await MongoTask.create(fields);
    } else {
      return await JsonTask.create(fields);
    }
  },

  async findByIdAndUpdate(id, updateFields, options = {}) {
    if (getIsConnected()) {
      return await MongoTask.findByIdAndUpdate(
        id,
        { ...updateFields, updatedAt: new Date() },
        { new: true, ...options }
      );
    } else {
      return await JsonTask.findByIdAndUpdate(id, updateFields, options);
    }
  },

  async findByIdAndDelete(id) {
    if (getIsConnected()) {
      return await MongoTask.findByIdAndDelete(id);
    } else {
      return await JsonTask.findByIdAndDelete(id);
    }
  },

  async deleteMany(query = {}) {
    if (getIsConnected()) {
      return await MongoTask.deleteMany(query);
    } else {
      return await JsonTask.deleteMany(query);
    }
  }
};

module.exports = TaskModel;
