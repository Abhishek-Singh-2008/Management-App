const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getFallbackDbPath } = require('../config/db');

function readData() {
  const dbPath = getFallbackDbPath();
  try {
    const content = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return { users: [], projects: [], tasks: [] };
  }
}

function writeData(data) {
  const dbPath = getFallbackDbPath();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const JsonUser = {
  async findOne({ email }) {
    const data = readData();
    const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  async findById(id) {
    const data = readData();
    const user = data.users.find(u => u.id === id);
    return user || null;
  },

  async create(userFields) {
    const data = readData();
    const newUser = {
      id: uuidv4(),
      createdAt: new Date(),
      ...userFields
    };
    data.users.push(newUser);
    writeData(data);
    return newUser;
  }
};

const JsonProject = {
  async find(query = {}) {
    const data = readData();
    let results = data.projects;
    if (query.userId) {
      results = results.filter(p => p.userId === query.userId);
    }
    // Sort projects by createdAt (descending) by default, or ascending if we want.
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findById(id) {
    const data = readData();
    const project = data.projects.find(p => p.id === id);
    return project || null;
  },

  async create(projectFields) {
    const data = readData();
    const newProject = {
      id: uuidv4(),
      createdAt: new Date(),
      ...projectFields
    };
    data.projects.push(newProject);
    writeData(data);
    return newProject;
  },

  async findByIdAndUpdate(id, updateFields, options = {}) {
    const data = readData();
    const index = data.projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    data.projects[index] = {
      ...data.projects[index],
      ...updateFields
    };
    writeData(data);
    return data.projects[index];
  },

  async findByIdAndDelete(id) {
    const data = readData();
    const index = data.projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    const deletedProject = data.projects[index];
    data.projects.splice(index, 1);
    
    // Cascade delete tasks related to this project
    data.tasks = data.tasks.filter(t => t.projectId !== id);
    
    writeData(data);
    return deletedProject;
  }
};

const JsonTask = {
  async find(query = {}) {
    const data = readData();
    let results = data.tasks;
    if (query.projectId) {
      results = results.filter(t => t.projectId === query.projectId);
    }
    return results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },

  async findById(id) {
    const data = readData();
    const task = data.tasks.find(t => t.id === id);
    return task || null;
  },

  async create(taskFields) {
    const data = readData();
    const newTask = {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'todo',
      ...taskFields
    };
    data.tasks.push(newTask);
    writeData(data);
    return newTask;
  },

  async findByIdAndUpdate(id, updateFields, options = {}) {
    const data = readData();
    const index = data.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    data.tasks[index] = {
      ...data.tasks[index],
      ...updateFields,
      updatedAt: new Date()
    };
    writeData(data);
    return data.tasks[index];
  },

  async findByIdAndDelete(id) {
    const data = readData();
    const index = data.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const deletedTask = data.tasks[index];
    data.tasks.splice(index, 1);
    writeData(data);
    return deletedTask;
  },

  async deleteMany(query = {}) {
    const data = readData();
    let originalCount = data.tasks.length;
    if (query.projectId) {
      data.tasks = data.tasks.filter(t => t.projectId !== query.projectId);
    }
    writeData(data);
    return { deletedCount: originalCount - data.tasks.length };
  }
};

module.exports = {
  JsonUser,
  JsonProject,
  JsonTask,
  readData,
  writeData
};
