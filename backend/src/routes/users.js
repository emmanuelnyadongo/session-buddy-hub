import express from 'express';
import { body, validationResult } from 'express-validator';
import { getRow, getRows, execute } from '../config/database.js';

const router = express.Router();

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await getRow(
      `SELECT id, name, email, university, avatar_url, bio, created_at, last_login, email_verified
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
});

// Update user profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
  body('university').optional().trim().isLength({ max: 255 }).withMessage('University name too long'),
  body('bio').optional().trim().isLength({ max: 1000 }).withMessage('Bio too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, university, bio } = req.body;

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }

    if (university !== undefined) {
      updates.push(`university = $${paramCount++}`);
      values.push(university);
    }

    if (bio !== undefined) {
      updates.push(`bio = $${paramCount++}`);
      values.push(bio);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(req.user.id);
    const query = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount}`;
    
    await execute(query, values);

    // Get updated user
    const updatedUser = await getRow(
      `SELECT id, name, email, university, avatar_url, bio, created_at, last_login, email_verified
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Get user's study sessions
router.get('/sessions', async (req, res) => {
  try {
    const { type = 'all', limit = 10, offset = 0 } = req.query;

    let query = '';
    let params = [req.user.id];

    switch (type) {
      case 'created':
        query = `
          SELECT ss.*, 
                 u.name as creator_name,
                 u.avatar_url as creator_avatar
          FROM study_sessions ss
          JOIN users u ON ss.creator_id = u.id
          WHERE ss.creator_id = $1
          ORDER BY ss.created_at DESC
          LIMIT $2 OFFSET $3
        `;
        params.push(limit, offset);
        break;

      case 'joined':
        query = `
          SELECT ss.*, 
                 u.name as creator_name,
                 u.avatar_url as creator_avatar,
                 sp.joined_at
          FROM study_sessions ss
          JOIN users u ON ss.creator_id = u.id
          JOIN session_participants sp ON ss.id = sp.session_id
          WHERE sp.user_id = $1 AND sp.status = 'joined'
          ORDER BY sp.joined_at DESC
          LIMIT $2 OFFSET $3
        `;
        params.push(limit, offset);
        break;

      default: // all
        query = `
          SELECT ss.*, 
                 u.name as creator_name,
                 u.avatar_url as creator_avatar,
                 sp.joined_at,
                 CASE WHEN ss.creator_id = $1 THEN 'created'
                      WHEN sp.user_id IS NOT NULL THEN 'joined'
                      ELSE 'available'
                 END as user_relation
          FROM study_sessions ss
          JOIN users u ON ss.creator_id = u.id
          LEFT JOIN session_participants sp ON ss.id = sp.session_id AND sp.user_id = $1
          WHERE ss.status = 'active'
          ORDER BY ss.created_at DESC
          LIMIT $2 OFFSET $3
        `;
        params.push(limit, offset);
    }

    const sessions = await getRows(query, params);

    res.json({
      success: true,
      data: { sessions }
    });

  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sessions'
    });
  }
});

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    // Get various statistics
    const stats = await getRow(`
      SELECT 
        (SELECT COUNT(*) FROM study_sessions WHERE creator_id = $1) as sessions_created,
        (SELECT COUNT(*) FROM session_participants WHERE user_id = $1 AND status = 'joined') as sessions_joined,
        (SELECT COUNT(*) FROM user_relationships WHERE follower_id = $1 AND status = 'accepted') as following_count,
        (SELECT COUNT(*) FROM user_relationships WHERE following_id = $1 AND status = 'accepted') as followers_count,
        (SELECT COALESCE(SUM(duration_minutes), 0) FROM user_session_history WHERE user_id = $1) as total_study_hours
    `, [req.user.id]);

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics'
    });
  }
});

// Search users
router.get('/search', [
  body('query').optional().trim().isLength({ min: 1 }).withMessage('Search query is required')
], async (req, res) => {
  try {
    const { query = '', limit = 10, offset = 0 } = req.query;

    if (!query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const users = await getRows(`
      SELECT id, name, email, university, avatar_url, bio, created_at
      FROM users 
      WHERE (name ILIKE $1 OR email ILIKE $1 OR university ILIKE $1)
        AND id != $2 
        AND is_active = true
      ORDER BY name
      LIMIT $3 OFFSET $4
    `, [`%${query}%`, req.user.id, limit, offset]);

    res.json({
      success: true,
      data: { users }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

// Get user by ID (public profile)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await getRow(`
      SELECT id, name, university, avatar_url, bio, created_at
      FROM users 
      WHERE id = $1 AND is_active = true
    `, [userId]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's public sessions
    const sessions = await getRows(`
      SELECT ss.*, u.name as creator_name
      FROM study_sessions ss
      JOIN users u ON ss.creator_id = u.id
      WHERE ss.creator_id = $1 AND ss.status = 'active'
      ORDER BY ss.created_at DESC
      LIMIT 5
    `, [userId]);

    res.json({
      success: true,
      data: { 
        user,
        sessions
      }
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
});

export { router }; 