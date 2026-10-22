# 🏎️ VeerRacerss Electric — Official Website & Operations CMS
[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.10-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&style=flat-square)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&style=flat-square)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase&style=flat-square)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
The official web presence, recruitment portal, and operations command center for **VeerRacerss Electric** — the premier Formula Student Electric vehicle team from Veer Surendra Sai University of Technology (VSSUT), Burla, Odisha.
---
## 🌟 Key Highlights
- **🏁 F1-Grade Cinematic UI**: Dark aesthetic engineered with Three.js WebGL 3D interactive car viewer, Lenis smooth scrolling, motion design via Motion (`motion/react`), and telemetry benchmark docks.
- **⚡ Dynamic Administrative CMS (`/admin/dashboard`)**:
  - **Recruitment & Induction Triage**: Live candidate review, smart workflow buckets (Inbox, Accepted, Declined), domain filtering, and 1-click status transitions.
  - **Dynamic Question Builder**: Admins can configure custom form questions, choosing between single-select dropdowns (with editable options) and paragraph textboxes.
  - **Interactive Email Dispatch**: One-click onboarding welcome letter generation with student placeholders (`{{name}}`, `{{domain}}`, `{{whatsapp_link}}`) and automated Google SMTP email delivery.
  - **Annual Batch Progression Engine**: 1-click roster year incrementation that automatically promotes 4th-year seniors to the public Alumni paddock.
  - **Custom Club Databases**: Create custom tabular databases (e.g. Budget & Procurement, Inventory, Sponsorship logs) with 1-click Excel `.xlsx` exports.
  - **Vehicles & Spotlight Fleet Manager**: Manage multi-generational racecars, 3D `.glb` CAD assets, and dynamic specs that automatically populate the homepage spotlight.
  - **Partner & Sponsor Showcase**: Live sponsor tiering and clickable brand logos.
- **🛡️ Enterprise Security**:
  - Protected admin routes with Supabase session-based authentication.
  - Google SMTP OTP verification and failsafe direct password updates.
  - Server-side route shielding with HTTP 403 enforcement when recruitment is paused.
---
## 🛠️ Architecture & Tech Stack
| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Dynamic SSR) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict typing) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + CSS Modules |
| **3D Rendering** | [Three.js](https://threejs.org/) + React Three Fiber / Drei |
| **Animations** | [Motion](https://motion.dev/) + [Lenis Smooth Scroll](https://github.com/darkroomengineering/lenis) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Storage buckets, Auth) |
| **Email Service** | [Nodemailer](https://nodemailer.com/) with Google SMTP (App Password auth) + [Resend](https://resend.com/) fallback |
| **Icons & Assets** | [Lucide React](https://lucide.dev/) |
---
## 📁 Project Structure
```text
├── public/                     # Static media, team logos, 3D glb models, car renders
├── src/
│   ├── app/                    # Next.js App Router routes
│   │   ├── (public)/           # Public views
│   │   │   ├── about/          # Who We Are, technical philosophy & heritage
│   │   │   ├── achievements/   # Competition track record (Formula Bharat, etc.)
│   │   │   ├── alumni/         # Graduated engineers directory
│   │   │   ├── cars/           # Vehicle showroom & technical datasheets
│   │   │   ├── gallery/        # High-res trackside moments & paddock reel
│   │   │   ├── members/        # Current leadership council & domain engineers
│   │   │   └── recruitment/    # Student induction application form
│   │   ├── admin/
│   │   │   ├── login/          # Secure admin login portal
│   │   │   └── dashboard/      # Unified operations command center
│   │   │       └── components/ # Specialized dashboard modules (Recruitment, Vehicles, etc.)
│   │   └── api/
│   │       └── recruitment/    # Secure API endpoints (submit, send-email)
│   ├── components/             # Reusable UI widgets, Hero, 3D Canvas, Navbar, Footer
│   ├── data/                   # Default offline fallbacks & TypeScript schemas
│   └── lib/                    # Supabase client singletons & utilities
└── tests/                      # Automated test suites for sync, auth, and email routes

# Run and deploy your AI Studio app
  
🚀 Getting Started
1. Prerequisites
Node.js: v20.x or higher
Package Manager: npm (v10+)
Supabase Account: Project configured with database tables & storage bucket

This contains everything you need to run your app locally.
2. Clone & Install
bash
git clone https://github.com/Sush2007/Veerracerss_Official_Web.git
cd Veerracerss_Official_Web
npm install

View your app in AI Studio: https://ai.studio/apps/fb410ac5-2576-49df-84dc-dac914b3554b
3. Environment Configuration
Create a .env.local file in the root directory:
env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# Google SMTP Credentials (For Automated Confirmation & Onboarding Emails)
GMAIL_USER=your_club_official_email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_google_app_password

## Run Locally
4. Running the Development Server
bash
npm run dev
Open http://localhost:3000
 to view the website, or navigate to http://localhost:3000/admin/dashboard
 for the operations command center.

**Prerequisites:**  Node.js
🧪 Testing & Production Build
Verify TypeScript integrity and generate an optimized production bundle:
bash
# Typecheck
npx tsc --noEmit
# Production Build
npm run build
# Run Production Server
npm run start
# Run Automated Test Harness
npm test

🔒 Security Best Practices
Zero Client Credential Leakage: Service role keys and email app passwords are strictly executed in Next.js Server Components / Route Handlers and never bundled to the client.
Row-Level Security (RLS): Public tables allow read-only queries, while administrative mutations require valid Supabase session tokens.
Form Status Gating: Submitting to /api/recruitment/submit returns HTTP 403 Forbidden whenever recruitment is marked paused in the admin panel.

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
👥 Contributors & Maintainers
Lead Developer: Sushmit Kumar Satapathy (@Sush2007)
Team: VeerRacerss Electric
Inquiries: veerracersselectric.database@gmail.com
