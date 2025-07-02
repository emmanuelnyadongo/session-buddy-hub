import express from 'express';
import { body, validationResult } from 'express-validator';
import { getRow, getRows, execute } from '../config/database.js';

const router = express.Router();

// Validation middleware
const validateSession = [
  body('title').trim().isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('subject').trim().isLength({ min: 1, max: 100 }).withMessage('Subject is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)'),
  body('duration').isInt({ min: 30, max: 480 }).withMessage('Duration must be between 30 and 480 minutes'),
  body('max_participants').optional().isInt({ min: 1, max: 50 }).withMessage('Max participants must be between 1 and 50'),
  body('location').optional().trim().isLength({ max: 255 }).withMessage('Location too long'),
  body('is_online').optional().isBoolean().withMessage('is_online must be a boolean'),
  body('meeting_link').optional().isURL().withMessage('Valid meeting link required if online')
];

// Get all study sessions
router.get('/', async (req, res) => {
  try {
    const { 
      subject, 
      date, 
      creator_id, 
      limit = 20, 
      offset = 0,
      status = 'active'
    } = req.query;

    let query = `
      SELECT ss.*, 
             u.name as creator_name,
             u.avatar_url as creator_avatar,
             sp.user_id as is_participant
      FROM study_sessions ss
      JOIN users u ON ss.creator_id = u.id
      LEFT JOIN session_participants sp ON ss.id = sp.session_id AND sp.user_id = $1
      WHERE ss.status = $2
    `;
    
    const params = [req.user.id, status];
    let paramCount = 3;

    if (subject) {
      query += ` AND ss.subject ILIKE $${paramCount++}`;
      params.push(`%${subject}%`);
    }

    if (date) {
      query += ` AND ss.date = $${paramCount++}`;
      params.push(date);
    }

    if (creator_id) {
      query += ` AND ss.creator_id = $${paramCount++}`;
      params.push(creator_id);
    }

    query += ` ORDER BY ss.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(limit, offset);

    const sessions = await getRows(query, params);

    res.json({
      success: true,
      data: { sessions }
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sessions'
    });
  }
});

// Get single study session
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await getRow(`
      SELECT ss.*, 
             u.name as creator_name,
             u.avatar_url as creator_avatar,
             u.email as creator_email
      FROM study_sessions ss
      JOIN users u ON ss.creator_id = u.id
      WHERE ss.id = $1
    `, [sessionId]);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Get participants
    const participants = await getRows(`
      SELECT u.id, u.name, u.avatar_url, sp.joined_at
      FROM session_participants sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.session_id = $1 AND sp.status = 'joined'
      ORDER BY sp.joined_at
    `, [sessionId]);

    // Check if current user is participant
    const isParticipant = await getRow(`
      SELECT id FROM session_participants 
      WHERE session_id = $1 AND user_id = $2 AND status = 'joined'
    `, [sessionId, req.user.id]);

    res.json({
      success: true,
      data: { 
        session,
        participants,
        isParticipant: !!isParticipant
      }
    });

  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get session'
    });
  }
});

// Create new study session
router.post('/', validateSession, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      subject,
      date,
      start_time,
      duration,
      max_participants = 10,
      location,
      is_online = false,
      meeting_link,
      tags
    } = req.body;

    // Validate online session has meeting link
    if (is_online && !meeting_link) {
      return res.status(400).json({
        success: false,
        message: 'Meeting link is required for online sessions'
      });
    }

    const result = await execute(`
      INSERT INTO study_sessions (
        title, description, subject, date, start_time, duration, 
        max_participants, location, creator_id, is_online, meeting_link, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `, [
      title, description, subject, date, start_time, duration,
      max_participants, location, req.user.id, is_online, meeting_link, tags
    ]);

    if (result === 0) {
      throw new Error('Failed to create session');
    }

    // Get the created session
    const newSession = await getRow(`
      SELECT ss.*, u.name as creator_name, u.avatar_url as creator_avatar
      FROM study_sessions ss
      JOIN users u ON ss.creator_id = u.id
      WHERE ss.creator_id = $1
      ORDER BY ss.created_at DESC
      LIMIT 1
    `, [req.user.id]);

    res.status(201).json({
      success: true,
      message: 'Study session created successfully',
      data: { session: newSession }
    });

  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session'
    });
  }
});

// Update study session
router.put('/:sessionId', validateSession, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { sessionId } = req.params;

    // Check if session exists and user is creator
    const session = await getRow(`
      SELECT id, creator_id, status FROM study_sessions WHERE id = $1
    `, [sessionId]);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.creator_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the creator can update this session'
      });
    }

    if (session.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update non-active session'
      });
    }

    const {
      title,
      description,
      subject,
      date,
      start_time,
      duration,
      max_participants,
      location,
      is_online,
      meeting_link,
      tags
    } = req.body;

    // Validate online session has meeting link
    if (is_online && !meeting_link) {
      return res.status(400).json({
        success: false,
        message: 'Meeting link is required for online sessions'
      });
    }

    await execute(`
      UPDATE study_sessions SET
        title = $1, description = $2, subject = $3, date = $4, start_time = $5,
        duration = $6, max_participants = $7, location = $8, is_online = $9,
        meeting_link = $10, tags = $11, updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
    `, [
      title, description, subject, date, start_time, duration,
      max_participants, location, is_online, meeting_link, tags, sessionId
    ]);

    // Get updated session
    const updatedSession = await getRow(`
      SELECT ss.*, u.name as creator_name, u.avatar_url as creator_avatar
      FROM study_sessions ss
      JOIN users u ON ss.creator_id = u.id
      WHERE ss.id = $1
    `, [sessionId]);

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: { session: updatedSession }
    });

  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update session'
    });
  }
});

// Delete study session
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Check if session exists and user is creator
    const session = await getRow(`
      SELECT id, creator_id, status FROM study_sessions WHERE id = $1
    `, [sessionId]);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.creator_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the creator can delete this session'
      });
    }

    // Soft delete by setting status to cancelled
    await execute(`
      UPDATE study_sessions SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [sessionId]);

    res.json({
      success: true,
      message: 'Session cancelled successfully'
    });

  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel session'
    });
  }
});

// Join study session
router.post('/:sessionId/join', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Check if session exists and is active
    const session = await getRow(`
      SELECT id, creator_id, max_participants, current_participants, status
      FROM study_sessions WHERE id = $1
    `, [sessionId]);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Session is not active'
      });
    }

    if (session.creator_id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Creator cannot join their own session'
      });
    }

    if (session.current_participants >= session.max_participants) {
      return res.status(400).json({
        success: false,
        message: 'Session is full'
      });
    }

    // Check if already joined
    const existingParticipation = await getRow(`
      SELECT id FROM session_participants 
      WHERE session_id = $1 AND user_id = $2
    `, [sessionId, req.user.id]);

    if (existingParticipation) {
      return res.status(400).json({
        success: false,
        message: 'Already joined this session'
      });
    }

    // Join session
    await execute(`
      INSERT INTO session_participants (session_id, user_id, status)
      VALUES ($1, $2, 'joined')
    `, [sessionId, req.user.id]);

    res.json({
      success: true,
      message: 'Successfully joined the session'
    });

  } catch (error) {
    console.error('Join session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join session'
    });
  }
});

// Leave study session
router.post('/:sessionId/leave', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Check if session exists
    const session = await getRow(`
      SELECT id, creator_id FROM study_sessions WHERE id = $1
    `, [sessionId]);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.creator_id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Creator cannot leave their own session'
      });
    }

    // Check if user is participant
    const participation = await getRow(`
      SELECT id FROM session_participants 
      WHERE session_id = $1 AND user_id = $2 AND status = 'joined'
    `, [sessionId, req.user.id]);

    if (!participation) {
      return res.status(400).json({
        success: false,
        message: 'Not a participant of this session'
      });
    }

    // Leave session
    await execute(`
      UPDATE session_participants SET status = 'left'
      WHERE session_id = $1 AND user_id = $2
    `, [sessionId, req.user.id]);

    res.json({
      success: true,
      message: 'Successfully left the session'
    });

  } catch (error) {
    console.error('Leave session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave session'
    });
  }
});

// Get session messages
router.get('/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Check if user is participant or creator
    const session = await getRow(`
      SELECT id, creator_id FROM study_sessions WHERE id = $1
    `, [sessionId]);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const isParticipant = await getRow(`
      SELECT id FROM session_participants 
      WHERE session_id = $1 AND user_id = $2 AND status = 'joined'
    `, [sessionId, req.user.id]);

    if (session.creator_id !== req.user.id && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const messages = await getRows(`
      SELECT sm.*, u.name as user_name, u.avatar_url as user_avatar
      FROM session_messages sm
      JOIN users u ON sm.user_id = u.id
      WHERE sm.session_id = $1
      ORDER BY sm.created_at DESC
      LIMIT $2 OFFSET $3
    `, [sessionId, limit, offset]);

    res.json({
      success: true,
      data: { messages: messages.reverse() }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages'
    });
  }
});

// Send message to session
router.post('/:sessionId/messages', [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters')
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

    const { sessionId } = req.params;
    const { message, message_type = 'text' } = req.body;

    // Check if user is participant or creator
    const session = await getRow(`
      SELECT id, creator_id FROM study_sessions WHERE id = $1
    `, [sessionId]);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const isParticipant = await getRow(`
      SELECT id FROM session_participants 
      WHERE session_id = $1 AND user_id = $2 AND status = 'joined'
    `, [sessionId, req.user.id]);

    if (session.creator_id !== req.user.id && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Send message
    await execute(`
      INSERT INTO session_messages (session_id, user_id, message, message_type)
      VALUES ($1, $2, $3, $4)
    `, [sessionId, req.user.id, message, message_type]);

    res.json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

module.exports = router; 