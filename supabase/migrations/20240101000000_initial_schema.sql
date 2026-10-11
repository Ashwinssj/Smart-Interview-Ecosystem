-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom types
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

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Placement Drives
CREATE TABLE placement_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  tpo_id UUID REFERENCES tpos(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  ctc TEXT NOT NULL,
  employment_type employment_type NOT NULL,
  eligibility_criteria TEXT NOT NULL,
  min_cgpa NUMERIC(3,2) CHECK (min_cgpa >= 0 AND min_cgpa <= 10),
  eligible_departments TEXT[] NOT NULL DEFAULT '{}',
  required_skills TEXT[] NOT NULL DEFAULT '{}',
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
  weight INT DEFAULT 1 CHECK (weight BETWEEN 1 AND 10),
  PRIMARY KEY (drive_id, skill_id)
);

-- Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES placement_drives(id) ON DELETE CASCADE,
  status application_status DEFAULT 'open',
  resume_version INT DEFAULT 1 CHECK (resume_version > 0),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, drive_id)
);

-- Resumes
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES placement_drives(id) ON DELETE SET NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INT NOT NULL CHECK (file_size > 0),
  mime_type TEXT NOT NULL,
  parsed_data JSONB,
  version INT DEFAULT 1 CHECK (version > 0),
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
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
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
  order_index INT NOT NULL CHECK (order_index > 0),
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
  time_spent_seconds INT DEFAULT 0 CHECK (time_spent_seconds >= 0)
);

-- Test Answers
CREATE TABLE test_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer TEXT,
  is_correct BOOLEAN,
  time_spent_seconds INT DEFAULT 0 CHECK (time_spent_seconds >= 0)
);

-- AI Mock Interviews
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES placement_drives(id) ON DELETE CASCADE,
  heygen_session_id TEXT,
  status interview_status DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
  transcript_url TEXT,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Questions
CREATE TABLE interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  category interview_category NOT NULL,
  order_index INT NOT NULL CHECK (order_index > 0),
  ai_generated BOOLEAN DEFAULT TRUE,
  asked_at TIMESTAMPTZ
);

-- Interview Answers
CREATE TABLE interview_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  audio_url TEXT,
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
  tasks JSONB NOT NULL,
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

-- Indexes for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_students_college ON students(college_id);
CREATE INDEX idx_students_department ON students(department);
CREATE INDEX idx_tpos_college ON tpos(college_id);
CREATE INDEX idx_placement_drives_tpo ON placement_drives(tpo_id);
CREATE INDEX idx_placement_drives_status ON placement_drives(status);
CREATE INDEX idx_placement_drives_deadline ON placement_drives(deadline);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_drive ON applications(drive_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_resumes_student ON resumes(student_id);
CREATE INDEX idx_resume_scores_resume ON resume_scores(resume_id);
CREATE INDEX idx_tests_drive ON tests(drive_id);
CREATE INDEX idx_questions_test ON questions(test_id);
CREATE INDEX idx_test_attempts_student ON test_attempts(student_id);
CREATE INDEX idx_test_attempts_test ON test_attempts(test_id);
CREATE INDEX idx_interviews_student ON interviews(student_id);
CREATE INDEX idx_interviews_drive ON interviews(drive_id);
CREATE INDEX idx_interview_questions_interview ON interview_questions(interview_id);
CREATE INDEX idx_interview_answers_interview ON interview_answers(interview_id);
CREATE INDEX idx_interview_feedback_interview ON interview_feedback(interview_id);
CREATE INDEX idx_roadmaps_student ON roadmaps(student_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tpos_updated_at BEFORE UPDATE ON tpos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_placement_drives_updated_at BEFORE UPDATE ON placement_drives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_config_updated_at BEFORE UPDATE ON ai_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();