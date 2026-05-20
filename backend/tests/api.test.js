const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');
const { getFallbackDbPath } = require('../src/config/db');

describe('✨ Mini Project Management App API Test Suite', () => {
  let authToken = '';
  let testProjectId = '';

  beforeAll(() => {
    // Force environment to test
    process.env.NODE_ENV = 'test';
    // Clear out test db file
    const dbPath = getFallbackDbPath();
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  afterAll(() => {
    // Cleanup test db file
    const dbPath = getFallbackDbPath();
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  // 1. AUTH REGISTER & LOGIN TESTS
  describe('🔒 Authentication APIs', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toEqual('testuser@example.com');
      authToken = res.body.token;
    });

    it('should prevent registration with a duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'differentpassword'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should log in an existing user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
    });
  });

  // 2. PROJECT & TASK CRUD TESTS
  describe('📂 Projects & Tasks APIs', () => {
    it('should deny access to projects without a valid token', async () => {
      const res = await request(app).get('/api/projects');
      expect(res.statusCode).toEqual(401);
    });

    it('should return an empty list of projects for a new user', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it('should create a new project successfully', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Super Secret App',
          description: 'A revolutionary new application'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.project.name).toEqual('Super Secret App');
      expect(res.body.project).toHaveProperty('id');
      testProjectId = res.body.project.id;
    });

    it('should list projects including their task counts', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].taskCount).toBe(0);
    });

    it('should create a task in the project', async () => {
      const res = await request(app)
        .post(`/api/projects/${testProjectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Design UI mockup',
          description: 'Draft the visual mockups'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.task.title).toEqual('Design UI mockup');
      expect(res.body.task.status).toEqual('todo');
    });

    it('should retrieve a project by ID with its tasks', async () => {
      const res = await request(app)
        .get(`/api/projects/${testProjectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.project.name).toEqual('Super Secret App');
      expect(res.body.tasks.length).toBe(1);
      expect(res.body.tasks[0].title).toEqual('Design UI mockup');
    });
  });
});
