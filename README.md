#  Nexus - AI-Powered Freelance Ecosystem

Nexus is a production-ready, AI-driven freelance marketplace designed to intelligently connect elite developers with top-tier client projects. It features robust role-based access, real-time messaging, secure authentication, and a suite of advanced Artificial Intelligence tools to automate and optimize the freelancing workflow.

---

##  Project Overview
Nexus solves the traditional problems of freelance platforms (spam bids, poorly written proposals, and unmatched skills) by integrating Deep AI at every step. From auditing proposals to generating strategic cover letters and providing real-time data insights, the platform ensures high-quality interactions between Clients and Freelancers. 

This project was built focusing on **Performance**, **Scalability**, **UX/UI Best Practices**, and **Advanced System Architecture**.

---

##  Tech Stack:

### Frontend Architecture
* **Framework:** Next.js 14+ (App Router) with TypeScript
* **Styling:** Tailwind CSS v4, Framer Motion (Animations), Glassmorphism UI
* **State Management:** Zustand (Global), TanStack Query (Server State)
* **Forms & Validation:** React Hook Form + Zod
* **Real-time:** Socket.io-client

### Backend Architecture:
* **Runtime & Framework:** Node.js, Express, TypeScript
* **Database & ORM:** PostgreSQL + Prisma ORM
* **Authentication:** Better-Auth (Role-based: Client, Freelancer, Admin)
* **AI Integration:** Groq / Google Generative AI
* **Advanced Engineering:** 
  * Caching (Redis via ioredis)
  * Rate Limiting (express-rate-limit)
  * Logging (Winston)
  * WebSockets (Socket.io)
  * Cloud Storage (Cloudinary)

---

##  Core AI Features:

Nexus integrates 6 highly practical, real-API AI features:

1. **AI Bid Auditor (Data Analyzer):** 
   * *How it works:* Clients can audit all submitted bids for a project with one click. The AI ranks freelancers based on their skills, cover letter, and project requirements, providing a "Top Pick" and strategic hiring advice.
2. **AI Strategic Proposal Generator (Content Gen):** 
   * *How it works:* Freelancers can generate highly persuasive, tailored cover letters by feeding the AI the project description and their own profile skills/bio.
3. **AI Profile Optimizer (Recommendation):**
   * *How it works:* Analyzes a freelancer's current bio, skills, and stats, returning an overall score, grade, and specific actionable improvements to help them win more contracts.
4. **AI Smart Insights (Data Analyzer):**
   * *How it works:* Scans user activity and profile completeness to provide personalized dashboard notifications and insights.
5. **AI Project Architect (Content Gen):**
   * *How it works:* Helps clients write professional, highly-detailed project descriptions from just a short title and category.
6. **AI Chat Assistant (Context-Aware Chatbot):**
   * *How it works:* A globally accessible floating AI assistant that understands the current user's role and history to answer platform-related queries instantly.

---

##  Advanced Engineering Implementations:

* **Optimistic UI:** Used during proposal submissions and state changes to provide instant UI feedback before server confirmation.
* **Real-Time Data Streams:** Integrated Socket.io for instant messaging and live notification updates.
* **Debounced Searches & Filtering:** High-performance project exploration using Tanstack Query and debounced inputs.
* **Server-Side Security:** JWT/Session handling via Better-Auth, complemented by strict API Rate Limiting to prevent abuse.
* **Caching Layer:** Redis implemented to reduce database load on high-traffic routes.
* **Professional Logging:** Winston implemented for tracking daily rotating logs, errors, and system events.

---

##  Setup Instructions:

### Prerequisites
- Node.js 
- PostgreSQL Database
- Redis Server 
- API Keys: Groq/Gemini, Cloudinary

### 1. Clone the repository
```bash
git clone https://github.com/HST159075/STNC-Ai.git
cd STNC-Ai
```

### 2. Setup the Backend (Server)
```bash
cd server
npm install

# Configure Environment Variables
cp .env.example .env
# Fill in your DATABASE_URL, AI_API_KEY, REDIS_URL, CLOUDINARY URLs, etc.

# Push database schema
npx prisma db push
npx prisma generate

# Start the server
npm run dev
```

### 3. Setup the Frontend (Client)
```bash
cd ../client
npm install

# Configure Environment Variables
cp .env.local.example .env.local
# Fill in your NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SOCKET_URL, etc.

# Start the frontend application
npm run dev
```

### 4. Default Demo Credentials
* **Client Account:** `demo@client.com` | `password123`
* **Freelancer Account:** `demo@freelancer.com` | `password123`
* **Admin Account:** `admin@nexus.com` | `admin123`

<h2>Contect me:</h2>
<br>
<h3>
Email: hsttasin90@gmail.com
 <br>
Linkdin: https://www.linkedin.com/in/md-tasinul-alam-28158735a/?skipRedirect=true
</h3>
