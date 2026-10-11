# Smart Interview Ecosystem - Technical Specification

## 1. Project Overview
AI-powered placement & interview preparation platform connecting Students, TPOs, and Admins through a centralized ERP system. Built as a monorepo with Next.js frontend and FastAPI backend.

## 2. Technology Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Python FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2
- **Database**: PostgreSQL (primary), Redis (caching/sessions)
- **AI**: OpenAI API (GPT-4o for interviews, embeddings for matching), Whisper (STT), TTS
- **Storage**: MinIO/S3-compatible for resumes & recordings
- **Auth**: JWT + Refresh tokens, bcrypt, OTP via email/SMS
- **Real-time**: WebSockets for AI interview streaming
- **Deployment**: Docker Compose (dev), Kubernetes (prod)

## 3. Monorepo Structure
```
smart-interview-ecosystem/
├── apps/
│   ├── web/                    # Next.js frontend (Student, TPO, Admin portals)
│   └── api/                    # FastAPI backend
├── packages/
│   ├── shared/                 # Shared types, schemas, utilities
│   ├── ui/                     # Shared React components
│   └── database/               # SQLAlchemy models, migrations
├── docker-compose.yml
├── turbo.json                  # Turborepo config
├── package.json
└── README.md
```

## 4. Database Schema (PostgreSQL)

### Core Tables
- `users` - Base user table (id, email, password_hash, role, is_verified, created_at)
- `students` - Student profile (user_id, student_id, name, phone, department, year, cgpa, graduation_year, college_id)
- `admins` - Admin profile (user_id, name, permissions)
- `tpos` - TPO profile (user_id, name, department, college_id)
- `colleges` - College info (id, name, code, address, logo_url)
- `skills` - Master skills list (id, name, category: programming/cloud/db/framework/other)
- `student_skills` - Many-to-many (student_id, skill_id, proficiency_level)
- `companies` - Company info (id, name, logo_url, website, description)
- `placement_drives` - Drive details (id, company_id, tpo_id, role, description, location, ctc, employment_type, eligibility_criteria, min_cgpa, eligible_departments, required_skills, qualifications, deadline, test_schedule, interview_schedule, company_link, status, resume_screening_threshold)
- `drive_skills` - Many-to-many (drive_id, skill_id, is_required, weight)
- `applications` - Student applications (id, student_id, drive_id, status, applied_at, resume_version)
- `resumes` - Resume files (id, student_id, drive_id, file_url, parsed_data, version, uploaded_at)
- `resume_scores` - AI matching results (id, resume_id, drive_id, overall_score, skill_match_score, keyword_match_score, missing_skills, missing_keywords, recommendations, screened_at)
- `tests` - Test definitions (id, drive_id, type: aptitude/technical, title, duration_minutes, passing_score, configured_by)
- `questions` - Question bank (id, test_id, question_text, options, correct_answer, explanation, difficulty, topic, question_type: mcq/coding/subjective)
- `test_attempts` - Student test attempts (id, student_id, test_id, started_at, completed_at, score, status)
- `test_answers` - Answers per attempt (id, attempt_id, question_id, selected_answer, is_correct, time_spent)
- `interviews` - AI mock interviews (id, student_id, drive_id, status, started_at, completed_at, overall_score, transcript_url, recording_url)
- `interview_questions` - Questions asked in interview (id, interview_id, question_text, category, order, ai_generated)
- `interview_answers` - Student answers (id, interview_id, question_id, answer_text, audio_url, evaluation)
- `interview_feedback` - AI evaluation (id, interview_id, communication_score, technical_score, problem_solving_score, relevance_score, strengths, weaknesses, recommendations)
- `roadmaps` - Personalized preparation (id, student_id, drive_id, week_number, focus_areas, tasks, resources, generated_at)
- `notifications` - In-app/email notifications (id, user_id, type, title, message, read, sent_at, related_entity_type, related_entity_id)

## 5. API Endpoints (FastAPI)

### Auth
- POST `/auth/register` - Register (student/tpo/admin)
- POST `/auth/verify-otp` - Verify email/phone OTP
- POST `/auth/login` - Login → access + refresh tokens
- POST `/auth/refresh` - Refresh access token
- POST `/auth/forgot-password` - Request reset
- POST `/auth/reset-password` - Reset with token
- GET `/auth/me` - Current user profile

### Students
- GET `/students/profile` - Get profile
- PUT `/students/profile` - Update profile
- POST `/students/skills` - Add skill
- DELETE `/students/skills/{skill_id}` - Remove skill
- POST `/students/resume` - Upload resume (multipart)
- GET `/students/resume` - Get resume versions
- GET `/students/drives` - List eligible drives
- POST `/students/drives/{drive_id}/apply` - Apply to drive
- GET `/students/applications` - My applications with status
- GET `/students/applications/{app_id}` - Application detail
- POST `/students/applications/{app_id}/resume/rescreen` - Request re-screen
- GET `/students/tests/{test_id}` - Get test questions
- POST `/students/tests/{test_id}/start` - Start attempt
- POST `/students/tests/{test_id}/submit` - Submit answers
- GET `/students/tests/{test_id}/result` - Get result
- POST `/students/interviews/start` - Start AI interview (WebSocket)
- WS `/students/interviews/{interview_id}/stream` - Interview WebSocket
- GET `/students/interviews/{interview_id}/feedback` - Get feedback
- GET `/students/roadmap` - Get preparation roadmap

### TPO
- GET `/tpo/dashboard` - Dashboard stats
- POST `/tpo/drives` - Create drive
- GET `/tpo/drives` - List drives
- GET `/tpo/drives/{drive_id}` - Drive detail
- PUT `/tpo/drives/{drive_id}` - Update drive
- DELETE `/tpo/drives/{drive_id}` - Delete drive
- GET `/tpo/drives/{drive_id}/applications` - Applications with filters
- PUT `/tpo/applications/{app_id}/status` - Update application status
- POST `/tpo/drives/{drive_id}/tests` - Create test
- GET `/tpo/drives/{drive_id}/tests` - List tests
- POST `/tpo/tests/{test_id}/questions` - Add questions (bulk)
- GET `/tpo/reports/drive/{drive_id}` - Drive report
- GET `/tpo/reports/student/{student_id}` - Student report
- POST `/tpo/notifications` - Send notification

### Admin
- GET `/admin/dashboard` - System analytics
- GET `/admin/users` - List users with filters
- POST `/admin/users` - Create user
- PUT `/admin/users/{user_id}` - Update user
- DELETE `/admin/users/{user_id}` - Delete user
- GET `/admin/colleges` - Manage colleges
- POST `/admin/colleges` - Create college
- GET `/admin/skills` - Manage skills
- POST `/admin/skills` - Create skill
- GET `/admin/ai-config` - Get AI settings
- PUT `/admin/ai-config` - Update AI settings
- GET `/admin/reports/system` - System reports

## 6. AI Services

### Resume Parser
- Extract: education, cgpa, skills, projects, certifications, internships, experience, keywords
- Use: PDF/DOCX parsing + LLM structured extraction

### Resume-JD Matching
- Embeddings-based semantic similarity + keyword overlap
- Configurable threshold (default 50%, set by TPO/Admin per drive)
- Output: overall_score, skill_match, keyword_match, missing_skills, missing_keywords, recommendations

### AI Mock Interview
- **Architecture**: Voice → STT (Whisper) → LLM Interview Engine → Question Gen/Eval → TTS → Avatar
- **Context-aware**: Uses resume, job role, required skills, previous answers
- **Categories**: HR, Technical, Behavioral, Project, Role-specific
- **Evaluation**: Communication clarity, technical understanding, answer relevance, completeness, logical reasoning, problem-solving

### Feedback & Roadmap
- Strengths, weaknesses, recommendations per category
- 4-week roadmap: Week 1 (OOP, SQL, aptitude), Week 2 (DBMS, DS, MCQs), Week 3 (resume, projects, HR), Week 4 (mock interviews, simulation)

## 7. Frontend Pages (Next.js App Router)

### Public
- `/` - Landing page
- `/login` - Login
- `/register` - Register (role selection)
- `/verify-otp` - OTP verification
- `/forgot-password` / `/reset-password`

### Student Portal (`/student/*`)
- `/dashboard` - Overview, upcoming tests, interviews, applications
- `/profile` - Profile management, skills, resume upload
- `/drives` - Browse drives with filters
- `/drives/[id]` - Drive detail, apply
- `/applications` - My applications timeline
- `/tests/[id]` - Take test
- `/tests/[id]/result` - Test result
- `/interview/[id]` - AI interview interface (voice + avatar)
- `/interview/[id]/feedback` - Feedback & roadmap
- `/roadmap` - Preparation roadmap
- `/notifications` - Notification center

### TPO Portal (`/tpo/*`)
- `/dashboard` - Stats, charts, recent activity
- `/drives` - Manage drives (CRUD)
- `/drives/[id]` - Drive detail, applications
- `/drives/[id]/applications` - Application management
- `/drives/[id]/tests` - Test builder
- `/reports` - Drive/student reports
- `/notifications` - Send notifications

### Admin Portal (`/admin/*`)
- `/dashboard` - System analytics
- `/users` - User management
- `/colleges` - College management
- `/skills` - Skills taxonomy
- `/ai-config` - AI thresholds, prompts, models
- `/reports` - System reports

## 8. Real-time AI Interview Flow
1. Student clicks "Start Interview" → creates interview record, returns interview_id
2. WebSocket connection to `/students/interviews/{id}/stream`
3. Server sends: `{type: 'avatar_intro', text: '...', audio_url: '...'}`
4. Student speaks → audio chunks sent via WS
5. Server: STT → LLM generates follow-up/evaluation → TTS → sends `{type: 'question', text: '...', audio_url: '...', category: 'technical'}`
6. Loop until max questions or time limit
7. Server sends final evaluation, closes WS
8. Student views feedback at `/interview/{id}/feedback`

## 9. Key Configuration (Env)
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
MINIO_ENDPOINT=...
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
MINIO_BUCKET=resumes
JWT_SECRET=...
JWT_REFRESH_SECRET=...
OPENAI_API_KEY=...
EMAIL_SMTP_HOST=...
EMAIL_SMTP_PORT=...
EMAIL_SMTP_USER=...
EMAIL_SMTP_PASS=...
SMS_PROVIDER=twilio
TWILIO_SID=...
TWILIO_TOKEN=...
DEFAULT_RESUME_THRESHOLD=50
MAX_RESUME_RESCREEN_ATTEMPTS=2
```

## 10. Development Phases (per PRD)
- **Phase 1**: Auth, RBAC, base dashboards
- **Phase 2**: Student profile, resume upload, drives, applications
- **Phase 3**: Resume parsing, AI matching, improvement feedback
- **Phase 4**: Aptitude & technical test engine
- **Phase 5**: AI mock interview (text → voice → avatar), feedback
- **Phase 6**: Roadmap, notifications, analytics, reports

## 11. Non-Functional Requirements
- **Security**: bcrypt, JWT with short expiry, RBAC middleware, secure file uploads (type/size validation), rate limiting
- **Performance**: Redis caching, DB indexing, pagination, lazy loading
- **Scalability**: Stateless services, horizontal scaling ready
- **Privacy**: Row-level security, encrypted PII, audit logs