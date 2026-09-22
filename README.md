
# My Portfolio Website

🌐 Live Demo: https://portfolio-7xje.onrender.com/


## 📸 Application Preview

| Home Page | Admin Login |
|-----------|----------|
| <img src="screenshots/home.png" width="450"/> | <img src="screenshots/admin login.png" width="450"/> |

| Admin Dashboard | Posts Management |
|-----------------|----------------|
| <img src="screenshots/admin-dashboard.png" width="450"/> | <img src="screenshots/posts.png" width="450"/> |

This is a full-stack web application that serves as my personal portfolio. It showcases my skills, experience, education, and projects. The application is built with a modern tech stack, featuring a React frontend and a Node.js/Express backend.

## Tech Stack

### Frontend

- **Framework:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, shadcn/ui
- **Routing:** React Router
- **State Management:** React Context
- **Language:** TypeScript

### Backend

- **Framework:** Express.js
- **Database:** PostgreSQL (Neon Serverless)
- **Authentication:** OTP-based admin login
- **File Uploads:** Multer
- **Email Service:** Brevo (via Nodemailer SMTP)
- **Language:** JavaScript (ES Modules)

## Deployment

The application is deployed using modern cloud services.

- **Frontend Hosting:** Render
- **Backend Hosting:** Render
- **Database:** Neon (Serverless PostgreSQL)
- **Email Service:** Brevo (SMTP)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- PostgreSQL

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd debpriya_portfolio/app
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Install backend dependencies:**
    ```bash
    cd server
    npm install
    cd ..
    ```

4.  **Set up environment variables:**

    Create a `.env` file in the `server` directory and add the following variables:

    ```
    PORT=3001
    FRONTEND_URL=http://localhost:5173
    DATABASE_URL=postgresql://user:password@host:port/database
    GMAIL_USER=your-email@gmail.com
    GMAIL_APP_PASSWORD=your-gmail-app-password
    BREVO_LOGIN=your-brevo-login
    BREVO_SMTP_KEY=your-brevo-smtp-key
    ```

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd server
    npm run dev
    ```

2.  **Start the frontend development server:**
    ```bash
    # In a new terminal, from the root `app` directory
    npm run dev
    ```

The application should now be running at `http://localhost:5173`.

## Folder Structure

```
app/
├── server/               # Backend (Express.js)
│   ├── database.js
│   ├── index.js
│   ├── package.json
│   └── uploads/
├── src/                  # Frontend (React)
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── api.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## API Endpoints

The backend exposes the following REST API endpoints:

- `POST /api/auth/send-otp`: Sends an OTP for admin login.
- `POST /api/auth/verify-otp`: Verifies the OTP.
- `GET /api/scrape-linkedin`: Scrapes a LinkedIn post.
- `GET, POST, DELETE /api/posts`: Manage blog posts.
- `GET, POST, DELETE /api/images`: Manage images.
- `GET, POST, DELETE /api/skills`: Manage skills.
- `GET, POST, DELETE /api/experience`: Manage work experience.
- `GET, POST /api/education`: Manage education history.
- `GET, POST /api/certifications`: Manage certifications.
- `GET, POST, DELETE /api/workflows`: Manage workflow visualizations.

For more details, refer to the `server/index.js` file.




## Author

Debpriya Santra