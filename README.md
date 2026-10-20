# NAVIORAA — Education & IT Technology Projects Platform

NAVIORAA is an IT training institute and tech project development agency. This project combines a high-clarity, student-centric public website inspired by the educational discovery workflows of Disha Group with a private, role-based administrative Content Management System (CMS).

---

## 1. Architecture Overview

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7.
- **Backend**: Express.js server (`server.ts`) with Vite middleware mounted in development.
- **Database & Identity**: Cloud Firestore & Firebase Authentication (ABAC with `/admins/{uid}` evaluation and runtime owner fallback).
- **Email Notification Engine**: Server-side proxy routing for contact form verification and notification dispatch to `naviora.pvt@gmail.com`.

---

## 2. Public Application Features

- **Sticky Navigation**: Institute branding, courses dropdown, about, services, projects, mentors, resources, and instant "Enquire Now" CTA.
- **Dynamic Hero Carousel**: Editable slides, customizable headlines, subtitles, background images, and dual CTA buttons.
- **Audience & Domain Filtering**: Filter tracks for students vs working professionals across Programming, Full Stack Development, AI & Machine Learning, Data Analytics, and Web Development.
- **Course Catalog & Modals**: Comprehensive syllabus module view, learning outcomes, technology stacks, skill levels, and pre-filled enquiry triggers.
- **Why Choose Navioraa**: Configurable value propositions (01 to 06) featuring red/blue milestone badges.
- **Enterprise Engineering Services**: Dual-mission software agency section showcasing cloud development, custom enterprise software, mobile apps, and AI automation.
- **Live Projects Portfolio**: Student incubator and client deliverables (HealthSync Telemedicine, FinTrack AI, EduVibe LMS) with tech badges and case studies.
- **Leadership & Faculty**: Profiles for the core founding and managing team (Shubham, Sakshi, Chaitanya, Sandip, Disha).
- **Learning Resources**: Free downloadable cheat sheets, developer handbooks, starter boilerplates, and technical articles.
- **Admissions Enquiry Form**: Client- and server-side validated form with spam honeypot and direct WhatsApp integration.

---

## 3. Private Admin CMS Features (`/admin`)

- **Secure Login (`/admin/login`)**: Google Workspace OAuth popup, credential-based sign in, password reset, and first-owner bootstrap initialization.
- **Executive Dashboard (`/admin/dashboard`)**: Real-time KPI counters (unread enquiries, published courses, active projects, team members) and one-click database seeder.
- **Admissions CRM Inbox (`/admin/enquiries`)**: Full pipeline management (`new`, `in_progress`, `contacted`, `resolved`, `spam`), counselor assignment, private internal notes (never leaked to public site), date filters, and CSV export.
- **Course & Syllabus Manager (`/admin/courses`)**: Full CRUD for programs, categories, syllabus modules, thumbnail URLs, published/draft status, and featured toggles.
- **Hero & Section Manager (`/admin/homepage`)**: Reorder, add, edit, and toggle hero slides with instant public reflection without redeployment.
- **Faculty & Leadership Manager (`/admin/team`)**: Full management of the leadership team, bios, social links, and ordering.
- **Enterprise Services Manager (`/admin/services`)**: Manage client software and cloud capabilities.
- **Projects Manager (`/admin/projects`)**: Add and edit live case studies and incubator projects.
- **Resources Manager (`/admin/resources`)**: Upload and configure study notes and downloads.
- **Blog Editorial (`/admin/blog`)**: Author tutorials and student guidance articles.
- **Settings & Mail (`/admin/settings`)**: Company address, contact routing, statistics visibility toggle, and email notification ping tester.
- **Access Control & Roles (`/admin/users`)**: ABAC permission delegation (Super Admin / Owner, Admin, Editor) with privilege escalation protections.

---

## 4. First-Owner Bootstrap Procedure

1. Navigate to `/admin/login`.
2. Sign in with Google using your authorized email (`naviora.pvt@gmail.com` or custom).
3. If this is the initial setup, click **"Initialize First Owner (Super Admin)"**.
4. The system securely provisions your record in the `/admins` and `/users` collections.
5. You are redirected to `/admin/dashboard` with complete Super Admin permissions to manage the entire platform and authorize team members.

---

## 5. Local Development & Deployment

```bash
# Install dependencies
npm install

# Start full-stack development server on port 3000
npm run dev

# Run TypeScript compilation and syntax check
npm run lint

# Production build
npm run build

# Start production server
npm start
```
