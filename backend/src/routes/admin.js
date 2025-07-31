import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

const router = express.Router();

// Create test user endpoint (only for development/staging)
router.post('/create-test-user', async (req, res) => {
  try {
    // Only allow in development or staging
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ 
        success: false, 
        message: 'Test user creation not allowed in production' 
      });
    }

    console.log('Creating test user...');

    // Check if users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Creating users table...');
      
      // Create users table
      await pool.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          university VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Users table created');
    }

    // Check if test user already exists
    const existingUser = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      ['test@example.com']
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Test user already exists',
        user: {
          email: 'test@example.com',
          password: 'password123'
        }
      });
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const result = await pool.query(`
      INSERT INTO users (name, email, password, university)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, university, created_at
    `, [
      'Test User',
      'test@example.com',
      hashedPassword,
      'Test University'
    ]);
    
    console.log('Test user created:', result.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Test user created successfully',
      user: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        university: result.rows[0].university,
        password: 'password123' // Return plain password for testing
      }
    });

  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test user',
      error: error.message
    });
  }
});

// Initialize database tables endpoint (only for development/staging)
router.post('/init-db', async (req, res) => {
  try {
    // Only allow in development or staging
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ 
        success: false, 
        message: 'Database initialization not allowed in production' 
      });
    }

    console.log('Initializing database tables...');

    // Read and execute schema
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    await pool.query(schema);
    
    console.log('Database tables initialized successfully');

    res.status(200).json({
      success: true,
      message: 'Database tables initialized successfully'
    });

  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing database',
      error: error.message
    });
  }
});

// List all users endpoint (only for development/staging)
router.get('/users', async (req, res) => {
  try {
    // Only allow in development or staging
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ 
        success: false, 
        message: 'User listing not allowed in production' 
      });
    }

    const result = await pool.query('SELECT id, name, email, university, created_at FROM users');
    
    res.status(200).json({
      success: true,
      users: result.rows
    });

  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing users',
      error: error.message
    });
  }
});

export default router; 