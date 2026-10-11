-- Row Level Security Policies
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE tpos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_config ENABLE ROW LEVEL SECURITY;

-- Helper functions for role checks
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admins WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_tpo()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM tpos WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_student()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM students WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_college_id()
RETURNS UUID AS $$
DECLARE
  college_id UUID;
BEGIN
  SELECT college_id INTO college_id FROM students WHERE id = auth.uid();
  IF college_id IS NULL THEN
    SELECT college_id INTO college_id FROM tpos WHERE id = auth.uid();
  END IF;
  RETURN college_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PROFILES POLICIES
-- ============================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin());

-- Admins can insert profiles (for user creation)
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (is_admin());

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (is_admin());

-- ============================================
-- COLLEGES POLICIES
-- ============================================
-- Everyone can view colleges (for dropdowns)
CREATE POLICY "Colleges are viewable by all authenticated users" ON colleges
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admins can manage colleges
CREATE POLICY "Admins can manage colleges" ON colleges
  FOR ALL USING (is_admin());

-- ============================================
-- STUDENTS POLICIES
-- ============================================
-- Students can manage their own profile
CREATE POLICY "Students manage own profile" ON students
  FOR ALL USING (auth.uid() = id);

-- TPOs can view students in their college
CREATE POLICY "TPOs view college students" ON students
  FOR SELECT USING (
    is_tpo() AND college_id = get_user_college_id()
  );

-- Admins can view all students
CREATE POLICY "Admins view all students" ON students
  FOR SELECT USING (is_admin());

-- Admins can manage all students
CREATE POLICY "Admins manage all students" ON students
  FOR ALL USING (is_admin());

-- ============================================
-- TPOS POLICIES
-- ============================================
-- TPOs can manage their own profile
CREATE POLICY "TPOs manage own profile" ON tpos
  FOR ALL USING (auth.uid() = id);

-- Admins can view all TPOs
CREATE POLICY "Admins view all TPOs" ON tpos
  FOR SELECT USING (is_admin());

-- Admins can manage all TPOs
CREATE POLICY "Admins manage all TPOs" ON tpos
  FOR ALL USING (is_admin());

-- ============================================
-- ADMINS POLICIES
-- ============================================
-- Admins can view all admins
CREATE POLICY "Admins view all admins" ON admins
  FOR SELECT USING (is_admin());

-- Admins can manage all admins
CREATE POLICY "Admins manage all admins" ON admins
  FOR ALL USING (is_admin());

-- ============================================
-- SKILLS POLICIES
-- ============================================
-- Everyone can view skills
CREATE POLICY "Skills are viewable by all authenticated users" ON skills
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admins can manage skills
CREATE POLICY "Admins manage skills" ON skills
  FOR ALL USING (is_admin());

-- ============================================
-- STUDENT SKILLS POLICIES
-- ============================================
-- Students can manage their own skills
CREATE POLICY "Students manage own skills" ON student_skills
  FOR ALL USING (student_id = auth.uid());

-- TPOs can view skills of students in their college
CREATE POLICY "TPOs view college student skills" ON student_skills
  FOR SELECT USING (
    is_tpo() AND EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = student_skills.student_id 
      AND s.college_id = get_user_college_id()
    )
  );

-- Admins can view all student skills
CREATE POLICY "Admins view all student skills" ON student_skills
  FOR SELECT USING (is_admin());

-- ============================================
-- COMPANIES POLICIES
-- ============================================
-- Everyone can view companies
CREATE POLICY "Companies are viewable by all authenticated users" ON companies
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admins can manage companies
CREATE POLICY "Admins manage companies" ON companies
  FOR ALL USING (is_admin());

-- TPOs can create companies (for drives)
CREATE POLICY "TPOs can create companies" ON companies
  FOR INSERT WITH CHECK (is_tpo());

-- ============================================
-- PLACEMENT DRIVES POLICIES
-- ============================================
-- Published drives are readable by all authenticated users
CREATE POLICY "Published drives readable by all" ON placement_drives
  FOR SELECT USING (status = 'published' AND auth.role() = 'authenticated');

-- TPOs can view all drives in their college (including drafts)
CREATE POLICY "TPOs view college drives" ON placement_drives
  FOR SELECT USING (
    is_tpo() AND (
      tpo_id = auth.uid() OR 
      EXISTS (SELECT 1 FROM tpos WHERE id = auth.uid() AND college_id = placement_drives.tpo_id)
    )
  );

-- TPOs can manage their own drives
CREATE POLICY "TPOs manage own drives" ON placement_drives
  FOR ALL USING (tpo_id = auth.uid());

-- Admins can manage all drives
CREATE POLICY "Admins manage all drives" ON placement_drives
  FOR ALL USING (is_admin());

-- Students can view published drives they're eligible for
CREATE POLICY "Students view eligible published drives" ON placement_drives
  FOR SELECT USING (
    is_student() AND status = 'published' AND
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = auth.uid()
      AND s.cgpa >= placement_drives.min_cgpa
      AND (placement_drives.eligible_departments = '{}' OR s.department = ANY(placement_drives.eligible_departments))
    )
  );

-- ============================================
-- DRIVE SKILLS POLICIES
-- ============================================
-- Viewable with drive access
CREATE POLICY "Drive skills viewable with drive access" ON drive_skills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM placement_drives d
      WHERE d.id = drive_skills.drive_id
      AND (
        d.status = 'published' OR
        d.tpo_id = auth.uid() OR
        is_admin()
      )
    )
  );

-- TPOs can manage drive skills for their drives
CREATE POLICY "TPOs manage own drive skills" ON drive_skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM placement_drives d
      WHERE d.id = drive_skills.drive_id
      AND d.tpo_id = auth.uid()
    )
  );

-- Admins can manage all drive skills
CREATE POLICY "Admins manage all drive skills" ON drive_skills
  FOR ALL USING (is_admin());

-- ============================================
-- APPLICATIONS POLICIES
-- ============================================
-- Students can manage their own applications
CREATE POLICY "Students manage own applications" ON applications
  FOR ALL USING (student_id = auth.uid());

-- TPOs can view applications for their drives
CREATE POLICY "TPOs view drive applications" ON applications
  FOR SELECT USING (
    is_tpo() AND EXISTS (
      SELECT 1 FROM placement_drives d
      WHERE d.id = applications.drive_id
      AND d.tpo_id = auth.uid()
    )
  );

-- TPOs can update application status for their drives
CREATE POLICY "TPOs update drive application status" ON applications
  FOR UPDATE USING (
    is_tpo() AND EXISTS (
      SELECT 1 FROM placement_drives d
      WHERE d.id = applications.drive_id
      AND d.tpo_id = auth.uid()
    )
  );

-- Admins can view all applications
CREATE POLICY "Admins view all applications" ON applications
  FOR SELECT USING (is_admin());

-- Admins can manage all applications
CREATE POLICY "Admins manage all applications" ON applications
  FOR ALL USING (is_admin());

-- ============================================
-- RESUMES POLICIES
-- ============================================
-- Students can manage their own resumes
CREATE POLICY "Students manage own resumes" ON resumes
  FOR ALL USING (student_id = auth.uid());

-- TPOs can view resumes for their drive applications
CREATE POLICY "TPOs view drive resumes" ON resumes
  FOR SELECT USING (
    is_tpo() AND EXISTS (
      SELECT 1 FROM applications a
      JOIN placement_drives d ON a.drive_id = d.id
      WHERE a.student_id = resumes.student_id
      AND d.tpo_id = auth.uid()
    )
  );

-- Admins can view all resumes
CREATE POLICY "Admins view all resumes" ON resumes
  FOR SELECT USING (is_admin());

-- ============================================
-- RESUME SCORES POLICIES
-- ============================================
-- Students can view their own resume scores
CREATE POLICY "Students view own resume scores" ON resume_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM resumes r
      WHERE r.id = resume_scores.resume_id
      AND r.student_id = auth.uid()
    )
  );

-- TPOs can view resume scores for their drives
CREATE POLICY "TPOs view drive resume scores" ON resume_scores
  FOR SELECT USING (
    is_tpo() AND EXISTS (
      SELECT 1 FROM placement_drives d
      WHERE d.id = resume_scores.drive_id
      AND d.tpo_id = auth.uid()
    )
  );

-- System/AI service can insert/update resume scores
CREATE POLICY "System can manage resume scores" ON resume_scores
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can view all resume scores
CREATE POLICY "Admins view all resume scores" ON resume_scores
  FOR SELECT USING (is_admin());

-- ============================================
-- TESTS POLICIES
-- ============================================
-- Students can view tests for drives they've applied to
CREATE POLICY "Students view tests for applied drives" ON tests
  FOR SELECT USING (
    is_student() AND EXISTS (
      SELECT 1 FROM applications a
      WHERE a.student_id = auth.uid()
      AND a.drive_id = tests.drive_id
      AND a.status IN ('shortlisted', 'test', 'ai_interview', 'company_process', 'selected')
    )
  );

-- TPOs can manage tests for their drives
CREATE POLICY "TPOs manage own drive tests" ON tests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM placement_drives d
      WHERE d.id = tests.drive_id
      AND d.tpo_id = auth.uid()
    )
  );

-- Admins can manage all tests
CREATE POLICY "Admins manage all tests" ON tests
  FOR ALL USING (is_admin());

-- ============================================
-- QUESTIONS POLICIES
-- ============================================
-- Students can view questions during test attempt
CREATE POLICY "Students view questions during attempt" ON questions
  FOR SELECT USING (
    is_student() AND EXISTS (
      SELECT 1 FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      WHERE ta.student_id = auth.uid()
      AND t.id = questions.test_id
      AND ta.status = 'in_progress'
    )
  );

-- TPOs can manage questions for their tests
CREATE POLICY "TPOs manage own test questions" ON questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tests t
      JOIN placement_drives d ON t.drive_id = d.id
      WHERE t.id = questions.test_id
      AND d.tpo_id = auth.uid()
    )
  );

-- Admins can manage all questions
CREATE POLICY "Admins manage all questions" ON questions
  FOR ALL USING (is_admin());

-- ============================================
-- TEST ATTEMPTS POLICIES
-- ============================================
-- Students can manage their own attempts
CREATE POLICY "Students manage own attempts" ON test_attempts
  FOR ALL USING (student_id = auth.uid());

-- TPOs can view attempts for their drives
CREATE POLICY "TPOs view drive attempts" ON test_attempts
  FOR SELECT USING (
    is_tpo() AND EXISTS (
      SELECT 1 FROM tests t
      JOIN placement_drives d ON t.drive_id = d.id
      WHERE t.id = test_attempts.test_id
      AND d.tpo_id = auth.uid()
    )
  );

-- Admins can view all attempts
CREATE POLICY "Admins view all attempts" ON test_attempts
  FOR SELECT USING (is_admin());

-- ============================================
-- TEST ANSWERS POLICIES
-- ============================================
-- Students can manage their own answers
CREATE POLICY "Students manage own answers" ON test_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM test_attempts ta
      WHERE ta.id = test_answers.attempt_id
      AND ta.student_id = auth.uid()
    )
  );

-- TPOs can view answers for their drives
CREATE POLICY "TPOs view drive answers" ON test_answers
  FOR SELECT USING (
    is_tpo() AND EXISTS (
      SELECT 1 FROM test_attempts ta
      JOIN tests t ON ta.test_id = t.id
      JOIN placement_drives d ON t.drive_id = d.id
      WHERE ta.id = test_answers.attempt_id
      AND d.tpo_id = auth.uid()
    )
  );

-- Admins can view all answers
CREATE POLICY "Admins view all answers" ON test_answers
  FOR SELECT USING (is_admin());

-- ============================================
-- INTERVIEWS POLICIES
-- ============================================
-- Students can manage their own interviews
CREATE POLICY "Students manage own interviews" ON interviews
  FOR ALL USING (student_id = auth.uid());

-- TPOs can view interviews for their drives
CREATE POLICY "TPOs view drive interviews" ON interviews
  FOR SELECT USING (
    is_tpo() AND EXISTS (
      SELECT 1 FROM placement_drives d
      WHERE d.id = interviews.drive_id
      AND d.tpo_id = auth.uid()
    )
  );

-- Admins can view all interviews
CREATE POLICY "Admins view all interviews" ON interviews
  FOR SELECT USING (is_admin());

-- System/Edge Functions can manage interviews
CREATE POLICY "System can manage interviews" ON interviews
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- INTERVIEW QUESTIONS POLICIES
-- ============================================
-- Students can view questions for their interviews
CREATE POLICY "Students view own interview questions" ON interview_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM interviews i
      WHERE i.id = interview_questions.interview_id
      AND i.student_id = auth.uid()
    )
  );

-- TPOs can view questions for their drives
CREATE POLICY "TPOs view drive interview questions" ON interview_questions
  FOR SELECT USING (
    is_tpo() AND EXISTS (
      SELECT 1 FROM interviews i
      JOIN placement_drives d ON i.drive_id = d.id
      WHERE i.id = interview_questions.interview_id
      AND d.tpo_id = auth.uid()
    )
  );

-- System can manage interview questions
CREATE POLICY "System can manage interview questions" ON interview_questions
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can view all interview questions
CREATE POLICY "Admins view all interview questions" ON interview_questions
  FOR SELECT USING (is_admin());

-- ============================================
-- INTERVIEW ANSWERS POLICIES
-- ============================================
-- Students can manage their own answers
CREATE POLICY "Students manage own interview answers" ON interview_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM interviews i
      WHERE i.id = interview_answers.interview_id
      AND i.student_id = auth.uid()
    )
  );

-- TPOs can view answers for their drives
CREATE POLICY "TPOs view drive interview answers" ON interview_answers
  FOR SELECT USING (
    is_tpo() AND EXISTS (
      SELECT 1 FROM interviews i
      JOIN placement_drives d ON i.drive_id = d.id
      WHERE i.id = interview_answers.interview_id
      AND d.tpo_id = auth.uid()
    )
  );

-- System can manage interview answers
CREATE POLICY "System can manage interview answers" ON interview_answers
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can view all interview answers
CREATE POLICY "Admins view all interview answers" ON interview_answers
  FOR SELECT USING (is_admin());

-- ============================================
-- INTERVIEW FEEDBACK POLICIES
-- ============================================
-- Students can view their own feedback
CREATE POLICY "Students view own feedback" ON interview_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM interviews i
      WHERE i.id = interview_feedback.interview_id
      AND i.student_id = auth.uid()
    )
  );

-- TPOs can view feedback for their drives
CREATE POLICY "TPOs view drive feedback" ON interview_feedback
  FOR SELECT USING (
    is_tpo() AND EXISTS (
      SELECT 1 FROM interviews i
      JOIN placement_drives d ON i.drive_id = d.id
      WHERE i.id = interview_feedback.interview_id
      AND d.tpo_id = auth.uid()
    )
  );

-- System can insert feedback
CREATE POLICY "System can insert feedback" ON interview_feedback
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Admins can view all feedback
CREATE POLICY "Admins view all feedback" ON interview_feedback
  FOR SELECT USING (is_admin());

-- ============================================
-- ROADMAPS POLICIES
-- ============================================
-- Students can view their own roadmaps
CREATE POLICY "Students view own roadmaps" ON roadmaps
  FOR SELECT USING (student_id = auth.uid());

-- TPOs can view roadmaps for their drives
CREATE POLICY "TPOs view drive roadmaps" ON roadmaps
  FOR SELECT USING (
    is_tpo() AND (
      drive_id IS NULL OR EXISTS (
        SELECT 1 FROM placement_drives d
        WHERE d.id = roadmaps.drive_id
        AND d.tpo_id = auth.uid()
      )
    )
  );

-- System can manage roadmaps
CREATE POLICY "System can manage roadmaps" ON roadmaps
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can view all roadmaps
CREATE POLICY "Admins view all roadmaps" ON roadmaps
  FOR SELECT USING (is_admin());

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================
-- Users can view their own notifications
CREATE POLICY "Users view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- System can insert notifications
CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Admins can view all notifications
CREATE POLICY "Admins view all notifications" ON notifications
  FOR SELECT USING (is_admin());

-- ============================================
-- AI CONFIG POLICIES
-- ============================================
-- Only admins can access AI config
CREATE POLICY "Admins manage AI config" ON ai_config
  FOR ALL USING (is_admin());