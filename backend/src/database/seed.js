import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    // Sample users
    const users = [
      {
        name: 'Alex Chen',
        email: 'alex@university.edu',
        password_hash: hashedPassword,
        university: 'Stanford University',
        bio: 'Computer Science major, passionate about AI and machine learning'
      },
      {
        name: 'Maria Garcia',
        email: 'maria@university.edu',
        password_hash: hashedPassword,
        university: 'MIT',
        bio: 'Mathematics enthusiast, love solving complex problems'
      },
      {
        name: 'John Smith',
        email: 'john@university.edu',
        password_hash: hashedPassword,
        university: 'Harvard University',
        bio: 'Physics student, interested in quantum mechanics'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@university.edu',
        password_hash: hashedPassword,
        university: 'UC Berkeley',
        bio: 'Chemistry major, research assistant in organic chemistry lab'
      },
      {
        name: 'David Kim',
        email: 'david@university.edu',
        password_hash: hashedPassword,
        university: 'Yale University',
        bio: 'Computer Science and Mathematics double major'
      }
    ];

    // Insert users
    console.log('👥 Creating sample users...');
    const userIds = [];
    for (const user of users) {
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash, university, bio, email_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [user.name, user.email, user.password_hash, user.university, user.bio, true]
      );
      userIds.push(result.rows[0].id);
    }

    // Sample study sessions
    const sessions = [
      {
        title: 'Advanced Calculus Study Group',
        description: 'Preparing for the midterm exam on integration techniques and differential equations',
        subject: 'Mathematics',
        date: '2024-07-02',
        start_time: '14:00',
        duration: 120,
        max_participants: 6,
        location: 'Library Study Room 3',
        creator_id: userIds[1], // Maria
        tags: ['calculus', 'integration', 'differential-equations']
      },
      {
        title: 'React Development Workshop',
        description: 'Building a full-stack application with React and Node.js. We\'ll cover hooks, state management, and API integration',
        subject: 'Computer Science',
        date: '2024-07-03',
        start_time: '16:30',
        duration: 180,
        max_participants: 8,
        location: 'Computer Lab A',
        creator_id: userIds[0], // Alex
        tags: ['react', 'javascript', 'web-development']
      },
      {
        title: 'Organic Chemistry Lab Prep',
        description: 'Reviewing lab procedures and safety protocols for upcoming organic chemistry experiments',
        subject: 'Chemistry',
        date: '2024-07-04',
        start_time: '10:00',
        duration: 150,
        max_participants: 5,
        location: 'Chemistry Building Lab 2',
        creator_id: userIds[3], // Sarah
        tags: ['chemistry', 'lab-safety', 'organic-chemistry']
      },
      {
        title: 'European History Discussion',
        description: 'Analyzing the causes and effects of WWI, focusing on political and social changes',
        subject: 'History',
        date: '2024-07-05',
        start_time: '13:00',
        duration: 90,
        max_participants: 4,
        location: 'History Department Conference Room',
        creator_id: userIds[2], // John
        tags: ['history', 'wwi', 'european-history']
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to ML algorithms, focusing on supervised learning and neural networks',
        subject: 'Computer Science',
        date: '2024-07-06',
        start_time: '15:00',
        duration: 120,
        max_participants: 10,
        location: 'AI Research Center',
        creator_id: userIds[4], // David
        is_online: true,
        meeting_link: 'https://meet.google.com/abc-defg-hij',
        tags: ['machine-learning', 'ai', 'neural-networks']
      }
    ];

    // Insert sessions
    console.log('📚 Creating sample study sessions...');
    const sessionIds = [];
    for (const session of sessions) {
      const result = await pool.query(
        `INSERT INTO study_sessions (
          title, description, subject, date, start_time, duration, 
          max_participants, location, creator_id, tags, is_online, meeting_link
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
        [
          session.title, session.description, session.subject, session.date,
          session.start_time, session.duration, session.max_participants,
          session.location, session.creator_id, session.tags,
          session.is_online || false, session.meeting_link
        ]
      );
      sessionIds.push(result.rows[0].id);
    }

    // Sample session participants
    console.log('👥 Adding participants to sessions...');
    const participants = [
      { session_id: sessionIds[0], user_id: userIds[0] }, // Alex joins Maria's calc session
      { session_id: sessionIds[0], user_id: userIds[2] }, // John joins Maria's calc session
      { session_id: sessionIds[0], user_id: userIds[3] }, // Sarah joins Maria's calc session
      { session_id: sessionIds[1], user_id: userIds[1] }, // Maria joins Alex's React session
      { session_id: sessionIds[1], user_id: userIds[4] }, // David joins Alex's React session
      { session_id: sessionIds[2], user_id: userIds[0] }, // Alex joins Sarah's chem session
      { session_id: sessionIds[3], user_id: userIds[1] }, // Maria joins John's history session
      { session_id: sessionIds[4], user_id: userIds[0] }, // Alex joins David's ML session
      { session_id: sessionIds[4], user_id: userIds[1] }, // Maria joins David's ML session
      { session_id: sessionIds[4], user_id: userIds[2] }  // John joins David's ML session
    ];

    for (const participant of participants) {
      await pool.query(
        'INSERT INTO session_participants (session_id, user_id, status) VALUES ($1, $2, $3)',
        [participant.session_id, participant.user_id, 'joined']
      );
    }

    // Sample user relationships (friends)
    console.log('🤝 Creating user relationships...');
    const relationships = [
      { follower_id: userIds[0], following_id: userIds[1] }, // Alex follows Maria
      { follower_id: userIds[1], following_id: userIds[0] }, // Maria follows Alex
      { follower_id: userIds[0], following_id: userIds[2] }, // Alex follows John
      { follower_id: userIds[2], following_id: userIds[0] }, // John follows Alex
      { follower_id: userIds[1], following_id: userIds[3] }, // Maria follows Sarah
      { follower_id: userIds[3], following_id: userIds[1] }, // Sarah follows Maria
      { follower_id: userIds[4], following_id: userIds[0] }, // David follows Alex
      { follower_id: userIds[0], following_id: userIds[4] }  // Alex follows David
    ];

    for (const relationship of relationships) {
      await pool.query(
        'INSERT INTO user_relationships (follower_id, following_id, status) VALUES ($1, $2, $3)',
        [relationship.follower_id, relationship.following_id, 'accepted']
      );
    }

    // Sample session messages
    console.log('💬 Adding sample messages...');
    const messages = [
      { session_id: sessionIds[0], user_id: userIds[1], message: 'Welcome everyone! Let\'s start with integration by parts.' },
      { session_id: sessionIds[0], user_id: userIds[0], message: 'Great! I have some practice problems ready.' },
      { session_id: sessionIds[1], user_id: userIds[0], message: 'Today we\'ll build a todo app with React hooks!' },
      { session_id: sessionIds[1], user_id: userIds[4], message: 'Perfect! I\'ve been wanting to learn more about hooks.' },
      { session_id: sessionIds[4], user_id: userIds[4], message: 'We\'ll cover linear regression and neural networks today.' },
      { session_id: sessionIds[4], user_id: userIds[0], message: 'Excited to learn about ML algorithms!' }
    ];

    for (const message of messages) {
      await pool.query(
        'INSERT INTO session_messages (session_id, user_id, message, message_type) VALUES ($1, $2, $3, $4)',
        [message.session_id, message.user_id, message.message, 'text']
      );
    }

    // Sample session reviews
    console.log('⭐ Adding sample reviews...');
    const reviews = [
      { session_id: sessionIds[0], reviewer_id: userIds[0], rating: 5, review_text: 'Excellent session! Maria explained everything clearly.' },
      { session_id: sessionIds[1], reviewer_id: userIds[1], rating: 4, review_text: 'Great workshop, learned a lot about React!' },
      { session_id: sessionIds[2], reviewer_id: userIds[0], rating: 5, review_text: 'Very helpful lab preparation session.' }
    ];

    for (const review of reviews) {
      await pool.query(
        'INSERT INTO session_reviews (session_id, reviewer_id, rating, review_text) VALUES ($1, $2, $3, $4)',
        [review.session_id, review.reviewer_id, review.rating, review.review_text]
      );
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created ${users.length} users, ${sessions.length} sessions, and sample data.`);
    console.log('🔑 Default password for all users: password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase; 