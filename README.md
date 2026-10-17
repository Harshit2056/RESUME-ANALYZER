# 🎯 GenAI Resume & Mock Interview Strategy Platform

> An AI-powered full-stack SaaS platform that analyzes candidate resumes against target job descriptions, computes real-time ATS match scores, detects skill gaps, and generates personalized interview preparation strategies using Google Gemini AI.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-blue?style=for-the-badge&logo=vercel)](https://resume-analyzer-nine-gilt.vercel.app/)
[![Backend Status](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://resume-analyzer-weew.onrender.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)](#)

🔗 **Live Application:** [resume-analyzer-nine-gilt.vercel.app](https://resume-analyzer-nine-gilt.vercel.app/)

---

## ✨ Features

- **📊 ATS Compatibility Scoring**: Evaluates candidate resumes against target job descriptions to compute a semantic keyword match percentage (0–100%).
- **💡 Targeted Technical Questions**: Generates 5 tailored technical questions along with the interviewer's hidden intention and model answers.
- **🗣️ STAR Behavioral Scenarios**: Produces role-specific behavioral questions with structured STAR (Situation, Task, Action, Result) response guides.
- **🔍 Skill Gap Analysis**: Categorizes missing skills by severity levels (`Low`, `Medium`, `High`).
- **📅 7-Day Action Roadmap**: Builds a personalized, day-by-day study plan to bridge identified knowledge gaps.
- **📄 PDF Parsing & Export**: Extracts text from uploaded PDF resumes on the server (`pdf-parse`) and generates print-ready, ATS-friendly resumes (`Puppeteer`).
- **🔐 Secure Authentication**: Dual-token JWT (Access & Refresh tokens) in HTTP-Only cookies, custom token blacklisting for instant logout invalidation, and password reset flows via Gmail SMTP (`Nodemailer`).
- **🎨 Modern SaaS UI**: Crafted with React 19, Tailwind CSS v4, and GSAP micro-animations (interactive SVG radial score gauges and collapsible accordions).

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS v4, GSAP Animations, Lucide Icons, Vite |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), REST APIs |
| **AI Engine** | Google Gemini AI SDK (`gemini-2.5-flash-lite`), Zod Schema Validation |
| **Utilities** | Puppeteer (PDF Generation), `pdf-parse` (Stream Extraction), Nodemailer |
| **Deployment** | **Vercel** (Frontend SPA) + **Render** (Backend API & MongoDB Atlas) |

---

## ⚙️ Environment Variables

### Backend (`BACKEND/.env`)
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET_CODE=your_access_secret
ACCESS_TOKEN_EXPIRY="30m"
REFRESH_TOKEN_SECRET_CODE=your_refresh_secret
REFRESH_TOKEN_EXPIRY="7d"
GOOGLE_GENAI_API_KEY=your_gemini_api_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=https://resume-analyzer-nine-gilt.vercel.app
```

### Frontend (`FRONTEND/.env` or Vercel Environment)
```env
VITE_API_BASE_URL=https://resume-analyzer-weew.onrender.com/api
```

---

## 🚀 Local Setup

```bash
# 1. Clone repository
git clone https://github.com/Harshit2056/RESUME-ANALYZER.git
cd RESUME-ANALYZER

# 2. Run Backend
cd BACKEND
npm install
npm run dev

# 3. Run Frontend
cd ../FRONTEND
npm install
npm run dev
```

---

## 👨‍💻 Author

- **Harshit Jain** – [GitHub](https://github.com/Harshit2056)
