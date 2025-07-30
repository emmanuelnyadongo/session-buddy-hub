import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Setup environment for testing
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import after setup
import { query } from '../config/database.js';
import app from '../server.js';

// Mock the database query function
const originalQuery = query;
query.mockImplementation = (fn) => {
  // Simple mock implementation
  return fn;
};

describe('Authentication Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      // Mock database responses
      query.mockResolvedValueOnce({ rows: [] }); // Check if user exists
      query.mockResolvedValueOnce({ 
        rows: [{ 
          id: 1, 
          username: userData.username, 
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          created_at: new Date()
        }] 
      }); // Insert user

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('username', userData.username);
      expect(response.body.user).toHaveProperty('email', userData.email);
    });

    it('should return 400 for missing required fields', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com'
        // Missing password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 409 for existing email', async () => {
      const userData = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      // Mock database to return existing user
      query.mockResolvedValueOnce({ 
        rows: [{ id: 1, email: userData.email }] 
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('error', 'Email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Mock database response
      query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          email: loginData.email,
          password: hashedPassword,
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User',
          is_verified: true
        }]
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', loginData.email);
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Mock database response
      query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          email: loginData.email,
          password: await bcrypt.hash('correctpassword', 10),
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User',
          is_verified: true
        }]
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });
  });
}); 