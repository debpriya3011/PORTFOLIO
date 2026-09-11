import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import https from 'https';
import multer from 'multer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateSecret, generateURI, verify } from 'otplib';
import QRCode from 'qrcode';
import db from './database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS - In production, frontend and server are same origin, so CORS not strictly needed
// But we'll allow localhost for dev and the Render domain for production
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL || '*'
  ],
  credentials: true
}));


app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', routes: ['education', 'certifications', 'experience', 'auth'] });
});


const PORT = process.env.PORT || 3001;




/* ================= EMAIL ================= */

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD
//   }
// });


const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 2525,
  secure: false, // TLS
  auth: {
    user: process.env.BREVO_LOGIN, // Your Brevo login email
    pass: process.env.BREVO_SMTP_KEY // Your SMTP key from Brevo
  }
});

transporter.verify()
  .then(() => console.log('✅ BREVO SMTP ready'))
  .catch(err => console.error('❌ BREVO Error:', err.message));

/* ================= UPLOADS ================= */

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) =>
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

app.use('/uploads', express.static(uploadsDir));

/* ================= HELPERS ================= */

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* ================= AUTH ================= */


app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;

  console.log('📧 OTP request for:', email);

  if (email !== 'debpriya3011@gmail.com') {
    console.log('❌ Unauthorized email:', email);
    return res.status(403).json({ error: 'Unauthorized email' });
  }

  const otp = generateOTP();
  const expiry = Date.now() + 10 * 60 * 1000;

  try {
    console.log('🔐 Generated OTP:', otp, 'for:', email);

    // First, check if user exists
    const userCheck = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
    console.log('👤 User check result:', userCheck.rows);

    // Update or insert OTP
    const result = await db.query(
      `UPDATE users SET otp=$1, otp_expires=$2 WHERE email=$3 RETURNING *`,
      [otp, expiry, email]
    );
    console.log('✅ Database update result:', result.rows);

    // Send email via Brevo
    console.log('📨 Attempting to send email via Brevo...');
    const mailResult = await transporter.sendMail({
      from: email, // Your Brevo sender email
      to: email,
      subject: '🔐 Your Admin Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div style="background: white; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Admin Login Verification</h2>
            <p style="font-size: 16px; color: #666; text-align: center;">Your One-Time Password (OTP) is:</p>
            <div style="background: linear-gradient(135deg, #8b5cf6, #d946ef); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: white; font-size: 48px; letter-spacing: 8px; margin: 0; font-family: monospace;">${otp}</h1>
            </div>
            <p style="font-size: 14px; color: #999; text-align: center;">This OTP is valid for <strong>10 minutes</strong>.</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">If you didn't request this login, please ignore this email.</p>
          </div>
        </div>
      `
    });

    console.log('✅ Email sent successfully via Brevo:', mailResult.messageId);
    console.log('📧 Email details:', {
      to: mailResult.envelope.to,
      from: mailResult.envelope.from,
      messageId: mailResult.messageId
    });

    res.json({ success: true, message: 'OTP sent successfully to your email' });
  } catch (err) {
    console.error('❌ OTP Error Details:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      command: err.command
    });

    // Provide more specific error messages
    let errorMessage = 'Failed to send OTP';
    if (err.code === 'ETIMEDOUT') {
      errorMessage = 'Connection timeout - please try again';
    } else if (err.code === 'EAUTH') {
      errorMessage = 'Authentication failed - check SMTP credentials';
    } else if (err.code === 'ESOCKET') {
      errorMessage = 'Socket error - network issue';
    }

    res.status(500).json({ error: errorMessage + ': ' + err.message });
  }
});

// app.post('/api/auth/send-otp', async (req, res) => {
//   const { email } = req.body;

//   if (email !== 'debpriya3011@gmail.com')
//     return res.status(403).json({ error: 'Unauthorized email' });

//   const otp = generateOTP();
//   const expiry = Date.now() + 10 * 60 * 1000;

//   try {
//     await db.query(
//       `UPDATE users SET otp=$1, otp_expires=$2 WHERE email=$3`,
//       [otp, expiry, email]
//     );

//     await transporter.sendMail({
//       from: process.env.GMAIL_USER,
//       to: email,
//       subject: '🔐 Your Login OTP',
//       html: `<h2>Your OTP: ${otp}</h2><p>Valid for 10 minutes</p>`
//     });

//     res.json({ success: true, message: 'OTP sent' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to send OTP' });
//   }
// });

app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const result = await db.query(
      `SELECT * FROM users WHERE email=$1 AND otp=$2 AND otp_expires>$3`,
      [email, otp, Date.now()]
    );

    if (!result.rows.length)
      return res.status(401).json({ error: 'Invalid or expired OTP' });

    await db.query(
      `UPDATE users SET otp=NULL, otp_expires=NULL WHERE email=$1`,
      [email]
    );

    res.json({ success: true, token: 'demo-token-' + Date.now() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Google credential is required' });
  }

  try {
    // Verify ID token with Google TokenInfo endpoint
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);

    if (!response.ok) {
      const errInfo = await response.json().catch(() => ({}));
      return res.status(401).json({ error: errInfo.error_description || 'Invalid Google token' });
    }

    const payload = await response.json();
    const email = payload.email;
    const emailVerified = payload.email_verified === 'true' || payload.email_verified === true;

    if (!emailVerified) {
      return res.status(401).json({ error: 'Google email is not verified' });
    }

    if (email !== 'debpriya3011@gmail.com') {
      console.log('❌ Google Auth Access Denied for:', email);
      return res.status(403).json({ error: 'Access denied: You do not have permission to access the admin portal' });
    }

    console.log('✅ Google Auth Success for:', email);
    res.json({ success: true, token: 'demo-token-' + Date.now(), user: { email, name: payload.name } });
  } catch (err) {
    console.error('❌ Google Auth Error:', err);
    res.status(500).json({ error: 'Google auth failed: ' + err.message });
  }
});

/* ================= GOOGLE AUTHENTICATOR (TOTP 2FA) ================= */

const ADMIN_EMAIL = 'debpriya3011@gmail.com';

// Check TOTP status for admin
app.get('/api/auth/totp/status', async (req, res) => {
  try {
    const result = await db.query(`SELECT totp_enabled FROM users WHERE email=$1`, [ADMIN_EMAIL]);
    const enabled = result.rows.length > 0 ? Boolean(result.rows[0].totp_enabled) : false;
    res.json({ enabled });
  } catch (err) {
    console.error('❌ TOTP status check error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Setup TOTP for admin
app.post('/api/auth/totp/setup', async (req, res) => {
  const { email } = req.body;
  const targetEmail = email || ADMIN_EMAIL;

  if (targetEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Unauthorized: Google Authenticator is reserved for admin only' });
  }

  try {
    const secret = generateSecret();
    const otpauth = generateURI({ secret, label: ADMIN_EMAIL, issuer: 'Debpriya Portfolio Admin' });
    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    // Save secret temporarily in database
    await db.query(
      `UPDATE users SET totp_secret=$1 WHERE email=$2`,
      [secret, ADMIN_EMAIL]
    );

    res.json({
      success: true,
      secret,
      qrCodeUrl,
      otpauth
    });
  } catch (err) {
    console.error('❌ TOTP setup error:', err);
    res.status(500).json({ error: 'Failed to generate TOTP secret: ' + err.message });
  }
});

// Verify code during setup and enable 2FA
app.post('/api/auth/totp/verify-setup', async (req, res) => {
  const { email, code } = req.body;
  const targetEmail = email || ADMIN_EMAIL;

  if (targetEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (!code || code.length !== 6) {
    return res.status(400).json({ error: 'Please enter a valid 6-digit code' });
  }

  try {
    const result = await db.query(`SELECT totp_secret FROM users WHERE email=$1`, [ADMIN_EMAIL]);
    if (!result.rows.length || !result.rows[0].totp_secret) {
      return res.status(400).json({ error: 'TOTP setup not initiated' });
    }

    const secret = result.rows[0].totp_secret;
    const verifyRes = await verify({ token: code.trim(), secret });
    const isValid = Boolean(verifyRes?.valid);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid code. Please check your Google Authenticator app and try again.' });
    }

    // Mark TOTP as enabled
    await db.query(`UPDATE users SET totp_enabled=TRUE WHERE email=$1`, [ADMIN_EMAIL]);

    res.json({ success: true, message: 'Google Authenticator 2FA has been successfully enabled for Admin!' });
  } catch (err) {
    console.error('❌ TOTP verify-setup error:', err);
    res.status(500).json({ error: 'Verification failed: ' + err.message });
  }
});

// Verify TOTP code for admin login
app.post('/api/auth/totp/verify', async (req, res) => {
  const { email, code } = req.body;
  const targetEmail = email || ADMIN_EMAIL;

  if (targetEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Access denied: Google Authenticator is reserved for admin only' });
  }

  if (!code || code.length !== 6) {
    return res.status(400).json({ error: 'Please enter a valid 6-digit code from your app' });
  }

  try {
    const result = await db.query(`SELECT totp_secret, totp_enabled FROM users WHERE email=$1`, [ADMIN_EMAIL]);
    if (!result.rows.length || !result.rows[0].totp_enabled || !result.rows[0].totp_secret) {
      return res.status(400).json({ error: 'Google Authenticator is not enabled for this account' });
    }

    const secret = result.rows[0].totp_secret;
    const verifyRes = await verify({ token: code.trim(), secret });
    const isValid = Boolean(verifyRes?.valid);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid or expired Google Authenticator code' });
    }

    res.json({ success: true, token: 'demo-token-' + Date.now(), user: { email: ADMIN_EMAIL, role: 'admin' } });
  } catch (err) {
    console.error('❌ TOTP login error:', err);
    res.status(500).json({ error: 'Authentication failed: ' + err.message });
  }
});

// Disable TOTP 2FA for admin
app.post('/api/auth/totp/disable', async (req, res) => {
  const { email, code } = req.body;
  const targetEmail = email || ADMIN_EMAIL;

  if (targetEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const result = await db.query(`SELECT totp_secret, totp_enabled FROM users WHERE email=$1`, [ADMIN_EMAIL]);
    if (result.rows.length && result.rows[0].totp_secret && code) {
      const verifyRes = await verify({ token: code.trim(), secret: result.rows[0].totp_secret });
      const isValid = Boolean(verifyRes?.valid);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid authenticator code' });
      }
    }

    await db.query(
      `UPDATE users SET totp_enabled=FALSE, totp_secret=NULL WHERE email=$1`,
      [ADMIN_EMAIL]
    );

    res.json({ success: true, message: 'Google Authenticator 2FA disabled successfully' });
  } catch (err) {
    console.error('❌ TOTP disable error:', err);
    res.status(500).json({ error: 'Failed to disable 2FA: ' + err.message });
  }
});

/* ================= CONTACT MESSAGES ================= */

// Submit a new contact message
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    // 1. Insert into messages table
    const result = await db.query(
      `INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *`,
      [name.trim(), email.trim(), message.trim()]
    );
    const savedMessage = result.rows[0];

    // 2. Send Email alert via Brevo SMTP to admin
    try {
      await transporter.sendMail({
        from: 'debpriya3011@gmail.com',
        to: 'debpriya3011@gmail.com',
        subject: `📩 New Portfolio Message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
            <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px; margin-top: 0;">New Contact Form Submission</h2>
            <p style="font-size: 14px; color: #475569;"><strong>From:</strong> ${name} (&lt;<a href="mailto:${email}">${email}</a>&gt;)</p>
            <p style="font-size: 14px; color: #475569;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1; margin-top: 15px;">
              <p style="font-size: 15px; color: #1e293b; white-space: pre-wrap; margin: 0;">${message}</p>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 20px; text-align: center;">This message was received from your portfolio contact form.</p>
          </div>
        `
      });
      console.log('✅ Email notification sent to admin for message ID:', savedMessage.id);
    } catch (mailErr) {
      console.error('⚠️ Could not send email notification:', mailErr.message);
    }

    res.json({ success: true, message: 'Message sent successfully!', data: savedMessage });
  } catch (err) {
    console.error('❌ Error saving contact message:', err);
    res.status(500).json({ error: 'Failed to send message: ' + err.message });
  }
});

// Get all messages for admin
app.get('/api/messages', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM messages ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching messages:', err);
    res.status(500).json({ error: err.message });
  }
});

// Mark message as read
app.put('/api/messages/:id/read', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`UPDATE messages SET is_read=TRUE WHERE id=$1 RETURNING *`, [id]);
    res.json({ success: true, message: result.rows[0] });
  } catch (err) {
    console.error('❌ Error marking message as read:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete message
app.delete('/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM messages WHERE id=$1`, [id]);
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting message:', err);
    res.status(500).json({ error: err.message });
  }
});


/* ================= LINKEDIN SCRAPER ================= */




app.get('/api/scrape-linkedin', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let cleanUrl = url.trim().replace(/[\.\,\s]+$/, '');
  let parsedUrl;
  try {
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    parsedUrl = new URL(cleanUrl);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  if (!parsedUrl.hostname.includes('linkedin.com')) {
    return res.status(400).json({ error: 'Only LinkedIn URLs are supported' });
  }

  try {
    const html = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'www.linkedin.com',
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      };

      const request = https.request(options, (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      });

      request.on('error', reject);
      request.end();
    });

    // ============================
    // AUTHOR NAME
    // ============================
    const authorMatch = html.match(
      /aria-label="View profile for ([^"]+)"/
    );
    const author = authorMatch ? authorMatch[1] : 'Unknown';

    // ============================
    // AUTHOR IMAGE
    // ============================
    const imageMatch = html.match(
      /profile-displayphoto-shrink_[^"]+\/([^"]+)/
    );

    const authorImageMatch = html.match(
      /data-delayed-url="(https:\/\/media\.licdn\.com\/dms\/image\/[^"]+)"/
    );

    const author_image = authorImageMatch
      ? authorImageMatch[1].replace(/&amp;/g, '&')
      : null;

    // ============================
    // LIKES
    // ============================
    const likesMatch = html.match(
      /data-test-id="social-actions__reaction-count">\s*(\d+)/
    );

    const likes = likesMatch ? parseInt(likesMatch[1]) : 0;

    // ============================
    // COMMENTS COUNT
    // ============================
    const commentsMatch = html.match(
      /data-num-comments="(\d+)"/
    );

    const commentsCount = commentsMatch
      ? parseInt(commentsMatch[1])
      : 0;


    const jsonLdMatch = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
    );

    let jsonLdData = {};
    if (jsonLdMatch) {
      jsonLdData = JSON.parse(jsonLdMatch[1]);
    }

    // ✅ Extract comments properly
    const commentsData = (jsonLdData.comment || []).map(c => ({
      name: c.author?.name || "Unknown",
      text: c.text,
      likes: c.interactionStatistic?.userInteractionCount || 0,
      date: c.datePublished
    }));

    let images = [];

    if (Array.isArray(jsonLdData.image)) {
      images = jsonLdData.image.map(i => (i.url || i).replace(/&amp;/g, '&'));
    } else if (typeof jsonLdData.image === "object" && jsonLdData.image !== null) {
      images = [(jsonLdData.image.url || '').replace(/&amp;/g, '&')];
    } else if (typeof jsonLdData.image === "string") {
      images = [jsonLdData.image.replace(/&amp;/g, '&')];
    }

    res.json({
      success: true,
      author_name: author,
      author_image: author_image,
      content: jsonLdData.articleBody,
      likes: likes || 0,
      comments: commentsCount || 0,
      comments_data: commentsData,   // 🔥 THIS WAS MISSING
      images: images
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to scrape LinkedIn post' });
  }
});



/* ================= POSTS ================= */

app.post('/api/posts', async (req, res) => {
  const {
    linkedin_url,
    author_name,
    author_image,
    content,
    images,
    likes,
    comments,
    comments_data
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO posts
      (linkedin_url, author_name, author_image, content, images, likes, comments, comments_data)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id`,
      [
        linkedin_url,
        author_name,
        author_image,
        content,
        Array.isArray(images) ? JSON.stringify(images) : (images || '[]'),
        likes || 0,
        comments || 0,
        typeof comments_data === 'string' ? comments_data : JSON.stringify(comments_data || [])
      ]
    );

    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts', async (_, res) => {
  const result = await db.query(`SELECT * FROM posts ORDER BY created_at DESC`);
  res.json(result.rows);
});

app.delete('/api/posts/:id', async (req, res) => {
  await db.query(`DELETE FROM posts WHERE id=$1`, [req.params.id]);
  res.json({ success: true });
});

// Update likes/comments for a single post
app.patch('/api/posts/:id', async (req, res) => {
  const { likes, comments } = req.body;
  try {
    await db.query(
      `UPDATE posts SET likes=$1, comments=$2 WHERE id=$3`,
      [likes ?? 0, comments ?? 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Re-scrape all posts and update their likes/comments in the DB
app.post('/api/posts/refresh-all', async (req, res) => {
  try {
    const result = await db.query(`SELECT id, linkedin_url FROM posts`);
    const posts = result.rows;

    const updates = await Promise.allSettled(
      posts.map(async (post) => {
        try {
          let cleanUrl = post.linkedin_url.trim();
          if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl;
          const parsedUrl = new URL(cleanUrl);

          const html = await new Promise((resolve, reject) => {
            const options = {
              hostname: 'www.linkedin.com',
              path: parsedUrl.pathname + parsedUrl.search,
              method: 'GET',
              headers: { 'User-Agent': 'Mozilla/5.0' }
            };
            const request = https.request(options, (response) => {
              const chunks = [];
              response.on('data', (chunk) => chunks.push(chunk));
              response.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
            });
            request.on('error', reject);
            request.end();
          });

          const likesMatch = html.match(/data-test-id="social-actions__reaction-count">\s*(\d+)/);
          const likes = likesMatch ? parseInt(likesMatch[1]) : 0;

          const commentsMatch = html.match(/data-num-comments="(\d+)"/);
          const comments = commentsMatch ? parseInt(commentsMatch[1]) : 0;

          await db.query(
            `UPDATE posts SET likes=$1, comments=$2 WHERE id=$3`,
            [likes, comments, post.id]
          );

          return { id: post.id, likes, comments, ok: true };
        } catch (err) {
          console.error(`Failed to refresh post ${post.id}:`, err.message);
          return { id: post.id, ok: false, error: err.message };
        }
      })
    );

    // Now return fresh posts
    const fresh = await db.query(`SELECT * FROM posts ORDER BY created_at DESC`);
    res.json({ success: true, posts: fresh.rows, updates: updates.map(u => u.value || u.reason) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= IMAGES ================= */

app.post('/api/images', upload.single('image'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const url = `/uploads/${file.filename}`;

  const result = await db.query(
    `INSERT INTO images (filename,url,alt,category)
     VALUES ($1,$2,$3,$4)
     RETURNING id`,
    [file.filename, url, req.body.alt || '', req.body.category || 'general']
  );

  res.json({ success: true, id: result.rows[0].id, url });
});

app.get('/api/images', async (_, res) => {
  const result = await db.query(`SELECT * FROM images ORDER BY created_at DESC`);
  res.json(result.rows);
});

app.delete('/api/images/:id', async (req, res) => {
  await db.query(`DELETE FROM images WHERE id=$1`, [req.params.id]);
  res.json({ success: true });
});

/* ================= SKILLS ================= */

app.get('/api/skills', async (_, res) => {
  const result = await db.query(`SELECT * FROM skills ORDER BY display_order`);
  res.json(result.rows);
});

app.post('/api/skills', async (req, res) => {
  const { name, category, sources, display_order } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO skills (name,category,sources,display_order)
       VALUES ($1,$2,$3,$4)
       RETURNING id`,
      [name, category, sources, display_order || 0]
    );

    console.log('✅ Skill inserted:', { name, category, id: result.rows[0]?.id });
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('❌ Error inserting skill:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/skills/:id', async (req, res) => {
  await db.query(`DELETE FROM skills WHERE id=$1`, [req.params.id]);
  res.json({ success: true });
});

/* ================= EXPERIENCE ================= */

app.get('/api/experience', async (_, res) => {
  const result = await db.query(`SELECT * FROM experience ORDER BY display_order`);
  res.json(result.rows);
});

app.post('/api/experience', async (req, res) => {
  const {
    company, role, type, location,
    start_date, end_date, description,
    skills, display_order
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO experience
       (company,role,type,location,start_date,end_date,description,skills,display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
      [company, role, type, location, start_date, end_date, description, skills, display_order || 0]
    );

    console.log('✅ Experience inserted:', { company, role, id: result.rows[0]?.id });
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('❌ Error inserting experience:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/experience/:id', async (req, res) => {
  await db.query(`DELETE FROM experience WHERE id=$1`, [req.params.id]);
  res.json({ success: true });
});

/* ================= EDUCATION ================= */

app.get('/api/education', async (_, res) => {
  const result = await db.query(`SELECT * FROM education ORDER BY display_order`);
  res.json(result.rows);
});

app.post('/api/education', async (req, res) => {
  const {
    institution, degree, field_of_study,
    start_date, end_date, grade, skills
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO education
       (institution,degree,field_of_study,start_date,end_date,grade,skills)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id`,
      [institution, degree, field_of_study, start_date, end_date, grade, skills]
    );

    console.log('✅ Education inserted:', { institution, degree, id: result.rows[0]?.id });
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('❌ Error inserting education:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ================= CERTIFICATIONS ================= */

app.get('/api/certifications', async (_, res) => {
  const result = await db.query(`SELECT * FROM certifications ORDER BY display_order`);
  res.json(result.rows);
});

app.post('/api/certifications', async (req, res) => {
  const {
    name, issuer, issue_date,
    expiry_date, credential_id,
    credential_url, skills
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO certifications
       (name,issuer,issue_date,expiry_date,credential_id,credential_url,skills)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id`,
      [name, issuer, issue_date, expiry_date, credential_id, credential_url, skills]
    );

    console.log('✅ Certification inserted:', { name, issuer, id: result.rows[0]?.id });
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('❌ Error inserting certification:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ================= WORKFLOWS ================= */

app.get('/api/workflows', async (_, res) => {
  const result = await db.query(`SELECT * FROM workflows ORDER BY display_order`);
  res.json(result.rows);
});

app.post('/api/workflows', async (req, res) => {
  const { name, description, nodes, edges } = req.body;

  const result = await db.query(
    `INSERT INTO workflows (name,description,nodes,edges)
     VALUES ($1,$2,$3,$4)
     RETURNING id`,
    [name, description, nodes || [], edges || []]
  );

  res.json({ success: true, id: result.rows[0].id });
});

app.delete('/api/workflows/:id', async (req, res) => {
  await db.query(`DELETE FROM workflows WHERE id=$1`, [req.params.id]);
  res.json({ success: true });
});

/* ================= SERVE FRONTEND (SPA) ================= */

const distPath = path.join(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');

// Always serve static files if dist exists
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log(`✅ Static files will be served from: ${distPath}`);
}

// ALWAYS define the fallback route for SPA (must be after all API routes)
// This ensures any non-API route gets index.html for client-side routing
app.get(/(.*)/, (req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('❌ index.html not found at:', indexPath);
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Build Error</title>
          <style>body { font-family: monospace; margin: 40px; }</style>
        </head>
        <body>
          <h1>❌ Build Failed</h1>
          <p>The app build is missing. Check Render logs.</p>
          <p>Expected: <code>${indexPath}</code></p>
          <p>Exists: ${fs.existsSync(distPath) ? 'dist/ folder found' : 'dist/ folder not found'}</p>
        </body>
      </html>
    `);
  }
});

/* ================= ERROR HANDLER (Must be last) ================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

/* ================= SERVER ================= */

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📁 Working directory: ${process.cwd()}`);
  console.log(`📁 Server directory: ${__dirname}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`📁 Looking for dist at: ${distPath}`);

  if (fs.existsSync(distPath)) {
    console.log(`✅ FOUND dist/ folder`);
    const files = fs.readdirSync(distPath).slice(0, 10);
    console.log(`📄 Contents: ${files.join(', ')}`);
    if (fs.existsSync(indexPath)) {
      console.log(`✅ FOUND index.html - SPA routing ready!`);
    } else {
      console.error(`❌ index.html NOT found in dist/`);
    }
  } else {
    console.error(`❌ dist/ folder NOT found at ${distPath}`);
  }
  console.log('');
});