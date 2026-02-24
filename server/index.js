import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import https from 'https';
import multer from 'multer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import db from './database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS - allow your Render frontend
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL  // We'll set this in Render
  ]
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
  port: 587,
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

    // Send email
    console.log('📨 Attempting to send email via Gmail...');
    const mailResult = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: '🔐 Your Login OTP',
      html: `<h2>Your OTP: ${otp}</h2><p>Valid for 10 minutes</p>`
    });
    console.log('✅ Email sent successfully:', mailResult.messageId);

    res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    console.error('❌ OTP Error Details:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    res.status(500).json({ error: 'Failed to send OTP: ' + err.message });
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

/* ================= LINKEDIN SCRAPER ================= */




app.get('/api/scrape-linkedin', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const html = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'www.linkedin.com',
        path: url.replace('https://www.linkedin.com', ''),
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => resolve(data));
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

    res.json({
      success: true,
      author_name: author,
      author_image:author_image,
      content: jsonLdData.articleBody,
      likes: likes || 0,
      comments: commentsCount || 0,
      comments_data: commentsData,   // 🔥 THIS WAS MISSING
      images: jsonLdData.image?.map(i => i.url) || []
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
        images || [],
        likes || 0,
        comments || 0,
        comments_data || []
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

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

/* ================= SERVER ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
});