# Smart Interview Ecosystem - Updated Architecture (Supabase + HeyGen)

## Revised Technology Stack

### Frontend
- **Next.js 14** (App Router, TypeScript, Tailwind CSS, shadcn/ui)
- **Supabase Client** (@supabase/supabase-js) for auth, database, realtime, storage
- **HeyGen Streaming Avatar SDK** for AI interviewer

### Backend (Minimal - Python FastAPI for AI Services Only)
- **FastAPI** for AI/ML services that need Python ecosystem
- Services: Resume Parsing, Resume-JD Matching, Interview Question Generation, Feedback Generation, Roadmap Generation
- Deployed as separate service or Supabase Edge Functions (Deno)

### Database & Infrastructure
- **Supabase** (PostgreSQL + Auth + Realtime + Storage + Edge Functions)
- **Row Level Security (RLS)** for all tables
- **Supabase Realtime** for interview WebSocket streaming
- **Supabase Storage** for resumes, recordings, avatars

### AI Services
- **Google Gemini** (gemini-1.5-pro) for text generation (matching, questions, feedback, roadmaps)
- **Google Gemini Embeddings** (text-embedding-004) for semantic matching
- **HeyGen Streaming Avatar** for AI interviewer (video + voice)
- **Whisper** (via OpenAI API or self-hosted) for speech-to-text

---

## Monorepo Structure

```
smart-interview-ecosystem/
├── apps/
│   ├── web/                    # Next.js 14 frontend
│   │   ├── src/
│   │   │   ├── app/            # App Router pages
│   │   │   │   ├── (auth)/     # Login, register, verify
│   │   │   │   ├── (student)/  # Student portal
│   │   │   │   ├── (tpo)/      # TPO portal
│   │   │   │   ├── (admin)/    # Admin portal
│   │   │   │   └── api/        # Next.js API routes (thin)
│   │   │   ├── components/     # React components
│   │   │   │   ├── ui/         # shadcn/ui components
│   │   │   │   ├── student/    # Student-specific components
│   │   │   │   ├── tpo/        # TPO-specific components
│   │   │   │   ├── admin/      # Admin-specific components
│   │   │   │   └── interview/  # HeyGen interview components
│   │   │   ├── lib/            # Utilities, Supabase client
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── types/          # TypeScript types (synced from shared)
│   │   │   └── styles/         # Global styles
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   └── ai-services/            # FastAPI AI microservice
│       ├── src/
│       │   ├── main.py
│       │   ├── config.py
│       │   ├── models/         # Pydantic models
│       │   ├── services/
│       │   │   ├── resume_parser.py
│       │   │   ├── resume_matcher.py
│       │   │   ├── interview_engine.py
│       │   │   ├── feedback_generator.py
│       │   │   └── roadmap_generator.py
│       │   ├── api/
│       │   │   └── routes.py
│       │   └── utils/
│       ├── requirements.txt
│       └── Dockerfile
│
├── packages/
│   ├── shared/                 # Shared TypeScript types & Zod schemas
│   └── supabase/               # Supabase migrations, types, RLS policies
│       ├── migrations/
│       ├── seed.sql
│       └── types.ts            # Generated from Supabase CLI
│
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   └── seed.sql
│
├── docker-compose.yml          # Local development (AI services only)
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## Supabase Schema (PostgreSQL with RLS)

### Enums
```sql
CREATE TYPE user_role AS ENUM ('student', 'tpo', 'admin');
CREATE TYPE application_status AS ENUM (
  'open', 'applied', 'resume_screening', 'shortlisted', 
  'test', 'ai_interview', 'company_process', 'selected', 'rejected', 'needs_improvement'
);
CREATE TYPE test_type AS ENUM ('aptitude', 'technical');
CREATE TYPE question_type AS ENUM ('mcq', 'coding', 'subjective');
CREATE TYPE interview_status AS ENUM ('pending', 'in_progress', 'completed', 'evaluated');
CREATE TYPE interview_category AS ENUM ('hr', 'technical', 'behavioral', 'project', 'role_specific');
CREATE TYPE drive_status AS ENUM ('draft', 'published', 'closed', 'completed');
CREATE TYPE employment_type AS ENUM ('full_time', 'internship', 'contract', 'part_time');
CREATE TYPE skill_category AS ENUM ('programming', 'cloud', 'database', 'framework', 'other');
CREATE TYPE notification_type AS ENUM (
  'test_schedule', 'interview_schedule', 'application_status', 
  'shortlisting', 'announcement', 'resume_feedback', 'test_result', 'interview_feedback'
);
```

### Core Tables

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Colleges
CREATE TABLE colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL,
  phone TEXT,
  department TEXT,
  academic_year TEXT,
  cgpa NUMERIC(3,2) CHECK (cgpa >= 0 AND cgpa <= 10),
  graduation_year INT CHECK (graduation_year BETWEEN 2020 AND 2035),
  college_id UUID REFERENCES colleges(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TPOs
CREATE TABLE tpos (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT,
  college_id UUID REFERENCES colleges(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins
CREATE TABLE admins (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills taxonomy
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category skill_category NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student skills
CREATE TABLE student_skills (
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'beginner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, skill_id)
);

-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Placement Drives
CREATE TABLE placement_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  tpo_id UUID REFERENCES tpos(id),
  role TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  ctc TEXT NOT NULL,
  employment_type employment_type NOT NULL,
  eligibility_criteria TEXT NOT NULL,
  min_cgpa NUMERIC(3,2) CHECK (min_cgpa >= 0 AND min_cgpa <= 10),
  eligible_departments TEXT[] NOT NULL,
  required_skills TEXT[] NOT NULL,
  qualifications TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  test_schedule TIMESTAMPTZ,
  interview_schedule TIMESTAMPTZ,
  company_link TEXT,
  status drive_status DEFAULT 'draft',
  resume_screening_threshold INT DEFAULT 50 CHECK (resume_screening_threshold BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drive skills (detailed)
CREATE TABLE drive_skills (
  drive_id UUID REFERENCES placement_drives(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT TRUE,
  weight INT DEFAULT 1,
  PRIMARY KEY (drive_id, skill_id)
);

-- Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES placement_drives(id) ON DELETE CASCADE,
  status application_status DEFAULT 'open',
  resume_version INT DEFAULT 1,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, drive_id)
);

-- Resumes
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES placement_drives(id) ON DELETE SET NULL,
  file_path TEXT NOT NULL,  -- Supabase Storage path
  file_name TEXT NOT NULL,
  file_size INT NOT NULL,
  mime_type TEXT NOT NULL,
  parsed_data JSONB,
  version INT DEFAULT 1,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resume Scores (AI Matching)
CREATE TABLE resume_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES placement_drives(id) ON DELETE CASCADE,
  overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
  skill_match_score INT CHECK (skill_match_score BETWEEN 0 AND 100),
  keyword_match_score INT CHECK (keyword_match_score BETWEEN 0 AND 100),
  missing_skills TEXT[],
  missing_keywords TEXT[],
  recommendations TEXT[],
  screened_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (resume_id, drive_id)
);

-- Tests
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_id UUID REFERENCES placement_drives(id) ON DELETE CASCADE,
  type test_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL,
  passing_score INT CHECK (passing_score BETWEEN 0 AND 100),
  configured_by UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options TEXT[],
  correct_answer TEXT,
  explanation TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic TEXT NOT NULL,
  question_type question_type NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test Attempts
CREATE TABLE test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  score NUMERIC(5,2),
  status TEXT CHECK (status IN ('in_progress', 'submitted', 'evaluated', 'expired')) DEFAULT 'in_progress',
  time_spent_seconds INT DEFAULT 0
);

-- Test Answers
CREATE TABLE test_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer TEXT,
  is_correct BOOLEAN,
  time_spent_seconds INT DEFAULT 0
);

-- AI Mock Interviews
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES placement_drives(id) ON DELETE CASCADE,
  heygen_session_id TEXT,  -- HeyGen session ID
  status interview_status DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
  transcript_url TEXT,      -- Supabase Storage path
  recording_url TEXT,       -- Supabase Storage path
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Questions
CREATE TABLE interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  category interview_category NOT NULL,
  order_index INT NOT NULL,
  ai_generated BOOLEAN DEFAULT TRUE,
  asked_at TIMESTAMPTZ
);

-- Interview Answers
CREATE TABLE interview_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  audio_url TEXT,           -- Supabase Storage path
  evaluation JSONB,
  answered_at TIMESTAMPTZ
);

-- Interview Feedback
CREATE TABLE interview_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  communication_score INT CHECK (communication_score BETWEEN 0 AND 100),
  technical_score INT CHECK (technical_score BETWEEN 0 AND 100),
  problem_solving_score INT CHECK (problem_solving_score BETWEEN 0 AND 100),
  relevance_score INT CHECK (relevance_score BETWEEN 0 AND 100),
  overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
  strengths TEXT[],
  weaknesses TEXT[],
  recommendations TEXT[],
  detailed_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Preparation Roadmaps
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES placement_drives(id) ON DELETE SET NULL,
  week_number INT CHECK (week_number BETWEEN 1 AND 4),
  focus_areas TEXT[],
  tasks JSONB NOT NULL,  -- [{title, description, type, estimated_hours, resources[], completed}]
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  related_entity_type TEXT,
  related_entity_id UUID
);

-- AI Configuration
CREATE TABLE ai_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_screening_threshold INT DEFAULT 50 CHECK (resume_screening_threshold BETWEEN 0 AND 100),
  max_rescreen_attempts INT DEFAULT 2 CHECK (max_rescreen_attempts BETWEEN 0 AND 5),
  interview_max_questions INT DEFAULT 15 CHECK (interview_max_questions BETWEEN 5 AND 30),
  interview_time_limit_minutes INT DEFAULT 30 CHECK (interview_time_limit_minutes BETWEEN 10 AND 60),
  gemini_model TEXT DEFAULT 'gemini-1.5-pro',
  gemini_embedding_model TEXT DEFAULT 'models/text-embedding-004',
  stt_model TEXT DEFAULT 'whisper-1',
  tts_model TEXT DEFAULT 'tts-1',
  tts_voice TEXT DEFAULT 'nova',
  system_prompt_interview TEXT,
  system_prompt_feedback TEXT,
  system_prompt_roadmap TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- Insert default AI config
INSERT INTO ai_config (id, system_prompt_interview, system_prompt_feedback, system_prompt_roadmap)
VALUES (
  gen_random_uuid(),
  'You are an expert technical interviewer conducting a mock interview for a {{role}} position at {{company}}. The candidate has the following background: {{resume_summary}}. Required skills: {{required_skills}}. Ask relevant, progressive questions. Maintain context. Be professional but encouraging.',
  'You are an expert interview evaluator. Analyze the interview transcript and provide scores for: communication, technical knowledge, problem solving, answer relevance. Identify strengths, weaknesses, and specific recommendations.',
  'You are a career coach. Based on the interview weaknesses: {{weaknesses}}, create a 4-week preparation roadmap with specific focus areas, tasks, and resources for each week.'
);
```

---

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE tpos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE TABLE student_skills ENABLE ROW LEVEL SECURITY;
CREATE TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE TABLE placement_drives ENABLE ROW LEVEL SECURITY;
CREATE TABLE drive_skills ENABLE ROW LEVEL SECURITY;
CREATE TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE TABLE resumes ENABLE ROW LEVEL SECURITY;
CREATE TABLE resume_scores ENABLE ROW LEVEL SECURITY;
CREATE TABLE tests ENABLE ROW LEVEL SECURITY;
CREATE TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE TABLE test_attempts ENABLE ROW LEVEL SECURITY;
CREATE TABLE test_answers ENABLE ROW LEVEL SECURITY;
CREATE TABLE interviews ENABLE ROW LEVEL SECURITY;
CREATE TABLE interview_questions ENABLE ROW LEVEL SECURITY;
CREATE TABLE interview_answers ENABLE ROW LEVEL SECURITY;
CREATE TABLE interview_feedback ENABLE ROW LEVEL SECURITY;
CREATE TABLE roadmaps ENABLE ROW LEVEL SECURITY;
CREATE TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE TABLE ai_config ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read own, admins can read all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Students: Students can CRUD own, TPOs/Admin can read all in their college
CREATE POLICY "Students manage own profile" ON students
  FOR ALL USING (auth.uid() = id);
CREATE POLICY "TPOs view college students" ON students
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tpos WHERE id = auth.uid() AND college_id = students.college_id)
  );
CREATE POLICY "Admins view all students" ON students
  FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Placement Drives: Public read for published, TPO/Admin manage own college
CREATE POLICY "Published drives readable by all" ON placement_drives
  FOR SELECT USING (status = 'published');
CREATE POLICY "TPOs manage own drives" ON placement_drives
  FOR ALL USING (tpo_id = auth.uid());
CREATE POLICY "Admins manage all drives" ON placement_drives
  FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Applications: Students manage own, TPOs view for their drives
CREATE POLICY "Students manage own applications" ON applications
  FOR ALL USING (student_id = auth.uid());
CREATE POLICY "TPOs view drive applications" ON applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM placement_drives WHERE id = drive_id AND tpo_id = auth.uid())
  );

-- Resumes: Students manage own, TPOs view for their drive applications
CREATE POLICY "Students manage own resumes" ON resumes
  FOR ALL USING (student_id = auth.uid());
CREATE POLICY "TPOs view drive resumes" ON resumes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN placement_drives d ON a.drive_id = d.id
      WHERE a.student_id = resumes.student_id AND d.tpo_id = auth.uid()
    )
  );

-- Interviews: Students manage own, TPOs view for their drives
CREATE POLICY "Students manage own interviews" ON interviews
  FOR ALL USING (student_id = auth.uid());
CREATE POLICY "TPOs view drive interviews" ON interviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM placement_drives WHERE id = drive_id AND tpo_id = auth.uid())
  );

-- Notifications: Users read own
CREATE POLICY "Users read own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System inserts notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- AI Config: Admins only
CREATE POLICY "Admins manage AI config" ON ai_config
  FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
```

---

## HeyGen Integration Architecture

### HeyGen Streaming Avatar Setup

```typescript
// lib/heygen.ts
import { StreamingAvatar } from '@heygen/streaming-avatar';

interface HeyGenConfig {
  avatarId: string;
  voiceId: string;
  knowledgeId?: string;  // Optional: RAG knowledge base
}

interface InterviewSession {
  sessionId: string;
  token: string;
  url: string;
  expiresAt: number;
}

// Create HeyGen streaming session via Supabase Edge Function
export async function createHeyGenSession(
  driveId: string,
  studentId: string,
  config: HeyGenConfig
): Promise<InterviewSession> {
  const { data, error } = await supabase.functions.invoke('heygen-create-session', {
    body: { driveId, studentId, ...config }
  });
  if (error) throw error;
  return data;
}

// Initialize HeyGen avatar in React component
export function useHeyGenAvatar(session: InterviewSession) {
  const avatarRef = useRef<HTMLDivElement>(null);
  const [avatar, setAvatar] = useState<StreamingAvatar | null>(null);

  useEffect(() => {
    if (!avatarRef.current || !session) return;

    const newAvatar = new StreamingAvatar({
      token: session.token,
      avatarId: config.avatarId,
    });

    newAvatar.mount(avatarRef.current);
    setAvatar(newAvatar);

    return () => {
      newAvatar.unmount();
      setAvatar(null);
    };
  }, [session]);

  const speak = (text: string) => avatar?.speak({ text });
  const listen = (onTranscript: (text: string) => void) => 
    avatar?.on('transcript', onTranscript);

  return { avatarRef, speak, listen, avatar };
}
```

### Supabase Edge Function: `heygen-create-session`

```typescript
// supabase/functions/heygen-create-session/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const HEYGEN_API_KEY = Deno.env.get('HEYGEN_API_KEY')!;
const HEYGEN_AVATAR_ID = Deno.env.get('HEYGEN_AVATAR_ID')!;
const HEYGEN_VOICE_ID = Deno.env.get('HEYGEN_VOICE_ID')!;

serve(async (req) => {
  const { driveId, studentId } = await req.json();
  
  // Fetch drive + student context for personalized interview
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  const { data: drive } = await supabase
    .from('placement_drives')
    .select('*, company:companies(*)')
    .eq('id', driveId)
    .single();
    
  const { data: student } = await supabase
    .from('students')
    .select('*, profiles(full_name)')
    .eq('id', studentId)
    .single();

  // Create HeyGen streaming session
  const response = await fetch('https://api.heygen.com/v1/streaming.create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HEYGEN_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      avatar_id: HEYGEN_AVATAR_ID,
      voice_id: HEYGEN_VOICE_ID,
      quality: 'high',
      version: 'v2',
    }),
  });

  const { data: sessionData } = await response.json();

  // Store session mapping
  await supabase.from('interviews').insert({
    student_id: studentId,
    drive_id: driveId,
    heygen_session_id: sessionData.session_id,
    status: 'pending',
  });

  return new Response(JSON.stringify({
    sessionId: sessionData.session_id,
    token: sessionData.token,
    url: sessionData.url,
    expiresAt: Date.now() + 30 * 60 * 1000, // 30 min
  }), { headers: { 'Content-Type': 'application/json' } });
});
```

---

## AI Services (FastAPI) - Only for Heavy ML

### `apps/ai-services/src/services/resume_parser.py`
```python
"""Resume parsing using OpenAI structured extraction."""

import json
from typing import Optional
from pydantic import BaseModel, Field
from openai import AsyncOpenAI
import pdfplumber
import docx

class Education(BaseModel):
    degree: str
    institution: str
    year: Optional[int] = None
    cgpa: Optional[float] = None

class Project(BaseModel):
    name: str
    description: str
    technologies: list[str]

class Internship(BaseModel):
    company: str
    role: str
    duration: str
    description: str

class Experience(BaseModel):
    company: str
    role: str
    duration: str
    description: str

class ResumeParsedData(BaseModel):
    education: list[Education]
    skills: list[str]
    projects: list[Project]
    certifications: list[str]
    internships: list[Internship]
    experience: list[Experience]
    keywords: list[str]

async def parse_resume(file_path: str, mime_type: str) -> ResumeParsedData:
    # Extract text from PDF/DOCX
    text = ""
    if mime_type == "application/pdf":
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    elif mime_type in ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        doc = docx.Document(file_path)
        text = "\n".join([p.text for p in doc.paragraphs])

    # Use OpenAI for structured extraction
    client = AsyncOpenAI()
    
    system_prompt = """Extract structured information from the resume. 
    Return JSON matching the ResumeParsedData schema exactly.
    Be thorough but accurate. If information is missing, use empty arrays."""
    
    response = await client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Resume text:\n{text[:15000]}"},
        ],
        response_format=ResumeParsedData,
    )
    
    return response.choices[0].message.parsed
```

### `apps/ai-services/src/services/resume_matcher.py`
```python
"""Resume-JD semantic matching using embeddings + keyword overlap."""

import numpy as np
from openai import AsyncOpenAI
from typing import List

client = AsyncOpenAI()

async def get_embedding(text: str) -> List[float]:
    response = await client.embeddings.create(
        model="text-embedding-3-large",
        input=text[:8000],  # Truncate if needed
    )
    return response.data[0].embedding

def cosine_similarity(a: List[float], b: List[float]) -> float:
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

async def match_resume_to_drive(
    resume_data: dict,
    drive_requirements: dict,
    threshold: int = 50
) -> dict:
    # Prepare texts for embedding
    resume_text = f"""
    Skills: {', '.join(resume_data.get('skills', []))}
    Projects: {', '.join([p['name'] + ': ' + p['description'] for p in resume_data.get('projects', [])])}
    Experience: {', '.join([e['role'] + ' at ' + e['company'] for e in resume_data.get('experience', [])])}
    Keywords: {', '.join(resume_data.get('keywords', []))}
    """
    
    drive_text = f"""
    Role: {drive_requirements.get('role', '')}
    Description: {drive_requirements.get('description', '')}
    Required Skills: {', '.join(drive_requirements.get('required_skills', []))}
    Qualifications: {drive_requirements.get('qualifications', '')}
    """
    
    # Get embeddings
    resume_emb, drive_emb = await asyncio.gather(
        get_embedding(resume_text),
        get_embedding(drive_text)
    )
    
    semantic_score = cosine_similarity(resume_emb, drive_emb) * 100
    
    # Keyword overlap
    resume_skills = set(s.lower() for s in resume_data.get('skills', []))
    resume_keywords = set(k.lower() for k in resume_data.get('keywords', []))
    required_skills = set(s.lower() for s in drive_requirements.get('required_skills', []))
    
    skill_overlap = len(resume_skills & required_skills) / max(len(required_skills), 1) * 100
    keyword_overlap = len(resume_keywords & required_skills) / max(len(required_skills), 1) * 100
    
    # Weighted overall score
    overall = 0.5 * semantic_score + 0.3 * skill_overlap + 0.2 * keyword_overlap
    
    missing_skills = list(required_skills - resume_skills)
    missing_keywords = list(required_skills - resume_keywords)
    
    # Generate recommendations via LLM
    recommendations = await generate_recommendations(missing_skills, drive_requirements)
    
    return {
        "overall_score": round(overall),
        "skill_match_score": round(skill_overlap),
        "keyword_match_score": round(keyword_overlap),
        "missing_skills": missing_skills[:10],
        "missing_keywords": missing_keywords[:10],
        "recommendations": recommendations,
        "passed": overall >= threshold
    }

async def generate_recommendations(missing_skills: List[str], drive: dict) -> List[str]:
    if not missing_skills:
        return ["Your profile matches well. Focus on interview preparation."]
    
    client = AsyncOpenAI()
    prompt = f"""Given missing skills: {missing_skills} for a {drive.get('role')} role at {drive.get('company', {}).get('name', 'company')}.
    Provide 3-5 specific, actionable recommendations for improvement."""
    
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
    )
    
    return [line.strip("- ") for line in response.choices[0].message.content.split("\n") if line.strip()]
```

### `apps/ai-services/src/services/interview_engine.py`
```python
"""AI Interview question generation and evaluation."""

from openai import AsyncOpenAI
from typing import List, Dict, Optional
from pydantic import BaseModel

client = AsyncOpenAI()

class InterviewQuestion(BaseModel):
    question: str
    category: str  # hr, technical, behavioral, project, role_specific
    follow_up_hints: List[str]

class InterviewEvaluation(BaseModel):
    communication_score: int
    technical_score: int
    problem_solving_score: int
    relevance_score: int
    overall_score: int
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    detailed_feedback: str

async def generate_interview_question(
    resume_summary: str,
    drive_requirements: dict,
    previous_qa: List[Dict],
    question_number: int,
    max_questions: int = 15
) -> InterviewQuestion:
    """Generate next interview question based on context."""
    
    categories = ['hr', 'technical', 'behavioral', 'project', 'role_specific']
    # Distribute categories across interview
    if question_number <= 2:
        focus = 'hr'
    elif question_number <= 5:
        focus = 'technical'
    elif question_number <= 8:
        focus = 'behavioral'
    elif question_number <= 11:
        focus = 'project'
    else:
        focus = 'role_specific'
    
    context = f"""
    Candidate Background: {resume_summary}
    Role: {drive_requirements.get('role')}
    Company: {drive_requirements.get('company', {}).get('name', 'N/A')}
    Required Skills: {drive_requirements.get('required_skills', [])}
    Previous Q&A: {json.dumps(previous_qa[-3:])}  # Last 3 exchanges
    Current Focus Area: {focus}
    Question Number: {question_number}/{max_questions}
    """
    
    system_prompt = """You are an expert interviewer. Generate ONE relevant, 
    progressive question. Consider previous answers. Return structured JSON."""
    
    response = await client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": context},
        ],
        response_format=InterviewQuestion,
    )
    
    return response.choices[0].message.parsed

async def evaluate_interview(
    transcript: List[Dict],
    resume_summary: str,
    drive_requirements: dict
) -> InterviewEvaluation:
    """Evaluate complete interview transcript."""
    
    context = f"""
    Full Transcript: {json.dumps(transcript)}
    Candidate Background: {resume_summary}
    Role: {drive_requirements.get('role')}
    Required Skills: {drive_requirements.get('required_skills', [])}
    """
    
    system_prompt = """You are an expert interview evaluator. Provide comprehensive 
    evaluation with scores (0-100) and actionable feedback. Be specific and constructive."""
    
    response = await client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": context},
        ],
        response_format=InterviewEvaluation,
    )
    
    return response.choices[0].message.parsed
```

---

## Next.js Frontend Structure (Key Files)

### `apps/web/src/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => 
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

### `apps/web/src/lib/supabase/server.ts`
```typescript
import { createServerClient, type CookieOptions } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createServerClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) { 
          cookieStore.set({ name, value, ...options }); 
        },
        remove(name: string, options: CookieOptions) { 
          cookieStore.set({ name, value: '', ...options }); 
        },
      },
    }
  );
};
```

### `apps/web/src/components/interview/HeyGenInterview.tsx`
```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { StreamingAvatar, StreamingAvatarProps } from '@heygen/streaming-avatar';
import { Mic, MicOff, X, Volume2, VolumeX } from 'lucide-react';

interface HeyGenInterviewProps {
  sessionId: string;
  token: string;
  onQuestion: (question: string, category: string) => void;
  onTranscript: (speaker: 'interviewer' | 'candidate', text: string) => void;
  onComplete: (feedback: any) => void;
  onError: (error: Error) => void;
}

export function HeyGenInterview({
  sessionId,
  token,
  onQuestion,
  onTranscript,
  onComplete,
  onError,
}: HeyGenInterviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    if (!containerRef.current) return;

    const avatar = new StreamingAvatar({
      token,
      sessionId,
      avatarId: process.env.NEXT_PUBLIC_HEYGEN_AVATAR_ID!,
    });

    avatar.on('avatar_start_talking', (data) => {
      onQuestion(data.text, data.category || 'general');
      onTranscript('interviewer', data.text);
    });

    avatar.on('user_transcript', (data) => {
      if (data.is_final) {
        onTranscript('candidate', data.text);
      }
    });

    avatar.on('session_end', async () => {
      setConnectionStatus('disconnected');
      // Fetch feedback from our backend
      const res = await fetch(`/api/interviews/${sessionId}/complete`, { method: 'POST' });
      const feedback = await res.json();
      onComplete(feedback);
    });

    avatar.on('error', (err) => onError(new Error(err.message)));

    avatar.mount(containerRef.current);
    avatarRef.current = avatar;
    setConnectionStatus('connected');

    return () => {
      avatar.unmount();
      avatarRef.current = null;
    };
  }, [sessionId, token, onQuestion, onTranscript, onComplete, onError]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    avatarRef.current?.muteMicrophone(isMuted);
  };

  const endInterview = () => {
    avatarRef.current?.close();
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-slate-950 rounded-2xl overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-slate-950/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
          <span className="text-sm font-medium text-slate-300">Microsoft • SDE Intern</span>
          <span className="w-2 h-2 rounded-full bg-sky-500" />
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-950/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-800 text-sky-400 font-mono text-lg tabular-nums" id="timer">
            12:34
          </div>
          <button onClick={endInterview} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl border border-red-500/30 flex items-center gap-2 transition-colors">
            <X className="w-4 h-4" /> End
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <button 
          onClick={toggleMute}
          className={`p-3 rounded-xl border transition-colors ${
            isMuted 
              ? 'bg-slate-950/80 border-slate-700 text-slate-400' 
              : 'bg-sky-500/20 border-sky-500/30 text-sky-400 animate-pulse'
          }`}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        
        <div className="bg-slate-950/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
          <span className="text-sm text-slate-400">Question</span>
          <span className="text-lg font-mono tabular-nums text-sky-400" id="question-counter">
            3 / 10
          </span>
        </div>
      </div>

      {/* Progress Dots - Left Side */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i < 3 ? 'bg-sky-500' : 'bg-slate-700'
            } ${i === 3 ? 'bg-sky-500/50 animate-pulse' : ''}`}
          />
        ))}
      </div>

      {/* Transcript Overlay - Bottom Center */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-10">
        <div className="bg-slate-950/90 backdrop-blur rounded-2xl border border-slate-800 p-4 max-h-64 overflow-y-auto">
          <div className="space-y-3" id="transcript">
            {/* Transcript messages inserted here via onTranscript */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Environment Variables

### `.env.local` (Frontend)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_HEYGEN_AVATAR_ID=your-avatar-id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### `.env` (AI Services)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
HEYGEN_API_KEY=your-heygen-key
HEYGEN_AVATAR_ID=your-avatar-id
HEYGEN_VOICE_ID=your-voice-id
```

### Supabase Dashboard Settings
```
Project Settings > API > anon/public key
Project Settings > API > service_role key (server only)
Authentication > Providers > Email (enable)
Authentication > Email Templates > Confirm signup (customize)
Storage > Buckets > resumes (private), recordings (private), avatars (public)
Edge Functions > Deploy heygen-create-session
Database > Extensions > pgvector (for embeddings if needed)
```

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Generate Supabase types
cd packages/supabase && npx supabase gen types typescript --local > types.ts

# Run migrations locally
npx supabase migration up

# Start development
pnpm dev                    # Starts Next.js (web) + FastAPI (ai-services)
pnpm dev:web               # Next.js only
pnpm dev:ai                # FastAPI only

# Deploy
vercel deploy --prod       # Frontend
fly deploy                 # AI Services (or Railway/Render)
supabase functions deploy  # Edge Functions
```

---

## Key Integration Points

| Feature | Implementation |
|---------|----------------|
| **Auth** | Supabase Auth (Email/Password + OAuth) |
| **Database** | Supabase PostgreSQL + RLS |
| **Real-time** | Supabase Realtime (interview transcript sync) |
| **File Storage** | Supabase Storage (resumes, recordings) |
| **AI Avatar** | HeyGen Streaming Avatar SDK |
| **AI Logic** | FastAPI service (OpenAI GPT-4o + Embeddings) |
| **Notifications** | Supabase Realtime + Email (SendGrid/Resend) |
| **Payments** | Stripe (if needed for premium features) |

---

## Migration Path from Original Spec

| Original | New (Supabase + HeyGen) |
|----------|-------------------------|
| Custom JWT Auth | Supabase Auth (JWT + Refresh built-in) |
| Custom PostgreSQL | Supabase PostgreSQL + RLS |
| Custom WebSocket Server | Supabase Realtime |
| Custom File Storage | Supabase Storage |
| Custom AI Avatar | HeyGen Streaming Avatar |
| Custom Backend API | Supabase Edge Functions + FastAPI AI Service |
| Background Jobs | Supabase pg_cron / Edge Functions |

This architecture reduces custom backend code by ~70% while gaining enterprise-grade auth, realtime, and storage.