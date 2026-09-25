# Debpriya Santra — Engineering Portfolio & Architecture Blueprints

🌐 **Live Demo:** [portfolio-7xje.onrender.com](https://portfolio-7xje.onrender.com/)

A modern, high-performance personal portfolio and engineering platform engineered with a bespoke dark/light technical design system, interactive data pipeline visualization, production automation blueprints, real-time LinkedIn activity sync, and an authenticated administrative suite.

---

## 📸 Application Previews

| Home Page & Pipeline Visualization                            | API Architecture & Blueprints                                                     |
| :-------------------------------------------------------------:| :---------------------------------------------------------------------------------:|
| <img src="screenshots/home.png" width="480" alt="Home Page"/> | <img src="screenshots/blueprints.png" width="480" alt="Architecture Blueprints"/> |

| LinkedIn Activity & Engineering Notes | Admin Authentication & 2FA Portal |
| :---: | :---: |
| <img src="screenshots/posts.png" width="480" alt="LinkedIn Activity"/> | <img src="screenshots/admin login.png" width="480" alt="Admin Portal"/> |

---

## ⚡ Key Highlights & Architecture

### 1. Interactive Pipeline & Workflow Telemetry
- Real-time telemetry nodes demonstrating end-to-end data pipelines: ingestion, transformation, queueing, storage, and analytics.
- Fluid pulse animations, status badges, and interactive tooltips.

### 2. Production API Architecture & Automation Blueprints
- In-depth technical guides for distributed workflows (e.g. *Pinterest v5 Asynchronous Upload Engine*, *PyViz Python AST Debugger*, *Mutual Fund Analytics Suite*).
- Multi-stage sequential execution flows, endpoint schemas, sanitized parameters, and direct downloadable JSON assets.

### 3. LinkedIn Activity & Engineering Notes
- Integrated LinkedIn scraper engine storing posts, metrics (likes/comments), and media payloads into Neon PostgreSQL.
- Instant manual sync and background updates.

### 4. Secure Admin Suite with Multi-Factor 2FA
- **Google OAuth:** One-tap sign-in restricted to authorized admin credentials.
- **Google Authenticator (TOTP 2FA):** QR code provisioning and 6-digit TOTP verification.
- **Email OTP:** Automated one-time passcode delivery powered by Brevo SMTP.
- **Content & Inbox Management:** Dedicated dashboard tabs for managing posts, contact inbox messages, work history, skills, and security keys.

### 5. Interactive Chatbot Assistant
- Floating digital assistant widget with conversational navigation shortcuts to blueprints, guides, and activity feeds.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 7
- **Styling:** Tailwind CSS + Bespoke High-Contrast Design System
- **Animation & Motion:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** Sonner Toast Engine

### Backend & Cloud Services
- **Runtime:** Node.js + Express.js (ES Modules)
- **Database:** Neon Serverless PostgreSQL
- **Authentication:** Google OAuth 2.0 + TOTP (Speakeasy / QRCode) + Brevo Email OTP
- **Scraping & Ingestion:** Custom LinkedIn extractor with Axios & Cheerio
- **Deployment:** Render (Frontend & API Services)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- PostgreSQL connection string (Neon or Local)

### 1. Clone the repository
```bash
git clone https://github.com/debpriya3011/PORTFOLIO.git
cd PORTFOLIO/app
```

### 2. Install dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Configure Environment Variables
Create a `.env` file in the `server/` directory:
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@host:port/database
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
BREVO_LOGIN=your-brevo-login
BREVO_SMTP_KEY=your-brevo-smtp-key
ADMIN_EMAIL=debpriya3011@gmail.com
```

Create a `.env` file in the `app/` directory:
```env
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 4. Run Development Servers
```bash
# Terminal 1: Run Backend API
cd server
npm run dev

# Terminal 2: Run Frontend (from app directory)
npm run dev
```
Open `http://localhost:5173` to explore the application.

---

## 📂 Project Structure

```
app/
├── screenshots/          # High-resolution application preview captures
│   ├── home.png
│   ├── blueprints.png
│   ├── posts.png
│   ├── admin login.png
│   └── admin-dashboard.png
├── server/               # Express.js REST API & Database Models
│   ├── database.js       # Neon PostgreSQL connection & schema
│   ├── index.js          # Route handlers, auth & scraping
│   └── package.json
├── src/                  # React Application
│   ├── components/       # Reusable UI & Section components
│   │   ├── Hero.tsx
│   │   ├── WorkflowVisualization.tsx
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   ├── Education.tsx
│   │   ├── Contact.tsx
│   │   ├── PostsWidget.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── pages/            # Page Views
│   │   ├── Home.tsx
│   │   ├── Guides.tsx    # Architecture Blueprints & Guides
│   │   ├── Posts.tsx     # LinkedIn Engineering Notes
│   │   └── Admin.tsx     # Authenticated Admin Dashboard
│   ├── contexts/         # Auth & Theme Context Providers
│   ├── data/             # Blueprint guides & architecture metadata
│   ├── index.css         # Theme tokens & contrast utilities
│   └── App.tsx
├── package.json
└── vite.config.ts
```

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/google` | Verify Google OAuth credential token |
| `POST` | `/api/auth/send-otp` | Dispatch email OTP via Brevo SMTP |
| `POST` | `/api/auth/verify-otp` | Validate email OTP session |
| `POST` | `/api/auth/totp/setup` | Generate TOTP secret & QR code |
| `POST` | `/api/auth/totp/verify` | Authenticate with Google Authenticator |
| `GET, POST, DELETE` | `/api/posts` | LinkedIn posts data store |
| `POST` | `/api/posts/refresh-all` | Re-fetch latest LinkedIn metrics |
| `GET, POST` | `/api/contact` | Submit and retrieve visitor messages |
| `GET, POST, DELETE` | `/api/experience` | Manage work experience history |
| `GET, POST, DELETE` | `/api/skills` | Manage categorized skill taxonomy |

---

## 👨‍💻 Author

**Debpriya Santra**
- 🌐 Portfolio: [portfolio-7xje.onrender.com](https://portfolio-7xje.onrender.com/)
- 💼 LinkedIn: [linkedin.com/in/debpriya-santra](https://www.linkedin.com/in/debpriya-santra-459519251/)
- 🐙 GitHub: [github.com/debpriya3011](https://github.com/debpriya3011)
- 🏆 HackerRank: [hackerrank.com/debpriya3011](https://www.hackerrank.com/profile/debpriya3011)