import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendVerificationEmail = async (email, name) => {
  try {
    const verificationToken = require('crypto').randomBytes(32).toString('hex');
    
    // Update user with verification token
    const { execute } = await import('../config/database.js');
    await execute(
      'UPDATE users SET verification_token = $1 WHERE email = $2',
      [verificationToken, email]
    );

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@sessionbuddyhub.com',
      to: email,
      subject: 'Verify your email - Session Buddy Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Session Buddy Hub!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering with Session Buddy Hub. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards,<br>The Session Buddy Hub Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@sessionbuddyhub.com',
      to: email,
      subject: 'Reset your password - Session Buddy Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The Session Buddy Hub Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
};

export const sendSessionReminder = async (email, name, session) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@sessionbuddyhub.com',
      to: email,
      subject: `Reminder: ${session.title} - Session Buddy Hub`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Study Session Reminder</h2>
          <p>Hi ${name},</p>
          <p>This is a reminder for your upcoming study session:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${session.title}</h3>
            <p><strong>Subject:</strong> ${session.subject}</p>
            <p><strong>Date:</strong> ${new Date(session.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${session.start_time}</p>
            <p><strong>Duration:</strong> ${session.duration} minutes</p>
            ${session.location ? `<p><strong>Location:</strong> ${session.location}</p>` : ''}
            ${session.meeting_link ? `<p><strong>Meeting Link:</strong> <a href="${session.meeting_link}">${session.meeting_link}</a></p>` : ''}
          </div>
          <p>Don't forget to prepare for your session!</p>
          <p>Best regards,<br>The Session Buddy Hub Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Session reminder sent to ${email}`);
  } catch (error) {
    console.error('Failed to send session reminder:', error);
    throw error;
  }
}; 