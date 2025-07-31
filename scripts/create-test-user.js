import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration for staging
const pool = new Pool({
  host: 'sbhub-db.postgres.database.azure.com',
  port: 5432,
  database: 'session_buddy_hub_staging',
  user: 'pgadmin',
  password: 'SessionBuddyHub2024!',
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTestUser() {
  try {
    console.log('Connecting to staging database...');
    
    // Test the connection
    const client = await pool.connect();
    console.log('✅ Connected to database successfully');
    
    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ Users table does not exist. Creating it...');
      
      // Create users table
      await client.query(`
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
      console.log('✅ Users table created');
    } else {
      console.log('✅ Users table exists');
    }
    
    // Check if test user already exists
    const existingUser = await client.query(
      'SELECT id, email FROM users WHERE email = $1',
      ['test@example.com']
    );
    
    if (existingUser.rows.length > 0) {
      console.log('⚠️  Test user already exists with email: test@example.com');
      console.log('User ID:', existingUser.rows[0].id);
    } else {
      // Create test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const result = await client.query(`
        INSERT INTO users (name, email, password, university)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, university, created_at
      `, [
        'Test User',
        'test@example.com',
        hashedPassword,
        'Test University'
      ]);
      
      console.log('✅ Test user created successfully!');
      console.log('User details:', result.rows[0]);
    }
    
    // List all users
    const allUsers = await client.query('SELECT id, name, email, university, created_at FROM users');
    console.log('\n📋 All users in database:');
    allUsers.rows.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, University: ${user.university}`);
    });
    
    client.release();
    
    console.log('\n🎉 Test user setup complete!');
    console.log('📧 Email: test@example.com');
    console.log('🔑 Password: password123');
    console.log('🌐 Login URL: https://sbhubwebapp2024-staging.azurewebsites.net');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
createTestUser(); 